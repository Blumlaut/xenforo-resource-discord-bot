const jsdom = require("jsdom"); // https://www.npmjs.com/package/jsdom
const { JSDOM } = jsdom;

const Discord = require('discord.js');
const { Partials, GatewayIntentBits } = Discord;

const config = require('./config.json')
const client = new Discord.Client({ partials: [ Partials.User, Partials.Message], intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });


process.on('uncaughtException', function(err) {
    console.log('Caught exception: ', err);
});

process.on('unhandledRejection', function(err) {
    console.log('Caught exception: ', err);
});



refreshTime = (config.RefreshTime || 1800000)

var pages = config.Categories


function extractDomain(url) {
    return url.match(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n\?\=]+)/im)[0]
}

function updateRD() {
    var time = new Date()
    for (const page of pages) {

        fetch(page) // fetch the category
            .then(res => res.text())
            .then(body => {
                var dom = new JSDOM(body)
                var document = dom.window.document
                var resources = document.querySelectorAll(".structItem--resource")
                console.log("found "+resources.length+" resources")
                for (const latest of resources) {
                    var release = false // define some variables
                    var update = false
                    var send = false


                    var titleIndex = 0

                    if (latest.querySelector(".structItem-title").children[titleIndex].className.includes('labelLink')) {
                        titleIndex=+1 // push our index one up as xenforo variant contains tags before the title name
                    }

                    var latestName = latest.querySelector(".structItem-title").children[titleIndex].textContent


                    var latestAuthor = latest.querySelector(".structItem-parts").children[0].children[0].textContent // Get the Author of the Resource
                    var latestDescription = latest.querySelector(".structItem-resourceTagLine").textContent // get Description
                    var latestDownloads = latest.querySelector(".structItem-metaItem--downloads").children[1].textContent // get Download Count
                    var latestCategory = document.querySelector(".p-title-value").textContent
                    var latestURL = latest.querySelector(".structItem-title").children[titleIndex].getAttribute('href')
                    var latestVersion = latest.querySelector(".structItem-title").children[titleIndex+1].textContent
                    var latestTime = latest.querySelector(".structItem-startDate").children[0].children[0].getAttribute('data-time') // get the Date the Resource was submitted, UNIX Time
                    var latestUpdate = latest.querySelector(".structItem-metaItem--lastUpdate").children[1].children[0].children[0].getAttribute('data-time') // get the Date the Resource was last Updated, again, UNIX Time
                    var latestImage = latest.querySelector(".structItem-iconContainer").children[0].children[0].getAttribute("src") // get the Icon of the Resource
                    var rootURL = extractDomain(page)


                    var latestStarsArray = latest.querySelectorAll(".ratingStars-star--full, .ratingStars-star--half") // Collect the Amount of Stars we have
                    var latestStars = 0
                    for (const star of latestStarsArray) {
                        if (star.classList.contains('ratingStars-star--half')) { // half star is 0.5 score
                            latestStars = latestStars + 0.5
                        } else {
                            latestStars = latestStars + 1 // full star is 1 score, we dont count empty stars as they are zero.
                        }
                    }

                    console.log("----- SCANNING " + latestName + " -----")
                    console.log("Resource Name: " + latestName)

                    console.log("Resource Description: " + latestDescription)

                    console.log("Resource Downloads: " + latestDownloads)


                    console.log("Stars: " + latestStars)


                    console.log("URL: "+latestURL)

                    console.log("Resource Version: " + latestVersion)


                    var released = new Date(latestTime * 1000) // js Date is in MS, so multiply by 1000
                    console.log("Released: " + released)

                    var updated = new Date(latestUpdate * 1000)
                    console.log("Last Update: " + updated)

                    if (latestTime > ((time / 1000) - (refreshTime/1000))) { // if the resource has been Released in the last 30 minutes, its a new Release
                        release = true
                        send = true
                    } else if (latestUpdate > ((time / 1000) - (refreshTime/1000))) { // if it's been Updated in the last 30 Minutes, it's an Update
                        update = true
                        send = true
                    }

                    if (!latestImage) {
                        latestImage = (config.PlaceholderImage || "logo.png") // if there's no icon, use the RD Logo
                    }
                    console.log("Image: "+latestImage)

                    console.log("Author: "+latestAuthor)

                    const embed = new Discord.MessageEmbed()

                    embed.setDescription(latestDescription)
                    embed.setColor("#00D800") // Green is nice.

                    embed.setThumbnail(rootURL + latestImage) 
                    embed.setURL(rootURL + latestURL)


                    if (release) {
                        embed.setTitle(latestName + " " + latestVersion + " has been released.")
                    } else {
                        embed.setTitle(latestName + " has been updated to " + latestVersion + ".")
                    }
                    embed.addFields({ name: "Category", value: latestCategory, inline: true }, { name: "Author", value: latestAuthor, inline: true }, { name: "Mod Name", value: latestName, inline: true }, { name: "Version", value: latestVersion, inline: true }, { name: "Downloads", value: latestDownloads, inline: true }, { name: "Rating", value: latestStars + "/5", inline: true })
                    embed.setTimestamp() // set a timestamp, cause why not?


                    if (send == true) { // if the resource has actually been released or updated recently, send it off!
                        client.channels.fetch(config.DiscordChannel).send({ embeds: [embed] })
                    }

                    console.log("------ END SCAN ------")

                }

            });
    }
    setTimeout(updateRD, refreshTime)
}



client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    userID = client.user.id;
    updateRD()
});

client.login(config.DiscordToken);