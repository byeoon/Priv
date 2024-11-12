const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('silentban')
		.setDescription('Silently bans a specified user and removes all their messages.'),
	async execute(interaction) {
			await interaction.reply(`Does not work yet.`);
	},
};
