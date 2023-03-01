const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("volume")
        .setDescription("Pauses the current song.")
        .addNumberOption(option => option
            .setName("percentage")
            .setDescription("Volume Percentage.")
            .setRequired(true)
        ),
    execute: async ({client, interaction}) => {
        const queue = await client.player.getQueue(interaction.guild);

        if (!queue) {
            await interaction.reply("The queue is empty. Unable to set volume.");
            return;
        }

        let volume = interaction.options.getNumber("percentage");
        volume = Math.min(Math.max(volume, 0), 100);
        queue.setVolume(volume);
        await interaction.reply(`Volume set to ${volume}%`);
    }
}
