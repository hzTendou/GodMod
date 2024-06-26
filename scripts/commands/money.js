import { world } from "@minecraft/server"
import CommandBuilder from "../classes/builders/CommandBuilder.js";
import CommandHandler from "../classes/CommandRegistration.js"
const registration = new CommandBuilder()
.setName('money')
.setAliases(['m'])
.setDescription('Show your money')
.setUsage(['money', 'm'])
.setCancelMessage(true)
.setPrivate(false)
CommandHandler.register(registration, (interaction) => {
    try {
      interaction.player.runCommandAsync(` tellraw @s {"rawtext":[{"text":"<Server> §2Your total money >> "},{"score":{"name":"*","objective":"money"}}]}`)                                                     
        }
catch(e) {
  interaction.player.runCommandAsync(`tellraw @s {"rawtext":[{"text":"<Server> §4Para objesi oluşturulmamış!"}]}`)                                                 
        
  }
})