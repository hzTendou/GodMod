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
  	world.getDimension("overworld").runCommandAsync(`tp "${interaction.player.name}" @e[type=tgm:hub]`)
    world.getDimension("overworld").runCommandAsync(`tellraw "${interaction.player.name}" {"rawtext":[{"text":"§2You are in hub now!"}]}`)

  }
 catch(e) {
    world.getDimension("overworld").runCommandAsync(`say ${e} ${e.stack}`)
  }
  })
