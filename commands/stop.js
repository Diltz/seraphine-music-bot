// packages

const {SlashCommandBuilder} = require("discord.js")

// seraphine phrases

const phrases = require("../phrases.json")

//

execute = async (client, interaction, distube) => {
    // get queue and check

    const queue = distube.getQueue(interaction)

    if (!queue) {
        return interaction.reply(`Сейчас ничего не играет!`)
    }

    // stop

    distube.stop(interaction)

    // check current song and reply

    interaction.reply(phrases.onStop[Math.floor(Math.random() * phrases.onStop.length)])
}

// exports

module.exports = {
    run: execute,
    body: new SlashCommandBuilder()
	.setName('stop')
	.setDescription('Остановить музыку и очистить очередь')
}