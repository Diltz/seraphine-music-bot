// packages

const {SlashCommandBuilder, ActivityType} = require("discord.js")
const config = require("../config.json")

//

execute = async (client, interaction, distube) => {
    // get queue and check

    const queue = distube.getQueue(interaction)

    if (!queue) {
        return interaction.reply(`Сейчас ничего не играет!`)
    }

    // check new volume

    const newVolume = interaction.options.getNumber("громкость")

    if (isNaN(newVolume) || newVolume < 0 || newVolume > config.maxVolume) {
        return interaction.reply(`Громкость можно установить от 0 до ${config.maxVolume}`)
    }

    // set volume

    await queue.setVolume(newVolume)

    // check current song and reply

    interaction.reply(`Громкость установлена на ${newVolume}`)
    client.user.setActivity({type: ActivityType.Listening, name: `Я пою на ${newVolume} громкости!`})
}

// exports

module.exports = {
    run: execute,
    body: new SlashCommandBuilder()
	.setName('volume')
	.setDescription('Установить громкость музыки')
	.addNumberOption(option =>
		option.setName('громкость')
			.setDescription('Громкость')
			.setRequired(true))
}