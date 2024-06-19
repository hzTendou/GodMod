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
      var home = Math.trunc(interaction.player.location.x) + " " +  Math.trunc(interaction.player.location.y) + " " +  Math.trunc(interaction.player.location.x)
      player.getTags().forEach(tag => {
        if (tag.includes("home: ")) {
          player.removeTag(tag)
        }
      })
      player.addTag(`home: ${home}`)
      world.getDimension("overworld").runCommandAsync(`tellraw "${interaction.player.name}" {"rawtext":[{"text":"§2home point determined >> ${home}!"}]}`)
    })
