const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const fs = require('fs');
const path = require('path');

const configPath = path.resolve(__dirname, '../../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('whitelist-setchannel')
        .setDescription('Set the channel to output whitelist logs to.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setDMPermission(false)
        .addChannelOption(option =>
        option.setName('channel')
            .setDescription('The channel to set as the default whitelist channel.')
            .setRequired(true)),
    async execute(interaction) {
        try {
            const selectedchannel = interaction.options.getChannel("channel");
            console.log("[Protector] Will now send whitelist logs to " + selectedchannel.id);

            // Ensure the config file exists
            if (!fs.existsSync(configPath)) {
                fs.writeFileSync(configPath, JSON.stringify({}));
            }

            // Read the existing config
            const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

            // Update the config with the new channel ID
            config.whitelistChannelId = selectedchannel.id;

            // Save the updated config
            fs.writeFileSync(configPath, JSON.stringify(config, null, 2));

            await interaction.reply(":white_check_mark: Successfully set the whitelist log channel!");
        } catch (error) {
            console.error(error);
            await interaction.reply(':x: There was an error setting the default channel.');
        }
    },
};