// packages

const {SlashCommandBuilder} = require("discord.js")

//

execute = async (client, interaction, distube) => {
    // get queue and check

    const queue = distube.getQueue(interaction)

    if (!queue) {
        return interaction.reply(`Сейчас ничего не играет!`)
    }

    // skip song

    await queue.skip()

    // reply

    interaction.reply(`Песня пропущена!`)
}

// exports

module.exports = {
    run: execute,
    body: new SlashCommandBuilder()
	.setName('skip')
	.setDescription('Пропустить текущую песню')
}