const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const fs = require('fs');
const path = require('path');

const configPath = path.resolve(__dirname, '../../config.json');

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
            console.log("[Protector] Will now use the role " + selectedRole.id + " for whitelisting new members.");

            // Ensure the config file exists
            if (!fs.existsSync(configPath)) {
                fs.writeFileSync(configPath, JSON.stringify({}));
            }

            // Read the existing config
            const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

            // Update the config with the new role ID
            config.whitelistRoleId = selectedRole.id;

            // Save the updated config
            fs.writeFileSync(configPath, JSON.stringify(config, null, 2));

            await interaction.reply(":white_check_mark: Successfully set the whitelist role!");
        } catch (error) {
            console.error(error);
            await interaction.reply(':x: There was an error setting the whitelist role.');
        }
    },
};