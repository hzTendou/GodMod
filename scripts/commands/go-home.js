import { world } from "@minecraft/server"
import CommandBuilder from "../classes/builders/CommandBuilder.js";
import CommandHandler from "../classes/CommandRegistration.js"

const registration = new CommandBuilder()
.setName('go-home')
.setAliases(['h-g'])
.setDescription('go you home')
.setUsage(['ev-git', 'e-g'])
.setCancelMessage(true)
.setPrivate(false)  
CommandHandler.register(registration, (interaction) => {
    var player = interaction.player;
    var homeCoords = ""
    player.getTags().forEach(tag => {
      if (tag.includes("home: ")) {
        homeCoords = tag.replace("home: ", "");
      }
    })
    if (!homeCoords) {
      world.getDimension("overworld").runCommandAsync(`tellraw "${interaction.player.name}" {"rawtext":[{"text":"§4You don't have a house, first create a house >> !set-home"}]}`);
    } else {
      world.getDimension("overworld").runCommandAsync(`tellraw "${interaction.player.name}" {"rawtext":[{"text":"§2You've been teleported home! location >> ${homeCoords}"}]}`);
      world.getDimension("overworld").runCommandAsync(`tp "${player.name}" ${homeCoords}`);
    }
})