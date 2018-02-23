# [Your Spotify at SXSW](https://spotify-sxsw.now.sh)

![Your Spotify at SXSW](/public/thumbnail.png?raw=true)

Find all the artists in your Spotify song library that will be at SXSW.

## To run locally

1. Register an app on Spotify’s dev console.
2. Then add a file called `.env.local.json` to the root with the following content:

```
{
  "secret": "yourCustomSessionsecret",
  "spotifyCallback": "http://localhost:8081/auth/spotify/callback",
  "spotifyClientId": "xxxxxxxxxxxxxxxxxxx",
  "spotifyClientSecret": "xxxxxxxxxxxxxxxxxxx"
}
```

3. `npm install`
4. `npm start`
