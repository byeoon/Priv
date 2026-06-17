const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { updateGuildConfig } = require('../../utils/config');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('welcome-toggle')
        .setDescription('Turn on and off the welcome channel module.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setDMPermission(false)
        .addBooleanOption(option =>
        option.setName('setting')
            .setDescription('Toggle the welcome module.')
            .setRequired(true)),
    async execute(interaction) {
        try {
            const setting = interaction.options.getBoolean("setting");

            // Update the config with the new channel ID
            updateGuildConfig(interaction.guildId, { welcomeModule: setting });

            await interaction.reply(":white_check_mark: Successfully toggled the module to " + setting);
        } catch (error) {
            console.error(error);
            await interaction.reply(':x: There was an error setting the welcome module.');
        }
    },
};