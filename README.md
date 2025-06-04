# xenforo-resource-discord-bot

xenforo-resource-discord-bot is a small NodeJS Application that scrapes predefined xenforo resource categories for updates and fresh releases, then posts these to a Discord channel


## How it Works

Every 30 minutes from when the bot was started, it will fetch the pages defined in the config and look at the recently added/updates resources, if the resource has been uploaded or updated in the past 30 minutes, a discord message will be sent in the defined channel.

This process is designed to stress the host as little as possible, each Category is only fetched once every 30 minutes by default, Resources are not fetched individually.

### Note: This bot is optimized for the Racedepartment Forums, your mileage may vary on other Platforms, or versions. If you have a a case where it doesnt work, please create an Issue!

## Why would i need this?

In case you run a Xenforo, or want to Monitor a Forum running on Xenforo for updated resources, this can be useful, many Forums use Xenforo as file databases.

## Whats the Goal?

Currently this is a small experiment and learning experience for me, i invite anyone to clone, edit and use this Bot as they wish, just _please_ do not accidentally DoS any Forums, keep the refresh time low, be nice.

## How 2 Use

### Step 0 - Basic Setup

Using this Bot is very simple, you need the following:

```
a shell
Git
NodeJS 21 or above + NPM
Some application to allow the bot to run unattended (tmux, screen....)
a text editor
```


Now we clone our Repository using the following command:

```
git clone https://github.com/Blumlaut/xenforo-resource-discord-bot
```

then we simply cd into our newly created `xenforo-resource-discord-bot` directory, then we will need to set up our dependencies, simply run `npm i` to install everything, this can take a few seconds so sit back and.. oh nevermind its done.

### Step 1 - Configuration

We will want to configure our Bot before running it, so copy the `config.example.json` and rename it to `config.json`, then open it using your Text Editor, here we will fill a few Values in:

- `DiscordToken` - Your Discord API Key
- `DiscordChannel` - The Channel ID where Updates should be sent, the bot should already be added to the Guild and have permissions to read and write into it.
- `PlaceholderImage` - a path, from domain root, which should be used as a placeholder image
- `RefreshTime` - How often, in milliseconds, the categories should be checked.
- `Categories` - An Array of Links, which would be the Xenforo Resource Categories, for example, 
```json
"Categories": [
        "https://www.racedepartment.com/downloads/categories/ac-cars.6/",
        "https://www.racedepartment.com/downloads/categories/ac-tracks.8/",
        "https://www.racedepartment.com/downloads/categories/ac-misc.10/",
        "https://www.racedepartment.com/downloads/categories/ac-apps.4/",
        "https://www.racedepartment.com/downloads/categories/ac-sounds.9/"
    ]
```


Now we Save&Exit, thats everything taken care of!


### Step 2 - Make it happen

Now simply start the Bot using `node rd-bot.js`, it should show a nice `Logged in as UserName#ID` message and immediately start scanning the Categories.

If there have been any resources uploaded or Updated in the past 30 Minutes, they will now be shown in the Channel:

![](https://blumlaut.me/s/q7fbPYYE2kTyidr/preview)


### Updating the Bot

In case of updates, it's recommended that you first make sure your NodeJS and NPM is up to date, then open the bot directory and run `git pull`, after Git pulled the latest files run `npm i` to update dependencies, once that's done simply restart the bot!
