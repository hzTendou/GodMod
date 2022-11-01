import { world } from "@minecraft/server"
import CommandBuilder from "../classes/builders/CommandBuilder.js";
import CommandHandler from "../classes/CommandRegistration.js"

const registration = new CommandBuilder()
.setName('hub')
.setAliases(['h'])
.setDescription('hub')
.setUsage(['hub', 'h'])
.setCancelMessage(true)
.setPrivate(false)
CommandHandler.register(registration, (interaction) => {
  try {
  	world.getDimension("overworld").runCommand(`tp "${interaction.player.name}" @e[type=tgm:hub]`)
    world.getDimension("overworld").runCommand(`tellraw "${interaction.player.name}" {"rawtext":[{"text":"§2You are in hub now!"}]}`)

  }
 catch(e) {
    world.getDimension("overworld").runCommand(`say ${e} ${e.stack}`)
  }
  })
