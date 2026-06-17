const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('unlockdown')
		.setDescription('Removes a lockdown from the channel.')
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
		.setDMPermission(false)
		.addChannelOption(option =>
			option.setName('channel')
				.setDescription('The channel to unlock.')
				.setRequired(true)),

	async execute(interaction) {
		const selectedchannel = interaction.options.getChannel("channel");
		try {
			await selectedchannel.permissionOverwrites.edit(interaction.guildId, { ViewChannel: true });
			await interaction.reply({ content: `:hammer: Successfully unlocked the channel <#${selectedchannel.id}>!`, ephemeral: false });
		} catch (error) {
			console.error(error);
			await interaction.reply({ content: ':x: There was an error unlocking the channel. Does the bot have the right permissions?', ephemeral: true });
		}
	},
};
