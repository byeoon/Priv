const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('silentban')
		.setDMPermission(false)
		.setDescription('Silently bans a specified user and removes all their messages.')
	  .addUserOption((option) =>
		option
		  .setName("target")
		  .setDescription("The user you want to ban.")
		  .setRequired(true)
	  )
	  .addStringOption((option) =>
	  option
		.setName("reason")
		.setDescription("The ban reason given (Will not be shown to user)")
		.setRequired(false)
	),
		
	async execute(interaction) {
			await interaction.reply(`Does not work yet.`);
	},
};
