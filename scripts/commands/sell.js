import { world } from "@minecraft/server"
import CommandBuilder from "../classes/builders/CommandBuilder.js";
import CommandHandler from "../classes/CommandRegistration.js"
const registration = new CommandBuilder()
.setName('sell-ore')
.setAliases(['s-o'])
.setDescription('selling ore')
.setUsage(['sell-ore', 's-o'])
.setCancelMessage(true)
.setPrivate(false)
.addInput(input => {
  return input.setName('inputtt').setType('string').setDescription('sj')
});
CommandHandler.register(registration, (interaction) => {
   try{
        let inputcmd = interaction.command.getInput('inputtt')?.getValue()
        let inputsp = inputcmd.split("-")
        let input1 = inputsp[0]
        let input2 = inputsp[1]
        let rightInventoryComp = interaction.player.getComponent("minecraft:inventory")
        let rightChestContainer = rightInventoryComp.container
        let item = rightChestContainer.getItem(interaction.player.selectedSlotIndex)
   if(item.amount >= input2){
   	     if(input1 == "diamond"){
          world.getDimension("overworld").runCommandAsync(`clear "${interaction.player.name}" diamond 0 ${input2} `)
          let money = 10*input2
          world.getDimension("overworld").runCommandAsync(`scoreboard players add "${interaction.player.name}" money ${money}`)
          interaction.player.runCommandAsync(`tellraw @s {"rawtext":[{"text":"<Server> §2Item successfully sold! \nMoney earned >> ${money}"}]}`)
   	     }
   	     	if(input1 == "emarald"){
          world.getDimension("overworld").runCommandAsync(`clear "${interaction.player.name}" emerald 0 ${input2} `)
          let money = 5*input2
          world.getDimension("overworld").runCommandAsync(`scoreboard players add "${interaction.player.name}" money ${money}`)
          interaction.player.runCommandAsync(`tellraw @s {"rawtext":[{"text":"<Server> §2Item successfully sold! \nMoney earned >> ${money}"}]}`)
   	     }
   	     	if(input1 == "gold"){
          world.getDimension("overworld").runCommandAsync(`clear "${interaction.player.name}" golden_ore 0 ${input2} `)
          let money = 15*input2
          world.getDimension("overworld").runCommandAsync(`scoreboard players add "${interaction.player.name}" money ${money}`)
          interaction.player.runCommandAsync(`tellraw @s {"rawtext":[{"text":"<Server> §2Item successfully sold! \nMoney earned >> ${money}"}]}`)
   	     }
   	     if(input1 == "netherite"){
          world.getDimension("overworld").runCommandAsync(`clear "${interaction.player.name}" netherite_ingot 0 ${input2} `)
          let money = 30*input2
          world.getDimension("overworld").runCommandAsync(`scoreboard players add "${interaction.player.name}" money ${money}`)
          interaction.player.runCommandAsync(`tellraw @s {"rawtext":[{"text":"<Server> §2Item successfully sold! \nMoney earned >> ${money}"}]}`)
   	     }
   	     if(input1 == "iron"){
          world.getDimension("overworld").runCommandAsync(`clear "${interaction.player.name}" iron_ingot 0 ${input2} `)
          let money = 10*input2
          world.getDimension("overworld").runCommandAsync(`scoreboard players add "${interaction.player.name}" money ${money}`)
          interaction.player.runCommandAsync(`tellraw @s {"rawtext":[{"text":"<Server> §2Item successfully sold! \nMoney earned >> ${money}"}]}`)
   	     }
   	     	if(input1 == "coal"){
          world.getDimension("overworld").runCommandAsync(`clear "${interaction.player.name}" coal 0 ${input2} `)
          let money = 1*input2
          world.getDimension("overworld").runCommandAsync(`scoreboard players add "${interaction.player.name}" money ${money}`)
          interaction.player.runCommandAsync(`tellraw @s {"rawtext":[{"text":"<Server> §2Item successfully sold! \nMoney earned >> ${money}"}]}`)
   	     }
   	     	
   	     } 
        else {
        	world.getDimension("overworld").runCommandAsync(`execute as "${interaction.player.name}" run tellraw @s {"rawtext":[{"text":"<Server> §2Item not found or its number is not correct!"}]}`)
        }
        
   }
catch(e) {
   world.getDimension("overworld").runCommandAsync(`execute as "${interaction.player.name}" run tellraw @s {"rawtext":[{"text":"<Server> ${e} and ${e.stack}"}]}`)                                               
      
  }
})