import { world } from "@minecraft/server"
import CommandBuilder from "../classes/builders/CommandBuilder.js";
import CommandHandler from "../classes/CommandRegistration.js"

const registration = new CommandBuilder()
.setName('set-home')
.setAliases(['s-h'])
.setDescription('set you home')
.setUsage(['set-home', 's-h'])
.setCancelMessage(true)
.setPrivate(false)    
CommandHandler.register(registration, (interaction) => {
      var player = interaction.player
      var home = interaction.player.location.x + " " + interaction.player.location.y + " " + interaction.player.location.z
      player.getTags().forEach(tag => {
        if (tag.includes("home: ")) {
          player.removeTag(tag)
        }
      })
      player.addTag(`home: ${home}`)
      world.getDimension("overworld").runCommand(`tellraw "${interaction.player.name}" {"rawtext":[{"text":"§2home point determined >> ${home}!"}]}`)
    })
