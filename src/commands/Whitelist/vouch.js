const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { getGuildConfig, updateGuildConfig } = require('../../utils/config');

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
            const config = getGuildConfig(interaction.guildId);

            const roleId = config.whitelistRoleId;
            if (!roleId) {
                return await interaction.reply({ content: ":x: The whitelist role has not been configured yet. Use `/whitelist-setrole` first.", ephemeral: true });
            }

            const whitelistChannelId = config.whitelistChannelId;
            if (!whitelistChannelId) {
                return await interaction.reply({ content: ":x: The whitelist log channel has not been configured yet. Use `/whitelist-setchannel` first.", ephemeral: true });
            }

            const whitelistChannel = interaction.guild.channels.cache.get(whitelistChannelId);
            if (!whitelistChannel) {
                return await interaction.reply({ content: ":x: Configured whitelist log channel not found.", ephemeral: true });
            }

            const member = await interaction.guild.members.fetch(selectedUser.id).catch(() => null);
            if (member) {
                if (member.roles.cache.has(roleId)) {
                    console.log("[Priv] " + interaction.user.id + " tried to vouch " + selectedUser.id + " but they are already whitelisted.");
                    return await interaction.reply({ content: ":x: You cannot vouch a user who is already in the server and has the whitelist role!", ephemeral: true });
                }
                try {
                    const role = interaction.guild.roles.cache.get(roleId);
                    if (role) {
                        await member.roles.add(role);
                    } else {
                        return await interaction.reply({ content: ":x: Configured whitelist role not found in this server.", ephemeral: true });
                    }
                } catch (roleError) {
                    console.error("[Priv] Failed to assign whitelist role:", roleError);
                    return await interaction.reply({ content: ":x: Failed to assign the whitelist role. Please ensure my role is placed higher than the whitelist role in the server settings.", ephemeral: true });
                }

                console.log("[Priv] " + interaction.user.id + " has vouched " + selectedUser.id);
                await whitelistChannel.send({ content: `<@${selectedUser.id}> has been vouched by <@${interaction.user.id}> and assigned the whitelist role.` });
                await interaction.reply(`:white_check_mark: Successfully vouched <@${selectedUser.id}> and assigned the whitelist role!`);
            } else {
                const vouchedUsers = config.vouchedUsers || [];
                if (vouchedUsers.includes(selectedUser.id)) {
                    return await interaction.reply({ content: `:x: <@${selectedUser.id}> has already been vouched.`, ephemeral: true });
                }

                vouchedUsers.push(selectedUser.id);
                updateGuildConfig(interaction.guildId, { vouchedUsers });

                console.log("[Priv] " + interaction.user.id + " has pre-vouched " + selectedUser.id);
                await whitelistChannel.send({ content: `<@${selectedUser.id}> has been pre-vouched by <@${interaction.user.id}> and will be auto-whitelisted upon joining.` });
                await interaction.reply(`:white_check_mark: Successfully pre-vouched <@${selectedUser.id}>! They will be automatically whitelisted when they join the server.`);
            }
        } catch (error) {
            console.error(error);
            await interaction.reply(':x: There was an error vouching the user.');
        }
    },
};