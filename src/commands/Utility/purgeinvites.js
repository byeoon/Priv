const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('purgeinvites')
		.setDescription('Deletes every single invite to the server.')
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
		.setDMPermission(false)
		.addUserOption((option) =>
			option
				.setName("target")
				.setDescription("Select user to purge invites of")
				.setRequired(false)
		),

	async execute(interaction) {
		const targetUser = interaction.options.getUser("target");
		try {
			const invites = await interaction.guild.invites.fetch();
			let count = 0;

			for (const invite of invites.values()) {
				if (targetUser) {
					if (invite.inviter && invite.inviter.id === targetUser.id) {
						await invite.delete();
						count++;
					}
				} else {
					await invite.delete();
					count++;
				}
			}

			if (targetUser) {
				console.log(`[Priv] ${interaction.user.tag} deleted ${count} invites created by ${targetUser.tag}.`);
				await interaction.reply({ content: `:hammer: Deleted **${count}** invites created by **${targetUser.tag}**!`, ephemeral: true });
			} else {
				console.log(`[Priv] ${interaction.user.tag} deleted all ${count} server invites.`);
				await interaction.reply({ content: `:hammer: Deleted **${count}** invites!`, ephemeral: true });
			}
		} catch (error) {
			console.error(error);
			await interaction.reply({ content: ':x: There was an issue deleting invites. Do I have the Manage Server permission?', ephemeral: true });
		}
	},
};
