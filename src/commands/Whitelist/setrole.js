const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { updateGuildConfig } = require('../../utils/config');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('whitelist-setrole')
        .setDescription('Set the role to whitelist new members with.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setDMPermission(false)
        .addRoleOption(option =>
            option.setName('role')
                .setDescription('The role to set as the default whitelist role.')
                .setRequired(true)),
    async execute(interaction) {
        try {
            const selectedRole = interaction.options.getRole('role');
            console.log("[Priv] Will now use the role " + selectedRole.id + " for whitelisting new members.");
            updateGuildConfig(interaction.guildId, { whitelistRoleId: selectedRole.id });
            await interaction.reply(":white_check_mark: Successfully set the whitelist role!");
        } catch (error) {
            console.error(error);
            await interaction.reply(':x: There was an error setting the whitelist role.');
        }
    },
};