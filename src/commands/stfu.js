const { SlashCommandBuilder } = require("@discordjs/builders");
const { useQueue } = require('discord-player');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("stfu")
        .setDescription("Just STFU."),
    execute: async ({client, interaction}) => {
        const queue = useQueue(interaction.guild.id);

        if (!queue) {
            return interaction.reply("Nothing is playing??? Huh?????");
        }

        queue.delete();
        return interaction.reply("k bai");
    }
}
