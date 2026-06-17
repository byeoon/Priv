const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('lockdown')
        .setDescription('Locks down a channel to staff only.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
        .setDMPermission(false)
        .addChannelOption(option =>
            option.setName('channel')
                .setDescription('The channel to lockdown.')
                .setRequired(true)),

    async execute(interaction) {
        const selectedchannel = interaction.options.getChannel("channel");
        try {
            console.log("[Priv] Locking down " + selectedchannel.id);
            await selectedchannel.permissionOverwrites.edit(interaction.guildId, { ViewChannel: false });
            await interaction.reply({ content: `:hammer: Successfully locked down the channel <#${selectedchannel.id}>!`, ephemeral: false });
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: ':x: There was an error locking down the channel. Did you give the bot enough permissions?', ephemeral: true });
        }
    },
};
