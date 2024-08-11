const { SlashCommandBuilder  } = require('discord.js');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('dev')
		.setDescription('Development command.'),
	async execute(interaction) {

	},
};


