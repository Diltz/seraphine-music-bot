// packages

const { generateDependencyReport } = require('@discordjs/voice')
const { REST, Routes, Client, ActivityType} = require("discord.js")
const { DisTube } = require('distube');
const { SoundCloudPlugin } = require('@distube/soundcloud');
const { SpotifyPlugin } = require('@distube/spotify');
const dotenv = require("dotenv")
const fs = require("fs");

// check support

console.log(generateDependencyReport())

// .env & yt cookie

var ytCookiePath = __dirname + "/yt-token.js"
var ytCookie = ""

if (fs.existsSync(ytCookiePath)) {
    ytCookie = require(ytCookiePath)
} else {
    console.log("YouTube cookie not provided. 'Sign in to confirm your age' error may appear.")
}

dotenv.config()

//

const bot_config = require("./config.json")
var token = process.env.BOT_TOKEN
var clientid = process.env.CLIENT_ID

// seraphine phrases

const phrases = require("./phrases.json")

// commands

const commandsPath = __dirname + "/commands"
var commandsBody = {
    body: [],
    runners: {}
}

//

const bot = new Client({intents: ["GuildVoiceStates", "Guilds", "GuildMessages", "MessageContent"]})
const rest = new REST({ version: '10' }).setToken(token);

// init distube

const spotifyPlugin = new SpotifyPlugin({
    parallel: true,
    emitEventsAfterFetching: false,
    api: {
        clientId: process.env.SPOTIFY_CLIENT_ID,
        clientSecret: process.env.SPOTIFY_SECRET,
    },
})

const distube = new DisTube(bot, {
    plugins: [spotifyPlugin, new SoundCloudPlugin()],
    youtubeCookie: ytCookie || null,
	searchSongs: 5,
	searchCooldown: 30,
	leaveOnEmpty: false,
	leaveOnFinish: false,
	leaveOnStop: true
})

// distube events

distube.on("error", (channel, error) => {
    console.error(error)
    channel.send("Ошибка загрузки музыки!")
})

distube.on("finish", (queue) => {
    queue.textChannel.send(phrases.onFinish[Math.floor(Math.random() * phrases.onFinish.length)])
})

distube.on("playSong", (queue, song) => {
    queue.textChannel.send(`Играет: **${song.name}**\nНа канале: ${queue.voiceChannel}\nЗапросил: **${song.member.nickname}**`)
    bot.user.setActivity({type: ActivityType.Listening, name: song.name})
})

distube.on("addSong", (queue, song) => {
    if (queue.songs.length == 1) {
        return
    }

    queue.textChannel.send(`${song.member}, песня **${song.name}** добавлена в очередь!`)
})

distube.on("searchNoResult", (message) => {
    message.channel.send("Ничего не найдено!")
})

distube.on("addList", (queue, playlist) => {
    queue.textChannel.send(`${playlist.member}, плейлист **${playlist.name}** добавлен в очередь!`)
})

// catch bot error

bot.on('error', error => {
    console.error('The WebSocket encountered an error:', error);
});

// ready event

bot.on("ready", async (client) => {
    // activity

    client.user.setActivity({type: ActivityType.Listening, name: `${client.guilds.cache.size} servers`})

    // commands

    var commandsPath = __dirname + "/commands"
    var files = await fs.readdirSync(commandsPath, {encoding: "utf-8"})

    files.forEach((value, index) => {
        let command = require(`${commandsPath}/${value}`)
        let body = command.body

        commandsBody.body.push(body)
        commandsBody.runners[body.name] = command.run
    })

    // set commands

    await rest.put(Routes.applicationCommands(clientid), { body: commandsBody.body });

    console.log("logged in as: " + client.user.tag)
})

// 

bot.on("interactionCreate", (interaction) => {
    if (!interaction.isChatInputCommand()) {
        return
    }

    const commandName = interaction.commandName
    const runner = commandsBody.runners[commandName]

    if (!runner) {
        return interaction.reply({content: "Не удалось загрузить команду!", ephemeral: true})
    }

    try {
        runner(bot, interaction, distube)
    } catch (error) {
        interaction.reply({content: "Ошибка выполнения команды!\n" + error, ephemeral: true})
    }
})

// login to bot

if (!token) {
    console.error("Please update BOT_TOKEN in .env file!")
} else {
    bot.login(token)
}