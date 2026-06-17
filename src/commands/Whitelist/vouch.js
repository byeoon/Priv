const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const fs = require('fs');
const path = require('path');

const configPath = path.resolve(__dirname, '../../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('whitelist-vouch')
        .setDescription('Vouch a user that currently isn\'t whitelisted yet.')
        .setDMPermission(false)
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user to vouch for.')
                .setRequired(true)),
    async execute(interaction) {
        try {
            const selectedUser = interaction.options.getUser('user');
            const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
            const roleId = config.whitelistRoleId;

            if (!fs.existsSync(configPath)) {
                fs.writeFileSync(configPath, JSON.stringify({}));
            }

            const whitelistChannelId = config.whitelistChannelId;
            if (!whitelistChannelId) {
                console.error("[Priv] No whitelist channel ID found in config.");
                return;
            }

            const whitelistChannel = interaction.guild.channels.cache.get(whitelistChannelId);
            if (!whitelistChannel) {
                console.error("[Priv] Whitelist channel not found.");
                return;
            }

            // this is a check to see if the user is already in the server and has the whitelist role
            const member = await interaction.guild.members.fetch(selectedUser.id).catch(() => null);
            if (member && member.roles.cache.has(roleId)) {
                console.log("[Priv] " + interaction.user.id + " tried to vouch " + selectedUser.id);
                return await interaction.reply(":x: You cannot vouch a user who is already in the server and has the whitelist role!");
            } else {
                console.log("[Priv] " + interaction.user.id + " has vouched " + selectedUser.id);
                await whitelistChannel.send({ content: `<@${selectedUser.id}> has been vouched by <@${interaction.user.id}>` });
                await interaction.reply(":white_check_mark: Vouched user!");
            }
        } catch (error) {
            console.error(error);
            await interaction.reply(':x: There was an error vouching the user.');
        }
    },
};