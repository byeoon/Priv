const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

const configPath = path.resolve(__dirname, '../../config.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('whitelist')
    .setDescription('View the current whitelist settings.')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setDMPermission(false),

  async execute(interaction) {
    try {
      if (!fs.existsSync(configPath)) {
        return await interaction.reply({ content: ':x: Configuration file not found.', ephemeral: true });
      }

      const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      const roleId = config.whitelistRoleId;
      const channelId = config.whitelistChannelId;

      const embed = new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle('Whitelist Configuration')
        .addFields(
          { name: 'Whitelist Role', value: roleId ? `<@&${roleId}>` : 'Not set', inline: true },
          { name: 'Whitelist Log Channel', value: channelId ? `<#${channelId}>` : 'Not set', inline: true }
        )
        .setTimestamp();

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: ':x: There was an error fetching the whitelist configuration.', ephemeral: true });
    }
  },
};
