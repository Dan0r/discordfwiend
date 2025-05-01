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

// upon "Hey", write "Spice is the essence of life."
const spice = (client) => {
	client.on("messageCreate", msg => {
		if (msg.author.bot) return;

		if (msg.content === "Hey!") {
			msg.reply("Spice is the essence of life.");
		}
	});
};

// put location here
	// hannover



// post what the weather will be like this week
const lat = 52.38;
const lon = 9.74;

const getWeather = async () => {
	const apiURL = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,wind_speed_10m&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m`;

	try {
		const res = await fetch(apiURL);
		if (!res.ok) {
			throw new Error('Network response failed');
		}
		const data = await res.json();
		console.log('Weather data', data);
		return data;
	} catch (error) {
		console.error('Error fetching weather data:', error);
	}
};



client.on("ready", async () => {
	console.log(`Logged in as ${client.user.tag}`);
	spice(client);

	const weather = await getWeather();
	console.log(weather);
});


// login bot
client.login(process.env.TOKEN)
