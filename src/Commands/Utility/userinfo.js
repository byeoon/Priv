const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('userinfo')
		.setDescription('Provides information about a user.')
		.addUserOption(option =>
			option
				.setName('target')
				.setDescription('Select user to get info from')
				.setRequired(false)),
	async execute(interaction) {
		const user = interaction.options.getUser('target');
	
		if(user) {
			await interaction.reply(`### Information about <@${user.id}>
	UserID: ${user.id}
	Creation Date: ${user.createdAt} (Timestamp: ${user.createdTimestamp})
	Accent Color(?): ${user.accentColor}
	Flags: ${user.flags}`);
	
		}
		else {
			await interaction.reply(`### Information about Yourself!!! 
	UserID: ${interaction.user.id} 
	Creation Date: ${interaction.user.createdAt} (Timestamp: ${interaction.user.createdTimestamp})
	Accent Color: ${interaction.user.accentColor}
	Flags: ${interaction.user.flags}`);
		}
		
	},
};
