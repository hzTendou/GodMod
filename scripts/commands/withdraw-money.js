import { world } from "@minecraft/server"
import CommandBuilder from "../classes/builders/CommandBuilder.js";
import CommandHandler from "../classes/CommandRegistration.js"
const registration = new CommandBuilder()
.setName('withdraw-money')
.setAliases(['w-m'])
.setDescription('nope')
.setUsage(['w-m', 'w-m <count>'])
.setCancelMessage(true)
.setPrivate(false)
.addInput(input => {
  return input.setName('count').setType('string').setDescription('count')
})
CommandHandler.register(registration, (interaction) => {
    try {
        const input1 = interaction.command.getInput('count')?.getValue()
        world.getDimension("overworld").runCommandAsync(`execute as "${interaction.player.name}" run tag @s[scores={bank=${input1}..}] add varmoney `)
        world.getDimension("overworld").runCommandAsync(`execute as "${interaction.player.name}" run scoreboard players remove @s[tag=varmoney ] bank ${input1}`)
        world.getDimension("overworld").runCommandAsync(`execute as "${interaction.player.name}" run scoreboard players add @s[tag=varmoney ] money  ${input1}`)
     
        world.getDimension("overworld").runCommandAsync(`execute as "${interaction.player.name}" run tellraw @s {"rawtext":[{"text":"<Server> §2Money withdraw successful \nAmount withdrawn >> ${input1}"}]}`)          
        world.getDimension("overworld").runCommandAsync(`tag "${interaction.player.name}" remove varmoney `)
        }
catch(e) {
    world.getDimension("overworld").runCommandAsync(`execute "${interaction.player.name}" tellraw @s {"rawtext":[{"text":"<Server> §4You don't have enough money in the bank"}]}`, world.getDimension("overworld"))
       
  }
})