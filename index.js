// packages

const { generateDependencyReport } = require('@discordjs/voice')
const { REST, Routes, Client, ActivityType} = require("discord.js")
const { DisTube } = require('distube')
const { SoundCloudPlugin } = require('@distube/soundcloud')
const { SpotifyPlugin } = require('@distube/spotify')
const dotenv = require("dotenv")
const fs = require("fs")

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

// util

const utilPath = __dirname + "/util"

// languages

const en_strings = require("./languages/en.json")

// commands

const commandsPath = __dirname + "/commands"
var commandsBody = {
    body: [],
    runners: {}
}

// init database

try {
    require(`${utilPath}/setupDatabase.js`)()
} catch (error) {
    console.error(error)
    process.exit(2)
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
    youtubeCookie: ytCookie,
	searchSongs: 5,
	searchCooldown: 30,
	leaveOnEmpty: true,
	leaveOnFinish: true,
	leaveOnStop: true
})

// distube events

distube.on("error", (channel, error) => {
    console.error(error)
    channel.send("Ошибка загрузки музыки!")
})

distube.on("finish", (queue) => {
    queue.textChannel.send(phrases.onFinish[Math.floor(Math.random() * phrases.onFinish.length)])
    client.user.setActivity({type: ActivityType.Listening, name: `${client.guilds.cache.size} servers`})
})

distube.on("playSong", (queue, song) => {
    queue.textChannel.send(`Играет: **${song.name}**\nНа канале: ${queue.voiceChannel || "?"}\nЗапросил: **${song.member.nickname || song.member.user.username}**`)
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
})

// guild create event

bot.on("guildCreate", async (guild) => {
    // add record into db

    await require(`${utilPath}/addServer.js`)(guild.id)

    //

    bot.user.setActivity({type: ActivityType.Listening, name: `${bot.guilds.cache.size} servers`})
    guild.systemChannel.send({content: `Thanks for adding me to this server. If you want to change my language use **/language**\n\n${en_strings.phrases.guildCreate}`})
})

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