// Slash commands
require("dotenv").config();
const { REST, Routes } = require("discord.js");

const commands = [
	{
	  name: 'today',
	  description: 'Replies wth todays weather',
	},
];

// Set up Bot for POST-REQUEST (POST/PUT is handled by REST-API) 
const rest = new REST({ version: '10'}).setToken(process.env.TOKEN);


// Post the slash commands to the bot
const asyncfunction = async () => {
	try {
		console.log('Registering slash commands ...')
		// update data
		// post slash commands to bot in the specific server
		await rest.put(
			Routes.applicationGuildCommands(
				process.env.CLIENT_ID,
				process.env.GUILD_ID
			),
			// holds the slash commands to be posted
			{ body: commands }
		);

		console.log('Slash commands registered ...');

	} catch (error) {
		console.log(`There was an error ${error}`);
	}
}

// Call the function, to actually POST
asyncfunction()
