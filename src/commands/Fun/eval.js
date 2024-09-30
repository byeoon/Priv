const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('eval')
		.setDescription('Evaluates a statement (VERIFIED USERS ONLY)'),
	async execute(interaction) {
        if (message.author.id !== "" || "")  return;
		try {
            const evaled = eval(args.join(" "));
        }
        catch {
            
        }
	},
};
