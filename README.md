# discord-music-bot
My first discord's music bot.
This bot uses [Distube](https://distube.js.org) library to function. Really nice wrapper.

# License
My project is protected under MIT License. You can edit code in any way you want, sell, distribute. But you must put me in a credit.

# Requirements
<ol>
  <li>Node.js Version 18+</li>
  <li>FFMPEG</li>
  <li>Opus tools</li>
</ol>

# Installation
<ol>
  <li>Clone repository</li>
  <li>Rename .env.test to .env and fill values</li>
  <li>Run **npm install**</li>
  <li>Run any way you want! I prefer doing it through docker, but you can also try pm2 or screen</li>
</ol>

# Required values in .env
<ol>
  <li>BOT_TOKEN (Discord bot token)</li>
  <li>CLIENT_ID (Discord bot application id)</li>
</ol>

# Additional steps
## Spotify support
You want bot catch some songs from Spotify? Then configure next values in .env

<ol>
  <li>SPOTIFY_CLIENT_ID</li>
  <li>SPOTIFY_SECRET</li>
</ol>

You can get these values from [Spotify for Developers Dashboard](https://developer.spotify.com/dashboard/)
## YouTube support
You want bot to support age restricted videos/songs? Then rename **yt-token.test.js** to **yt-token.js** and configure it!<br>
``
module.exports = "your youtube cookie"
``
#### How to get token?
<ol>
  <li>Go to youtube.com</li>
  <li>Open developer mode</li>
  <li>Open Network tab on youtube.com</li>
  <li>Copy whole cookie request header</li>
</ol>
