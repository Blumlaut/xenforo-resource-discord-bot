// Thank you to the following Packages for existing:
const jsdom = require("jsdom"); // JSDOM
const Discord = require('discord.js'); // Discord.js
const fetch = require('node-fetch'); // node-fetch


const config = require('./config.json')
const client = new Discord.Client();
const { JSDOM } = jsdom;

process.on('uncaughtException', function(err) {
    console.log('Caught exception: ', err);
});

process.on('unhandledRejection', function(err) {
    console.log('Caught exception: ', err);
});

var pages = config.Categories

function updateRD() {
    var time = new Date()
    for (const page of pages) {

        fetch(page) // fetch the category
            .then(res => res.text())
            .then(body => {
                var dom = new JSDOM(body) // generate a DOM Object from the response
                var document = dom.window.document // we dont need anything above .document
                var resources = document.querySelectorAll(".structItem--resource") // fetch every resource on the page
                for (const latest of resources) {
                    var release = false // define some variables
                    var update = false
                    var send = false

                    var latestCategory = document.querySelector(".p-title-value").innerHTML // get the category we are in, e.g. "AC Cars"

                    var latestName = latest.querySelector(".structItem-title").children[0].innerHTML // get the name of the Resource we will be looking at
                    console.log("----- SCANNING " + latestName + " -----")
                    console.log("Resource Name: " + latestName)

                    var latestDescription = latest.querySelector(".structItem-resourceTagLine").innerHTML // get Description
                    console.log("Resource Description: " + latestDescription)

                    var latestDownloads = latest.querySelector(".structItem-metaItem--downloads").children[1].innerHTML // get Download Count
                    console.log("Resource Downloads: " + latestDownloads)

                    var latestStarsArray = latest.querySelectorAll(".ratingStars-star--full, .ratingStars-star--half") // Collect the Amount of Stars we have
                    var latestStars = 0
                    for (const star of latestStarsArray) {
                        if (star.classList.contains('ratingStars-star--half')) { // half star is 0.5 score
                            latestStars = latestStars + 0.5
                        } else {
                            latestStars = latestStars + 1 // full star is 1 score, we dont count empty stars as they are zero.
                        }
                    }
                    console.log("Stars: " + latestStars)

                    var latestURL = latest.querySelector(".structItem-title").children[0].getAttribute('href') // get the URL to the Resource, we will link this in the Discord Message

                    var latestVersion = latest.querySelector(".structItem-title").children[1].innerHTML // Get the current Resource Version
                    console.log("Resource Version: " + latestVersion)

                    var latestTime = latest.querySelector(".structItem-startDate").children[0].children[0].getAttribute('data-time') // get the Date the Resource was submitted, UNIX Time

                    var released = new Date(latestTime * 1000) // js Date is in MS, so multiply by 1000
                    console.log("Released: " + released)

                    var latestUpdate = latest.querySelector(".structItem-metaItem--lastUpdate").children[1].children[0].children[0].getAttribute('data-time') // get the Date the Resource was last Updated, again, UNIX Time
                    var updated = new Date(latestUpdate * 1000)
                    console.log("Last Update: " + updated)

                    if (latestTime > ((time / 1000) - 1800)) { // if the resource has been Released in the last 30 minutes, its a new Release
                        release = true
                        send = true
                    } else if (latestUpdate > ((time / 1000) - 1800)) { // if it's been Updated in the last 30 Minutes, it's an Update
                        update = true
                        send = true
                    }

                    var latestImage = latest.querySelector(".structItem-iconContainer").children[0].children[0].getAttribute("src") // get the Icon of the Resource
                    if (!latestImage) {
                        latestImage = "/RD_Short.png" // if there's no icon, use the RD Logo
                    }
                    console.log("https://www.racedepartment.com" + latestImage)

                    var latestAuthor = latest.querySelector(".structItem-parts").children[0].children[0].innerHTML // Get the Author of the Resource

                    const embed = new Discord.MessageEmbed()

                    embed.setDescription(latestDescription)
                    embed.setColor("#00D800") // Green is nice.
                    embed.setThumbnail("https://www.racedepartment.com" + latestImage) // the domain will always be racedepartment.com
                    embed.setURL("https://www.racedepartment.com" + latestURL)
                    if (release) { // have two language strings for each.
                        embed.setTitle(latestName + " " + latestVersion + " has been released.")
                    } else {
                        embed.setTitle(latestName + " has been updated to " + latestVersion + ".")
                    }

                    // my auto-formatting makes this ugly, sorry :(
                    embed.addFields({ name: "Category", value: latestCategory, inline: true }, { name: "Author", value: latestAuthor, inline: true }, { name: "Mod Name", value: latestName, inline: true }, { name: "Version", value: latestVersion, inline: true }, { name: "Downloads", value: latestDownloads, inline: true }, { name: "Rating", value: latestStars + "/5", inline: true })
                    embed.setTimestamp() // set a timestamp, cause why not?


                    if (send == true) { // if the resource has actually been released or updated recently, send it off!
                        client.channels.cache.get(config.DiscordChannel).send({ embed })
                    }

                    console.log("------ END SCAN ------")

                }

            });
    }
    setTimeout(updateRD, 1800000) // do the same thing again in roughly 30 minutes.
}



client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    userID = client.user.id;
    updateRD()
});

client.login(config.DiscordToken);