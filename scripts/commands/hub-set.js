import { world } from "@minecraft/server"
import CommandBuilder from "../classes/builders/CommandBuilder.js";
import CommandHandler from "../classes/CommandRegistration.js"

const registration = new CommandBuilder()
.setName('set-hub')
.setAliases(['s-h'])
.setDescription('setting hup')
.setUsage(['set-hub', 's-h'])
.setCancelMessage(true)
.setPrivate(false)
CommandHandler.register(registration, (interaction) => {
  try {
    const hastagstatus = interaction.player.hasTag("perm:Admin")
    if(hastagstatus == true){
      interaction.player.runCommandAsync(`summon tgm:hub ~~+2~`)
    world.getDimension("overworld").runCommandAsync(`tellraw "${interaction.player.name}" {"rawtext":[{"text":"§2Lobby point set"}]}`)
}
 else if(hastagstatus == false){
   world.getDimension("overworld").runCommandAsync(`tellraw "${interaction.player.name}" {"rawtext":[{"text":"§4You are not competent enough"}]}`)
 }
  }
 catch(e) {
    world.getDimension("overworld").runCommandAsync(`say ${e} ${e.stack}`)
  }
  })
