// packages

const {SlashCommandBuilder} = require("discord.js")

//

execute = async (client, interaction, distube) => {
    // get queue and check

    const queue = distube.getQueue(interaction)

    if (!queue) {
        return interaction.reply(`Сейчас ничего не играет!`)
    }

    // check current song and reply

    interaction.reply(`Сейчас играет: ${queue.songs[0].name}`)
}

// exports

module.exports = {
    run: execute,
    body: new SlashCommandBuilder()
	.setName('now')
	.setDescription('Что сейчас играет?')
}