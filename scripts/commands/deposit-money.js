import { world } from "@minecraft/server"
import CommandBuilder from "../classes/builders/CommandBuilder.js";
import CommandHandler from "../classes/CommandRegistration.js"
const registration = new CommandBuilder()
.setName('deposit-money')
.setAliases(['dm'])
.setDescription('deposite your money')
.setUsage(['dm', 'dm <count>'])
.setCancelMessage(true)
.setPrivate(false)
.addInput(input => {
  return input.setName('count').setType('string').setDescription('count')
})
CommandHandler.register(registration, (interaction) => {
    try {
        const input1 = interaction.command.getInput('count')?.getValue()
        interaction.player.runCommandAsync(`tag @s[scores={money=${input1}..}] add varmoney` )
        interaction.player.runCommandAsync(`scoreboard players remove @s[tag=varmoney] money ${input1}` )
        interaction.player.runCommandAsync(`scoreboard players add @s[tag=varmoney] bank ${input1}` )
        interaction.player.runCommandAsync(`tellraw @s {"rawtext":[{"text":"<Server> §2money deposit successful \nAmount deposited >> ${input1}"}]}` )          
        world.getDimension("overworld").runCommandAsync(`tag "${interaction.player.name}" remove varmoney` )
        }
catch(e) {
    world.getDimension("overworld").runCommandAsync(`execute "${interaction.player.name}" ~~~ tellraw @s {"rawtext":[{"text":"<Server> §4You don't have enough money!}]}` )                                              
        
  }
})