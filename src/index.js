require("dotenv").config();
const { Client, IntentsBitField } = require("discord.js");

// setup client, then specify which intents the client uses (they are necessary) 
const client = new Client({
	intents: [
		IntentsBitField.Flags.Guilds,
		IntentsBitField.Flags.GuildMembers,
		IntentsBitField.Flags.GuildMessages,
		IntentsBitField.Flags.MessageContent,
	],
});

// specify which events Discord will send to the bot using intents

client.on("ready", () => {
	console.log(`Logged in as ${client.user.tag}`)
})


// login with the above settings
client.login(process.env.TOKEN)
