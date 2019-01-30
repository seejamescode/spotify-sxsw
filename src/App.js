import React, { Component } from "react";
import ReactGA from "react-ga";
import styled from "styled-components";
import Artists from "./components/Artists.js";
import Concerts from "./components/Concerts.js";
import Login from "./components/Login.js";
import Profile from "./components/Profile.js";
import Tracks from "./components/Tracks.js";

ReactGA.initialize("UA-43808769-13");
ReactGA.pageview(window.location.pathname);

const colors = [
  {
    id: "black",
    value: "#181818"
  },
  {
    id: "blackMenu",
    value: "#191414"
  },
  {
    id: "green",
    value: "#00AD03"
  },
  {
    id: "greenHover",
    value: "#1ed760"
  },
  {
    id: "white",
    value: "white"
  },
  {
    id: "whiteFaded",
    value: "#cec7c7"
  }
];

const Footer = styled.p`
  align-self: end;
  margin-bottom: 0;
  margin-top: 0;
`;

const Header = styled.header`
  background: var(--color-blackMenu);
  display: grid;

  @media (min-width: 640px) {
    grid-template-rows: min-content min-content min-content min-content 1fr;
  }
`;

const Layout = styled.div`
  ${colors.map(
    color => `--color-${color.id}: ${color.value};`
  )} background: var(--color-black);
  box-sizing: border-box;
  color: var(--color-white);
  font-family: "Helvetica Neue", Arial, sans-serif;
  min-height: 100vh;
  width: 100%;

  > * {
    padding: 2rem;
  }

  * {
    box-sizing: border-box;
  }

  h1 {
    margin-top: 0;
  }

  h1,
  h2,
  h3,
  p {
    line-height: 1.3;
    max-width: 18rem;
  }

  a {
    color: inherit;
  }

  @media (min-width: 640px) {
    display: grid;
    grid-template-columns: 19rem auto;
    height: 100vh;

    > * {
      overflow-y: auto;
    }
  }
`;

const MarginBottom = styled.p`
  margin-bottom: 2rem;
  margin-top: 0;
`;

const Tab = styled.label`
  box-sizing: border-box;
  color: ${props =>
    props.checked ? "var(--color-white)" : "var(--color-whiteFaded)"};
  cursor: pointer;
  display: block;
  margin-bottom: -1.75rem;
  margin-left: -2rem;
  margin-right: -2rem;
  margin-top: 2rem;
  padding-bottom: 1rem;
  position: relative;
  text-align: center;
  width: calc(33.33% + 1.333rem);

  &:after {
    background: ${props => (props.checked ? "var(--color-green)" : null)};
    bottom: -0.25rem;
    content: "";
    left: -2rem;
    position: absolute;
    right: 0;
    top: 100%;
  }

  &:nth-child(2),
  &:nth-child(3) {
    margin-left: 2rem;
    &:after {
      left: 0;
    }
  }

  &:hover {
    color: var(--color-white);
  }

  input {
    margin: 0;
    visibility: hidden;
    width: 0;
  }

  @media (min-width: 640px) {
    margin-bottom: 2rem;
    margin-left: 0;
    margin-right: 0;
    margin-top: 2rem;
    padding-bottom: 0;
    text-align: left;
    width: 100%;

    &:after {
      display: initial;
      left: -2rem;
      top: -0.25rem;
      width: 0.25rem;
    }

    &:nth-child(2),
    &:nth-child(3) {
      margin-left: 0;
      &:after {
        left: -2rem;
      }
    }
  }
`;

const Tabs = styled.form`
  display: flex;
  grid-row-start: 5;

  @media (min-width: 640px) {
    display: initial;
    grid-row-start: 4;
  }
`;

class App extends Component {
  state = {
    concerts: [],
    artists: [{}, {}, {}, {}, {}],
    loggedIn: false,
    photo: "",
    searchedArtists: false,
    searchedConcerts: false,
    searchingArtists: false,
    searchingConcerts: false,
    tab: "artists",
    tracks: []
  };

  componentDidMount() {
    this.confirmAuth();
  }

  componentDidUpdate(prevProps, prevState) {
    if (!prevState.loggedIn && this.state.loggedIn) {
      this.findArtists();
    }
    if (prevState.searchingArtists && !this.state.searchingArtists) {
      this.findArtistInfo();
      this.findConcerts();
    }
  }

  changeTab = e => {
    this.setState({
      tab: e.target.value
    });
  };

  confirmAuth() {
    fetch(`/auth/spotify/confirm`, {
      credentials: "same-origin"
    })
      .then(response => response.json())
      .then(user => {
        if (user.id) {
          ReactGA.event({
            category: "User",
            action: "Logged In"
          });

          this.setState({
            displayName: user.displayName !== null ? user.displayName : user.id,
            id: user.id,
            loggedIn: true,
            photo: user.photos[0] ? user.photos[0] : ""
          });
        }
      })
      .catch(err => {
        console.error("Error ", err);
      });
  }

  findArtists() {
    this.setState(
      {
        searchingArtists: true,
        searchingConcerts: true
      },
      () => {
        fetch(`/auth/spotify/artists`, {
          credentials: "same-origin"
        })
          .then(response => response.json())
          .then(results => {
            this.setState({
              artists: results.artists,
              searchedArtists: true,
              searchingArtists: false,
              tracks: results.tracks
            });
          })
          .catch(err => {
            console.error("Error ", err);
          });
      }
    );
  }

  findArtistInfo() {
    fetch(
      `/auth/spotify/artist/${this.state.artists
        .map(artist => artist.spotify_id)
        .join(",")}`,
      {
        credentials: "same-origin"
      }
    )
      .then(response => response.json())
      .then(artists => {
        const newArtistsInfo = this.state.artists.map((artist, index) => {
          const images = artists[index].images.sort(
            (a, b) => a.width - b.width
          );

          for (let i = 0; i < artist.tracks.length; i++) {
            if (
              artist.mp3 === undefined &&
              artist.tracks[i].preview_url !== null
            ) {
              artist.mp3 = artist.tracks[i].preview_url;
            }
          }

          if (artist.mp3 === undefined && artist.band_mp3_url !== undefined) {
            artist.mp3 = artist.band_mp3_url;
          }

          if (
            artist.mp3 !== undefined &&
            artist.mp3 !== null &&
            artist.mp3.indexOf("https") === -1
          ) {
            artist.mp3 = artist.mp3.replace("http", "https");
          }

          ReactGA.event({
            category: "Artist Found",
            action: artist.name
          });

          const result = artist;
          result.images = images;
          return result;
        });
        this.setState({
          artists: newArtistsInfo
        });
      })
      .catch(err => {
        console.error("Error ", err);
      });
  }

  findConcerts() {
    fetch(
      `/concerts/${this.state.artists.map(artist => artist.sxsw_id).join(",")}`,
      {
        credentials: "same-origin"
      }
    )
      .then(response => response.json())
      .then(concerts => {
        this.setState({
          concerts: concerts.sort(function(a, b) {
            var textA = a.date.toUpperCase();
            var textB = b.date.toUpperCase();
            return textA < textB ? -1 : textA > textB ? 1 : 0;
          }),
          searchedConcerts: true,
          searchingConcerts: false
        });
      })
      .catch(err => {
        console.error("Error ", err);
      });
  }

  render() {
    return (
      <Layout>
        <Header>
          <h1>
            Your Spotify
            <br />
            at SXSW 2019
          </h1>
          <MarginBottom>
            Find all the artists in your Spotify song library that will be at
            SXSW.
          </MarginBottom>
          <Profile
            displayName={this.state.displayName}
            loggedIn={this.state.loggedIn}
            photo={this.state.photo}
          />
          {this.state.loggedIn ? (
            <Tabs>
              <Tab checked={this.state.tab === "artists"}>
                <input
                  checked={this.state.tab === "artists"}
                  name="tab"
                  onChange={e => this.changeTab(e)}
                  tab={this.state.tab}
                  type="radio"
                  value={"artists"}
                />
                Artists
              </Tab>
              <Tab checked={this.state.tab === "concerts"}>
                <input
                  checked={this.state.tab === "concerts"}
                  name="tab"
                  onChange={e => this.changeTab(e)}
                  tab={this.state.tab}
                  type="radio"
                  value={"concerts"}
                />
                Concerts
              </Tab>
              <Tab checked={this.state.tab === "tracks"}>
                <input
                  checked={this.state.tab === "tracks"}
                  name="tab"
                  onChange={e => this.changeTab(e)}
                  tab={this.state.tab}
                  type="radio"
                  value={"tracks"}
                />
                Tracks
              </Tab>
            </Tabs>
          ) : (
            <Login />
          )}
          <Footer>
            Created by{" "}
            <a
              href="https://twitter.com/seejamescode"
              rel="noopener noreferrer"
              target="_blank"
            >
              James Y Rauhut
            </a>{" "}
            and not related to Spotify or SXSW. Register for a mentor session
            with him{" "}
            <a
              href="https://schedule.sxsw.com/2018/events/PP71224"
              rel="noopener noreferrer"
              target="_blank"
            >
              here
            </a>
            .
          </Footer>
        </Header>
        <main>
          <Artists
            artists={this.state.artists}
            searched={this.state.searchedArtists}
            searching={this.state.searchingArtists}
            show={this.state.tab === "artists" && this.state.loggedIn}
          />
          <Concerts
            concerts={this.state.concerts}
            searched={this.state.searchedConcerts}
            searching={this.state.searchingConcerts}
            show={this.state.tab === "concerts" && this.state.loggedIn}
          />
          <Tracks
            searched={this.state.searchedArtists}
            searching={this.state.searchingArtists}
            show={this.state.tab === "tracks" && this.state.loggedIn}
            tracks={this.state.tracks}
          />
        </main>
      </Layout>
    );
  }
}

export default App;
