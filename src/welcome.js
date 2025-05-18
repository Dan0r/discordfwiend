const { EmbedBuilder } = require('discord.js')

// write welcome message upon a user joining
module.exports = client => {
	client.on('guildMemberAdd', async member => {
	// retrieves the channel object (of the channel the user is in)
	    try {
			const channelID = process.env.CHANNEL_ID;
			const channel = member.guild.channels.cache.get(channelID);
			if (!channel) {
				console.error('Channel not found...');
				return;
		}
			// defines embedded message
			const embed = new EmbedBuilder()
				.setTitle('Welcome to the Dune Fan Community')
				.setURL('https://netzwerkrecherche.org/')
				.setDescription('This is a description')
				.setImage('https://netzwerkrecherche.org/nr25/wp-content/uploads/sites/19/2024/12/NR-Logo.png')
				.addFields({
					name: 'Welcome to the Dune Fan Community',
					value: 'Tell us your favourite Dune character',
					inline: true
				})
				.setColor('DarkPurple')
			// await lets me catch the error
		await channel.send({ embeds: [embed]});
		console.log(member);

	} catch(error) {
		console.error('Failed to send welcome message...', error)
	}
 });
};
