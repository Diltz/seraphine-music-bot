// packages

const {SlashCommandBuilder} = require("discord.js")

//

execute = async (client, interaction, distube) => {
    // get queue and check

    const queue = distube.getQueue(interaction)

    if (!queue) {
        return interaction.reply(`Сейчас ничего не играет!`)
    }

    // get channel

    const channel = await client.channels.fetch(queue.voice.channelId)

    // format song queue

    const formattedQueue = queue.songs.map((song, index) => {
        return `${index == 0 && "**Сейчас играет**" || index}. ${song.name}`
    })

    // reply

    interaction.reply(`Канал: ${channel}\nТекущая очередь:\n${formattedQueue.slice(0, 25).join("\n")}`)
}

// exports

module.exports = {
    run: execute,
    body: new SlashCommandBuilder()
	.setName('queue')
	.setDescription('Очередь песен на проигрывание')
}