const { SlashCommandBuilder } = require("@discordjs/builders");
const { useQueue } = require('discord-player');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("resume")
        .setDescription("Resumes playback."),
    execute: async ({client, interaction}) => {
        const queue = useQueue(interaction.guild.id);

        if (!queue || !queue.currentTrack) {
            return interaction.reply("There is nothing to play???");
        }

        if (queue.node.isPlaying()) {
            return interaction.reply("It's already playing broski.");
        }

        queue.node.setPaused(false);
        return interaction.reply("Paused.");
    }
}
