import compression from "compression";
import express from "express";
import fs from "fs";
import { parse } from "node-html-parser";
import passport from "passport";
import path from "path";
import request from "request";
import session from "express-session";
import whilst from "async/whilst";

const MemoryStore = require("session-memory-store")(session);

const app = express();
const port = process.env.PORT || 8080;
const year = 2018;

let keys;
if (process.env.NODE_ENV === "production") {
  keys = require("./.env.prod.json");
} else {
  keys = require("../.env.local.json");

  const os = require("os");
  const ifaces = os.networkInterfaces();

  Object.keys(ifaces).forEach(function(ifname) {
    var alias = 0;

    ifaces[ifname].forEach(function(iface) {
      if ("IPv4" !== iface.family || iface.internal !== false) {
        return;
      }

      if (alias >= 1) {
        console.log(ifname + ":" + alias, iface.address);
      } else {
        console.log(`Access at http://${iface.address}:${port}`);
      }
      ++alias;
    });
  });
}

app.use(compression());
app.use(
  session({
    secret: keys.secret,
    resave: true,
    saveUninitialized: true,
    store: new MemoryStore({
      expires: 60 * 60
    })
  })
);
app.enable("trust proxy");

let sxswArtists = [];
const getSXSW = () => {
  request(
    {
      url: `https://schedule.sxsw.com/${year}/artists`,
      headers: {
        Accept: "application/json"
      }
    },
    (err, response) => {
      if (!err && response.statusCode === 200) {
        const responseArtists = [].concat.apply(
          [],
          Object.values(JSON.parse(response.body))
        );
        let newSXSWArtists = [];
        for (let i = 0; i < responseArtists.length; i++) {
          if (responseArtists[i].spotify_url !== null) {
            let artist = responseArtists[i];
            let spotifyUrl = artist.spotify_url;
            artist.spotifyId = spotifyUrl.substring(
              spotifyUrl.lastIndexOf("/") + 1,
              spotifyUrl.length
            );
            newSXSWArtists.push(artist);
          }
        }

        if (newSXSWArtists.length > 0) {
          sxswArtists = newSXSWArtists;
        }
      }
    }
  );
};
getSXSW();
setInterval(() => {
  getSXSW();
}, 300000);

if (process.env.NODE_ENV === "production") {
  app.use((req, res, next) => {
    if (req.secure || req.headers.host === `localhost:${port}`) {
      next();
    } else {
      res.redirect(`https://${req.headers.host}${req.url}`);
    }
  });
}

const SpotifyStrategy = require("passport-spotify").Strategy;

passport.use(
  new SpotifyStrategy(
    {
      clientID: keys.spotifyClientId,
      clientSecret: keys.spotifyClientSecret,
      callbackURL: keys.spotifyCallback
    },
    function(accessToken, refreshToken, profile, done) {
      return done(null, profile, accessToken, refreshToken);
    }
  )
);

passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});

app.use(passport.initialize());
app.use(passport.session());

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

app.get(
  "/auth/spotify",
  passport.authenticate("spotify", {
    scope: ["user-library-read", "user-read-private"]
  }),
  function(req, res) {}
);

app.get("/auth/spotify/artist/:ids", ensureAuthenticated, function(req, res) {
  let artists = req.params.ids.split(",");
  let artistsChunked = [];
  while (artists.length > 0) {
    artistsChunked.push(artists.splice(0, 50).join(","));
  }

  let i = 0;
  let artistsInfo = [];
  whilst(
    function() {
      return i < artistsChunked.length;
    },
    function(next) {
      const fallbackTimer = setTimeout(function() {
        i = i + 1;
        next();
      }, 5000);

      request(
        {
          url: `https://api.spotify.com/v1/artists?ids=${artistsChunked[i]}`,
          headers: {
            Authorization: `Bearer ${req.session.state.accessToken}`,
            "user-agent": "node.js"
          }
        },
        (error, response, body) => {
          if (!error && response.statusCode == 200) {
            artistsInfo = [...artistsInfo, ...JSON.parse(body).artists];
          }
          i = i + 1;
          clearTimeout(fallbackTimer);
          next();
        }
      );
    },
    function(err) {
      // Get artists from tracks
      res.send(artistsInfo);
    }
  );
});

app.get("/auth/spotify/artists", ensureAuthenticated, function(req, res) {
  let endpoint = "https://api.spotify.com/v1/me/tracks?limit=50";
  let tracks = [];
  let artists = [];
  whilst(
    function() {
      return endpoint !== null;
    },
    function(next) {
      const fallbackTimer = setTimeout(function() {
        endpoint = null;
        next();
      }, 10000);

      request(
        {
          url: endpoint,
          headers: {
            Authorization: `Bearer ${req.session.state.accessToken}`,
            "user-agent": "node.js"
          }
        },
        (error, response, body) => {
          if (!error && response.statusCode == 200) {
            tracks = [...tracks, ...JSON.parse(body).items];
            endpoint = JSON.parse(body).next;
          }
          clearTimeout(fallbackTimer);
          next();
        }
      );
    },
    function(err) {
      // Get artists from tracks
      for (let i = 0; i < tracks.length; i++) {
        for (let j = 0; j < tracks[i].track.artists.length; j++) {
          artists.push(tracks[i].track.artists[j].id);
        }
      }

      // Remove duplicate artists
      let seen = {};
      let uniqueArtists = [];
      let k = 0;
      for (let l = 0; l < artists.length; l++) {
        let item = artists[l];
        if (seen[item] !== 1) {
          seen[item] = 1;
          uniqueArtists[k++] = item;
        }
      }

      // Find artists at SXSW
      let yourSXSWArtists = [];
      for (let m in sxswArtists) {
        if (uniqueArtists.indexOf(sxswArtists[m].spotifyId) > -1) {
          let foundArtist = sxswArtists[m];
          foundArtist.sxsw_id = foundArtist.id;
          foundArtist.tracks = [];
          yourSXSWArtists.push(foundArtist);
        }
      }

      // Add tracks that user has from artist
      let yourSXSWTracks = [];
      let track = {};
      for (let n in tracks) {
        for (let o in yourSXSWArtists) {
          for (let p in tracks[n].track.artists) {
            if (
              yourSXSWArtists[o].spotifyId === tracks[n].track.artists[p].id
            ) {
              track = tracks[n].track;
              track.link = tracks[n].track.external_urls.spotify;
              yourSXSWTracks.push(track);
              yourSXSWArtists[o].tracks.push(tracks[n].track);
            }
          }
        }
      }

      res.send({
        artists: yourSXSWArtists,
        tracks: yourSXSWTracks
      });
    }
  );
});

app.get(
  "/auth/spotify/callback",
  passport.authenticate("spotify", { failureRedirect: "/" }),
  function(req, res) {
    // Successful authentication, redirect home.
    req.session.state = {
      accessToken: req.authInfo
    };
    res.redirect(
      req.headers.host === `localhost:${port}` ? `http://localhost:3000` : "/"
    );
  }
);

app.get("/auth/spotify/confirm", function(req, res) {
  res.send(req.user ? req.user : {});
});

app.get("/auth/spotify/logout", function(req, res) {
  req.logout();
  res.redirect(
    req.headers.host === `localhost:${port}` ? `http://localhost:3000` : "/"
  );
});

app.get("/concerts/:ids", ensureAuthenticated, function(req, res) {
  let artists = req.params.ids.split(",");
  let i = 0;
  let allConcerts = [];
  whilst(
    function() {
      return i < artists.length;
    },
    function(next) {
      const fallbackTimer = setTimeout(function() {
        i = artists.length;
        next();
      }, 10000);

      request(
        {
          url: `https://schedule.sxsw.com/${year}/artists/${artists[i]}`
        },
        (error, response, body) => {
          if (!error && response.statusCode == 200) {
            const artistPage = parse(body);
            const concerts = artistPage
              .querySelectorAll(".related-event")
              .map(item => {
                const event = item.childNodes[1].childNodes[0].childNodes;
                const details = event[1].childNodes[0].childNodes;
                return {
                  date: details[0].childNodes[0].rawText,
                  link: event[0].childNodes[0].rawAttrs
                    .replace('href="/2018', `https://schedule.sxsw.com/${year}`)
                    .replace('"', ""),
                  time: details[1] ? details[1].childNodes[0].rawText : null,
                  title: event[0].childNodes[0].childNodes[0].rawText
                };
              });
            for (let j = 0; j < concerts.length; j++) {
              allConcerts.push(concerts[j]);
            }
          }
          i = i + 1;
          clearTimeout(fallbackTimer);
          next();
        }
      );
    },
    function(err) {
      res.send(allConcerts);
    }
  );
});

app.use(express.static("./build"));

app.listen(port, err => {
  if (err) {
    console.log(err);
    return;
  }
  console.log(`App and API is live at http://localhost:${port}`);
});
