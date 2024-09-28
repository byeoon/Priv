const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('shiggy')
		.setDescription('shiggy wiggy'),
	async execute(interaction) {
			await interaction.reply(`<a:Shiggy:1289324436725694474> shiggie wiggie!!`);
	},
};
