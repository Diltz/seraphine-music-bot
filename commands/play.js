// packages

const {SlashCommandBuilder} = require("discord.js")

//

execute = async (client, interaction, distube) => {
    const member = interaction.member
    const textChannel = interaction.channel
    const voiceState = member.voice
    const voiceChannel = voiceState.channel
    const requestedSong = interaction.options.getString("песня")

    if (!voiceChannel) {
        return interaction.reply({content: "Вы должны находиться в голосовом канале", ephermeal: true})
    }

    interaction.reply("Загружаю..")

    distube.play(voiceChannel, requestedSong, {
        interaction,
        textChannel: textChannel,
        member: member,
    }).then().catch((err) => {
        console.error(err)
        
        textChannel.send(`Не удалось загрузить музыку!\n**${err}**`)
    })
}

// exports

module.exports = {
    run: execute,
    body: new SlashCommandBuilder()
	.setName('play')
	.setDescription('Проигрывает заданную песню')
	.addStringOption(option =>
		option.setName('песня')
			.setDescription('Ссылка/Название')
			.setRequired(true))
}