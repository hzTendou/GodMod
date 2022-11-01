import { world } from "@minecraft/server"
import CommandBuilder from "../classes/builders/CommandBuilder.js";
import CommandHandler from "../classes/CommandRegistration.js"
const registration = new CommandBuilder()
.setName('bank')
.setAliases(['b'])
.setDescription('Show your bank money')
.setUsage(['bank', 'b'])
.setCancelMessage(true)
.setPrivate(false)
CommandHandler.register(registration, (interaction) => {
    try {
        world.getDimension("overworld").runCommand(`execute "${interaction.player.name}" ~~~ tellraw @s {"rawtext":[{"text":"<Server> §2Your total bank money >> "},{"score":{"name":"*","objective":"bank"}}]}` )                                                     
        }
catch(e) {
   world.getDimension("overworld").runCommand(`execute "${interaction.player.name}" ~~~ tellraw @s {"rawtext":[{"text":"<Server> §4bank object not created"}]}` )                                                     
       
  }
})