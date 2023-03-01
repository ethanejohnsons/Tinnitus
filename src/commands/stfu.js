const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("stfu")
        .setDescription("Just STFU."),
    execute: async ({client, interaction}) => {
        let queue = await client.player.getQueue(interaction.guild);

        if (!queue) {
            await interaction.reply("bruh");
            return;
        }

        queue.destroy();
        await interaction.reply("k bai");
    }
}
