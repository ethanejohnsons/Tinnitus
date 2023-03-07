const { SlashCommandBuilder } = require("@discordjs/builders");
const { useQueue } = require('discord-player');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("skip")
        .setDescription("Skips the current song."),
    execute: async ({client, interaction}) => {
        const queue = useQueue(interaction.guild.id);

        if (!queue) {
            return interaction.reply("Nothing is playing???");
        }

        queue.node.skip();
        return interaction.reply("Skipped.");
    }
}
