const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, Events, PermissionsBitField } = require('discord.js');
const fs = require('fs');
const path = require('path');

const configPath = path.resolve(__dirname, '../config.json');

module.exports = {
    name: Events.GuildMemberAdd,
    async execute(member) {
        if (!fs.existsSync(configPath)) {
            console.error("[BGuard] Config file does not exist.");
            return;
        }
        const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

        const welcomeChannelId = config.welcomeChannelId;
        if (!welcomeChannelId) {
            console.error("[BGuard] No welcome channel ID found in config.");
            return;
        }

        const welcomeChannel = member.guild.channels.cache.get(welcomeChannelId);
        if (!welcomeChannel) {
            console.error("[BGuard] Welcome channel not found.");
            return;
        }

        const welcomeToggled = config.welcomeModule;
        if(welcomeToggled == false) {
            console.error("This server does not have the welcome module enabled.")
            return;
        }

        /* Create an embed with member information
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
        */

        const message = await welcomeChannel.send({ content: `Welcome ${member.user.tag} to the server!` });
    }
};

// i want there to be the ability to toggle modules like lets say
// you want whitelist but no welcome channel or you want a welcome channel but no whitelist
// so this is kinda smart 
// i think that should be done in src/events/whitelist.js when accepting a member idk
// fair