const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('shiggy')
		.setDescription('shiggy wiggy'),
	async execute(interaction) {
			await interaction.reply(`<:shigyay:1272085916189720619:>`);
	},
};
