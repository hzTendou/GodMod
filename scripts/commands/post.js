import { world } from "@minecraft/server"
import CommandBuilder from "../classes/builders/CommandBuilder.js";
import CommandHandler from "../classes/CommandRegistration.js"
const registration = new CommandBuilder()
.setName('send-money')
.setAliases(['sm'])
.setDescription('Başka bir oyuncuya money yollar')
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
        interaction.player.runCommandAsync(`tag @s[scores={money=${input2}..}] add varmoney`)
        interaction.player.runCommandAsync(`scoreboard players remove @s[tag=varmoney] money ${input2}`)
        interaction.player.runCommandAsync(`execute as @s[tag=varmoney] run scoreboard players add @p[tag="${input1}"] money ${input2}`)
        interaction.player.runCommandAsync(`tellraw @s[tag=varmoney] {"rawtext":[{"text":"<Server> §2${input2} amounts of money was sent to ${input1} person!"}]}`) 
        world.getDimension("overworld").runCommandAsync(`tag "${interaction.player.name}" remove varmoney`)
        }
catch(e) {
    world.getDimension("overworld").runCommandAsync(`execute "${interaction.player.name}" ~~~ tellraw @s {"rawtext":[{"text":"<Server> §4 Something went error \nErrors can be: \nThere's no player with name is your entered\nYou have not enough money"}]}`)                                                    
        
  }
})