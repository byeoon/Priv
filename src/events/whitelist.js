const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, Events, PermissionsBitField } = require('discord.js');
const { getGuildConfig, updateGuildConfig } = require('../utils/config');

module.exports = {
    name: Events.GuildMemberAdd,
    async execute(member) {
        console.log(`[Priv] A new member has joined: ${member.user.tag}`);

        const guildConfig = getGuildConfig(member.guild.id);

        const whitelistChannelId = guildConfig.whitelistChannelId;
        if (!whitelistChannelId) {
            console.error("[Priv] No whitelist channel ID found in config for guild " + member.guild.id);
            return;
        }

        const whitelistChannel = member.guild.channels.cache.get(whitelistChannelId);
        if (!whitelistChannel) {
            console.error("[Priv] Whitelist channel not found.");
            return;
        }

        const vouchedUsers = guildConfig.vouchedUsers || [];
        if (vouchedUsers.includes(member.id)) {
            const roleId = guildConfig.whitelistRoleId;
            if (roleId) {
                const role = member.guild.roles.cache.get(roleId);
                if (role) {
                    try {
                        await member.roles.add(role);
                        await whitelistChannel.send({ content: `<@${member.id}> has joined the server and was automatically whitelisted because they were vouched.` });
                        const updatedVouched = vouchedUsers.filter(id => id !== member.id);
                        updateGuildConfig(member.guild.id, { vouchedUsers: updatedVouched });
                        return;
                    } catch (err) {
                        console.error("[Priv] Failed to auto-assign whitelist role to joining member:", err);
                        await whitelistChannel.send({ content: `:warning: Failed to automatically assign the whitelist role to <@${member.id}> (vouched). Please check bot role hierarchy settings.` });
                    }
                }
            }
        }

        const embed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle('New Member!')
            .setDescription(`${member.user.tag} has joined the server.`)
            .setThumbnail(member.user.displayAvatarURL())
            .addFields(
                { name: 'UserID', value: member.user.id, inline: true },
                { name: 'Account Created', value: member.user.createdAt.toDateString(), inline: true }
            )
            .setTimestamp();

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('accept')
                    .setLabel('Accept')
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId('decline')
                    .setLabel('Decline')
                    .setStyle(ButtonStyle.Danger),
                new ButtonBuilder()
                    .setCustomId('silent-decline')
                    .setLabel('Silent Decline')
                    .setStyle(ButtonStyle.Danger)
            );

        const message = await whitelistChannel.send({ embeds: [embed], components: [row] });

        const filter = i => i.customId === 'accept' || i.customId === 'decline' || i.customId === 'silent-decline';
        const collector = message.createMessageComponentCollector({ filter, time: 60000 });

        collector.on('collect', async i => {
            if (!i.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
                await i.reply({ content: 'You do not have permission to use this button.', ephemeral: true });
                return;
            }

            console.log(member.user); // i want to get all possible values

            if (i.customId === 'accept') {
                const roleId = guildConfig.whitelistRoleId;
                if (!roleId) {
                    await i.update({ content: 'Whitelist role ID not found in config.', embeds: [], components: [] });
                    return;
                }
                const role = member.guild.roles.cache.get(roleId);
                if (role) {
                    try {
                        await member.roles.add(role);
                        await i.update({ content: `Accepted ${member.user.tag} and assigned the whitelist role.`, embeds: [], components: [] });
                    } catch (err) {
                        console.error("[Priv] Failed to assign whitelist role manually:", err);
                        await i.update({ content: `Failed to assign role to ${member.user.tag}. Check bot permissions.`, embeds: [], components: [] });
                    }
                } else {
                    await i.update({ content: 'Whitelist role not found.', embeds: [], components: [] });
                }
            } else if (i.customId === 'decline') {
                try {
                    await member.ban({ reason: 'Declined by whitelist.' });
                    try {
                        await member.send('You have been declined from the server.');
                    } catch {
                        console.log("[Priv] User has DMs disabled.");
                    }
                    await i.update({ content: `Declined ${member.user.tag} and banned the member.`, embeds: [], components: [] });
                } catch (err) {
                    console.error("[Priv] Failed to ban member:", err);
                    await i.update({ content: `Failed to decline/ban ${member.user.tag}. Check bot ban permissions.`, embeds: [], components: [] });
                }
            } else if (i.customId === 'silent-decline') {
                try {
                    await member.ban({ reason: 'Silently declined by whitelist.' });
                    await i.update({ content: `Silently declined ${member.user.tag} and banned the member.`, embeds: [], components: [] });
                } catch (err) {
                    console.error("[Priv] Failed to silently ban member:", err);
                    await i.update({ content: `Failed to silently decline/ban ${member.user.tag}. Check bot ban permissions.`, embeds: [], components: [] });
                }
            }
        });

        collector.on('end', collected => {
            if (!collected.size) {
                message.edit({ content: 'No action taken.', embeds: [], components: [] });
            }
        });
    },
};