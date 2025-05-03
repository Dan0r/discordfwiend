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



// post what the weather will be like this week (for Hannover)
const lat = 52.38;
const lon = 9.74;

// fetches current temperature, tomorrows temperature, and this week's temperature
const getWeather = async () => {
	// fetching data from open Meteo
	const apiURL = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m&hourly=temperature_2m`;

	try {
		const res = await fetch(apiURL);
		if (!res.ok) {
			throw new Error('Network response failed');
		}
		//fetch all data
		const data = await res.json();
		// fetch current temperature
		const current_temperature = data.current.temperature_2m;
		const { time, temperature_2m } = data.hourly;
		// fetch tomorrows temperature (current day = 24, tomorrow at 12 = 24 + 12)
		const tomorrowIndex = 36;
		const tomorrow_time = time[tomorrowIndex];
		const tomorrow_temperature = temperature_2m[tomorrowIndex];

		return { current_temperature, tomorrow_time, tomorrow_temperature };

	} catch (error) {
		console.error('Error fetching weather data:', error);
	}
};

const callback = (getWeatherCallback) => {
	client.on("messageCreate", async msg => {
		if (msg.author.bot) return;

		if (msg.content === "now") {
			const weather = await getWeatherCallback();
			if (!weather) return msg.reply("Failed to fetch weather");

			msg.reply(`${weather.current_temperature}`);
		}
		if (msg.content === "tomorrow") {
			const weather = await getWeatherCallback();
			if (!weather) return msg.reply("Failed to fetch weather");
			
			msg.reply(`${weather.tomorrow_temperature}`)


		}
	});
};

client.on("ready", async () => {
	console.log(`Logged in as ${client.user.tag}`);
	spice(client);
	callback(getWeather);	

	const weather = await getWeather();
	console.log(weather);

});


// login bot
client.login(process.env.TOKEN)
