const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const fs = require('fs');
const path = require('path');

const configPath = path.resolve(__dirname, '../../config.json');

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
            // Ensure the config file exists
            if (!fs.existsSync(configPath)) {
                fs.writeFileSync(configPath, JSON.stringify({}));
            }

            // Read the existing config
            const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

            // Update the config with the new channel ID
            config.welcomeModule = interaction.options.getBoolean("setting");

            // Save the updated config
            fs.writeFileSync(configPath, JSON.stringify(config, null, 2));

            await interaction.reply(":white_check_mark: Successfully toggled the module to " + config.welcomeModule);
        } catch (error) {
            console.error(error);
            await interaction.reply(':x: There was an error setting the welcome module.');
        }
    },
};