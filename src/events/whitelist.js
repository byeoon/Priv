const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, Events, PermissionsBitField } = require('discord.js');
const fs = require('fs');
const path = require('path');

const configPath = path.resolve(__dirname, '../config.json');
console.log("[Priv] Config file directory: " + configPath);

module.exports = {
    name: Events.GuildMemberAdd,
    async execute(member) {
        console.log(`[Priv] A new member has joined: ${member.user.tag}`);

        if (!fs.existsSync(configPath)) {
            console.error("[Priv] Config file does not exist.");
            return;
        }
        const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

        const whitelistChannelId = config.whitelistChannelId;
        if (!whitelistChannelId) {
            console.error("[Priv] No whitelist channel ID found in config.");
            return;
        }

        const whitelistChannel = member.guild.channels.cache.get(whitelistChannelId);
        if (!whitelistChannel) {
            console.error("[Priv] Whitelist channel not found.");
            return;
        }

        // Create an embed with member information
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
                const roleId = config.whitelistRoleId;
                if (!roleId) {
                    await i.update({ content: 'Whitelist role ID not found in config.', embeds: [], components: [] });
                    return;
                }
                const role = member.guild.roles.cache.get(roleId);
                if (role) {
                    await member.roles.add(role);
                    await i.update({ content: `Accepted ${member.user.tag} and assigned the whitelist role.`, embeds: [], components: [] });
                } else {
                    await i.update({ content: 'Whitelist role not found.', embeds: [], components: [] });
                }
            } else if (i.customId === 'decline') {
                await member.ban({ reason: 'Declined by whitelist.' });
                try {
                    await member.send('You have been declined from the server.');
                }
                catch {
                    console.log("[Priv] User has DMs disabled.");
                }
                await i.update({ content: `Declined ${member.user.tag} and banned the member.`, embeds: [], components: [] });
            } else if (i.customId === 'silent-decline') {
                await member.ban('Silently declined by whitelist.');
                await i.update({ content: `Silently declined ${member.user.tag} and banned the member.`, embeds: [], components: [] });
            }
        });

        collector.on('end', collected => {
            if (!collected.size) {
                message.edit({ content: 'No action taken.', embeds: [], components: [] });
            }
        });
    },
};