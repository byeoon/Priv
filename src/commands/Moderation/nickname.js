const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('nickname')
        .setDMPermission(false)
		.setDescription('Changes someones nickname.'),
	async execute(interaction) {
			await interaction.reply(`Does not work yet.`);
	},
};
