const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const fs = require('fs');
const path = require('path');

const configPath = path.resolve(__dirname, '../../config.json');

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
            console.log("[BGuard] Will now send welcome messages to " + selectedchannel.id);

            // Ensure the config file exists
            if (!fs.existsSync(configPath)) {
                fs.writeFileSync(configPath, JSON.stringify({}));
            }

            // Read the existing config
            const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

            // Update the config with the new channel ID
            config.welcomeChannelId = selectedchannel.id;

            // Save the updated config
            fs.writeFileSync(configPath, JSON.stringify(config, null, 2));

            await interaction.reply(":white_check_mark: Successfully set the welcome channel!");
        } catch (error) {
            console.error(error);
            await interaction.reply(':x: There was an error setting the welcome channel.');
        }
    },
};