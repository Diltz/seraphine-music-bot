// packages

const {SlashCommandBuilder} = require("discord.js")

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

    interaction.reply(`Музыка остановлена и очередь была очищена`)
}

// exports

module.exports = {
    run: execute,
    body: new SlashCommandBuilder()
	.setName('stop')
	.setDescription('Остановить музыку и очистить очередь')
}