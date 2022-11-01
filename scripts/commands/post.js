import { world } from "@minecraft/server"
import CommandBuilder from "../classes/builders/CommandBuilder.js";
import CommandHandler from "../classes/CommandRegistration.js"
const registration = new CommandBuilder()
.setName('send-money')
.setAliases(['sm'])
.setDescription('Başka bir oyuncuya para yollar')
.setUsage(['gönder', 'g'])
.setCancelMessage(true)
.setPrivate(false)
.addInput(input => {
  return input.setName('inputt').setType('string').setDescription('sj')
})
CommandHandler.register(registration, (interaction) => {
   try{
        let inputcmd = interaction.command.getInput('inputt')?.getValue()
        let inputsp = inputcmd.split("-")
        let input1 = inputsp[0]
        let input2 = inputsp[1]
        world.getDimension("overworld").runCommand(`execute "${interaction.player.name}" ~~~ tag @s[scores={para=${input2}..}] add varpara`)
        world.getDimension("overworld").runCommand(`execute "${interaction.player.name}" ~~~ scoreboard players remove @s[tag=varpara] para ${input2}`)
        world.getDimension("overworld").runCommand(`execute "${interaction.player.name}" ~~~ execute @s[tag=varpara] ~~~ scoreboard players add @p[tag="${input1}"] para ${input2}`)
        world.getDimension("overworld").runCommand(`execute "${interaction.player.name}" ~~~ tellraw @s[tag=varpara] {"rawtext":[{"text":"<Server> §2${input2} amounts of money was sent to ${input1} person!"}]}`) 
        world.getDimension("overworld").runCommand(`tag "${interaction.player.name}" remove varpara`)
        }
catch(e) {
    world.getDimension("overworld").runCommand(`execute "${interaction.player.name}" ~~~ tellraw @s {"rawtext":[{"text":"<Server> §4 Something went error \nErrors can be: \nThe name entered is also no player\nYou have not enough money"}]}`)                                                    
        
  }
})