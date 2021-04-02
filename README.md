# racedepartment-discord-bot

racedepartment-discord-bot is a small NodeJS Application that scrapes predefined RaceDepartment categories for resource updates and fresh releases, then posts these to a predefined Discord channel


## How it Works

Every 30 minutes from when the bot was started, the Bot will fetch the pages defined in the Config and look at the recently added/updates Resources, if the Resource has been uploaded or updated in the past 30 minutes, a Discord message will be sent in the defined channel.

This process is designed to stress the RaceDepartment Servers as little as possible, each Category is only fetched once every 30 Minutes, Resources are not fetched individually, i hope that RaceDepartment does not mind this, but it should generally cause even less traffic than just normal user traffic, as linked images aren't downloaded.


## Why would i need this?

You probably don't, however, if you are a refresh addict like me, having a bot that essentially looks for new mods for me is a great timesaver.


## Whats the Goal?

Currently this is a small experiment and learning experience for me, i invite anyone to clone, edit and use this Bot as they wish, just _please_ do not accidentally DoS RaceDepartment, keep the refresh time low, be nice.

## How 2 Use

### Step 0 - Basic Setup

Using this Bot is very simple, you need the following:

```
a shell on the system you want to set the bot up. 
Git
NodeJS + NPM
Some application to allow the bot to run unattended (tmux, screen....)
a text editor
```


Now we clone our Repository using the following command:

```
git clone https://github.com/Blumlaut/racedepartment-discord-bot
```

then we simply cd into our newly created `racedepartment-discord-bot` directory, then we will need to set up our dependencies, simply run `npm i` to install everything, this can take a few seconds so sit back and.. oh nevermind its done.

### Step 1 - Configuration

We will want to configure our Bot before running it, so copy the `config.example.json` and rename it to `config.json`, then open it using your Text Editor, here we will fill a few Values in:

- `DiscordToken` - Your Discord API Key
- `DiscordChannel` - The Channel ID where Updates should be sent, the bot should already be added to the Guild and have permissions to read and write into it.
- `Categories` - An Array of Links, which would be the RaceDepartment Categories, for example, `https://www.racedepartment.com/downloads/categories/ams-cars.121/` for the "AMS Cars" Category.


Now we Save&Exit, thats everything taken care of!


### Step 2 - Make it happen

Now simply start the Bot using `node rd-bot.js`, it should show a nice `Logged in as UserName#ID` message and immediately start scanning the Categories.