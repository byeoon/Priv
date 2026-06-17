const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('silentban')
		.setDescription('Silently bans a specified user and removes all their messages.')
		.setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
		.setDMPermission(false)
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
		const targetUser = interaction.options.getUser("target");
		const reason = interaction.options.getString("reason") || "No reason provided";

		const member = await interaction.guild.members.fetch(targetUser.id).catch(() => null);
		if (member) {
			if (interaction.user.id !== interaction.guild.ownerId &&
				member.roles.highest.position >= interaction.member.roles.highest.position) {
				return interaction.reply({
					content: ":x: You cannot ban this member because they have a role higher than or equal to yours!",
					ephemeral: true
				});
			}

			if (!member.bannable) {
				return interaction.reply({
					content: ":x: I cannot ban this member! They might have a higher role than me or I lack permission.",
					ephemeral: true
				});
			}
		}

		try {
			await interaction.guild.members.ban(targetUser.id, {
				deleteMessageSeconds: 604800,
				reason: `Silent Ban by ${interaction.user.tag}: ${reason}`
			});

			console.log(`[Moderation] ${interaction.user.tag} silently banned ${targetUser.tag} (${targetUser.id}) for: ${reason}`);

			await interaction.reply({
				content: `:hammer: Successfully silently banned **${targetUser.tag}** and removed their messages from the last 7 days.`,
				ephemeral: true
			});
		} catch (error) {
			console.error(error);
			await interaction.reply({
				content: `:x: Failed to ban the user. Error: ${error.message}`,
				ephemeral: true
			});
		}
	},
};
