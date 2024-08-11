const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('say')
		.setDescription('Forces the bot to say something')
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
		.addStringOption(option =>
            option.setName('say')
                .setDescription('What you want the bot to say')),
	async execute(interaction) {
		const say = interaction.options.getUser('say');
		await interaction.reply(say);
	},
};
