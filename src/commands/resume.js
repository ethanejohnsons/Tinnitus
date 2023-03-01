const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("resume")
        .setDescription("Resumes playing the current song."),
    execute: async ({client, interaction}) => {
        const queue = await client.player.getQueue(interaction.guild);

        if (!queue) {
            await interaction.reply("There are no songs in the queue.");
            return;
        }

        queue.setPaused(false);
        await interaction.reply("Resumed playing.");
    }
}
