// packages

const {SlashCommandBuilder} = require("discord.js")

//

execute = async (client, interaction, distube) => {
    
}

// exports

module.exports = {
    run: execute,
    body: new SlashCommandBuilder()
	.setName('language')
	.setDescription('Set server language')
}