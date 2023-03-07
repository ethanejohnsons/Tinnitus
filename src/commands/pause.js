const { SlashCommandBuilder } = require("@discordjs/builders");
const { useQueue } = require('discord-player');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("pause")
        .setDescription("Pauses the current song."),
    execute: async ({client, interaction}) => {
        const queue = useQueue(interaction.guild.id);

        if (!queue || !queue.currentTrack) {
            return interaction.reply("Nothing is playing???");
        }

        if (queue.node.isPaused()) {
            return interaction.reply("It's already paused brah.");
        }

        queue.node.setPaused(true);
        return interaction.reply("Paused.");
    }
}
