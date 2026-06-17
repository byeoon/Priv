const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { updateGuildConfig } = require('../../utils/config');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('welcome-setchannel')
        .setDescription('Set the channel to output welcome messages to.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setDMPermission(false)
        .addChannelOption(option =>
            option.setName('channel')
                .setDescription('The channel to set as the default welcome channel.')
                .setRequired(true)),
    async execute(interaction) {
        try {
            const selectedchannel = interaction.options.getChannel("channel");
            console.log("[Priv] Will now send welcome messages to " + selectedchannel.id);

            // Update the config with the new channel ID
            updateGuildConfig(interaction.guildId, { welcomeChannelId: selectedchannel.id });

            await interaction.reply(":white_check_mark: Successfully set the welcome channel!");
        } catch (error) {
            console.error(error);
            await interaction.reply(':x: There was an error setting the welcome channel.');
        }
    },
};