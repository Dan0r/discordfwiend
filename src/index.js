require("dotenv").config();
const { Client, IntentsBitField } = require("discord.js");
const welcome = require('./welcome.js')

// setup client, then specify which intents the client uses (they are necessary) 
const client = new Client({
	intents: [
		IntentsBitField.Flags.Guilds,
		IntentsBitField.Flags.GuildMembers,
		IntentsBitField.Flags.GuildMessages,
		IntentsBitField.Flags.MessageContent,
	],
});


// Translate weather_code
const weather_code_map = new Map([
	[0, "Clear sky"],
	[1, "Mainly clear"],
	[2, "Partly cloudy"],
	[3, "Overcast"],
	[45, "Fog"],
	[48, "Fog(Depositing rime"],
	[51, "Drizzle (Light)"],
	[53, "Drizzle (Moderate)"],
	[55, "Drizzle (Dense)"],
	[56, "Drizzle (Light freezing)"],
	[57, "Drizzle (Dense freezing)"],
	[61, "Rain (Slight)"],
	[62, "Rain (Moderate)"],
	[65, "Rain (Heavy)"],
	[66, "Rain (Light freezing)"],
	[67, "Rain (Heavy freezing)"],
	[71, "Snow (Slight)"],
	[73, "Snow (Moderate)"],
	[75, "Snow (Heavy)"],
	[77, "Snow (Grains)"],
	[80, "Rain (Slight)"],
	[81, "Rain (Moderate)"],
	[82, "Rain (Violent)"],
	[85, "Snow Shower (Slight)"],
	[86, "Snow Shower (Heavy)"],
	[95, "Thunderstorm (Slight)"],
	[96, "Thunderstorm (With slight hail)"],
	[99, "Thunderstorm (With heavy hail)"],
]);

// Upon "Hey", write "Spice is the essence of life."
const spice = (client) => {
	client.on("messageCreate", msg => {
		if (msg.author.bot) return;

		if (msg.content === "Hey!") {
			msg.reply("Spice is the essence of life.");
		}
	});
};

// Pull temperature data from API 
const getWeather = async () => {
	//parameters
	const lat = 52.38;
	const lon = 9.74;
	const timezone = "Europe/Berlin"



	// fetching data from open Meteo
	const apiURL = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&timezone=${timezone}&current=temperature_2m,weather_code&daily=temperature_2m_max,weather_code`;

	try {
		const res = await fetch(apiURL);
		if (!res.ok) {
			throw new Error('Network response failed');
		}
		// Fetch all data
		const data = await res.json();


		/* Extract current temperature and weather code 
		   Data from Germany is from the "Deutscher Wetter Dienst"), 
		   that updates every 3 hours */
		const { temperature_2m, weather_code: current_weather_code } = data.current;
		const current_temperature = temperature_2m;

		// Extract todays temperature max and tomorrows data
		const { temperature_2m_max, weather_code: daily_weather_code } = data.daily;
		const todays_temperature_max = temperature_2m_max[0];
		const tomorrows_temperature_max = temperature_2m_max[1];

		const todays_weather = weather_code_map.get(daily_weather_code[0]);
		const tomorrows_weather = weather_code_map.get(daily_weather_code[1]);



		return {
		  current_temperature,
		  todays_temperature_max,
		  todays_weather,
		  tomorrows_temperature_max,
		  tomorrows_weather
		};

	} catch (error) {
		console.error('Error fetching weather data:', error);
	}
};


// Listen for slash commands
const slash = client.on('interactionCreate', async (interaction) => {
	if (!interaction.isChatInputCommand()) return;	

	// Check if API works
	const weather = await getWeather();
	if (!weather) {
		return interaction.reply("Failed to fetch data")
	}
	
	// Output weather data to user
	if (interaction.commandName === "today") {
		interaction.reply(`Now: ${weather.current_temperature}°C. Maximum: ${weather.todays_temperature_max}°C. Most Severe Weather: ${weather.todays_weather}`);
	} else if (interaction.commandName === "tomorrow")  {
		interaction.reply(`Maximum: ${weather.tomorrows_temperature_max}. Most Severe Weather: ${weather.tomorrows_weather}`);
	} 
	else {
		interaction.reply("Invalid Input");
	}
});



// Execute functions
client.on("ready", async () => {
	const weather = await getWeather();

	console.log(`Logged in as ${client.user.tag}`);

	welcome(client);

	spice(client);

	console.log(weather);
});


// login bot
client.login(process.env.TOKEN)
