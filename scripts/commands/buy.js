import { world } from "@minecraft/server"
import CommandBuilder from "../classes/builders/CommandBuilder.js";
import CommandHandler from "../classes/CommandRegistration.js"
const registration = new CommandBuilder()
.setName('buy-ore')
.setAliases(['b-o'])
.setDescription('maden alırsın')
.setUsage(['buy-ore', 'b-o'])
.setCancelMessage(true)
.setPrivate(false)
.addInput(input => {
  return input.setName('inputtt').setType('string').setDescription('sj')
})
CommandHandler.register(registration, (interaction) => {
   try{
        let inputcmd = interaction.command.getInput('inputtt')?.getValue()
        let inputsp = inputcmd.split("-")
        let input1 = inputsp[0]
        let input2 = inputsp[1]
        let rightInventoryComp = interaction.player.getComponent("inventory")
        let rightChestContainer = rightInventoryComp.container
        let item = rightChestContainer.getItem(8)
   	     if(input1 == "diamond"){
   	     	let money = 50*input2
   	     	world.getDimension("overworld").runCommand(`execute "${interaction.player.name}" ~~~ tag @s[scores={money=${money}..}] add varmoney` )
          world.getDimension("overworld").runCommand(`execute "${interaction.player.name}" ~~~ give @s[tag=varmoney] diamond ${input2} ` )
          world.getDimension("overworld").runCommand(`execute "${interaction.player.name}" ~~~ scoreboard players remove @s[tag=varmoney] money ${money}` )
          world.getDimension("overworld").runCommand(`tag "${interaction.player.name}" remove varmoney` )
   	     }
   	     	if(input1 == "emerald"){
   	     		let money = 40*input2
   	     		world.getDimension("overworld").runCommand(`execute "${interaction.player.name}" ~~~ tag @s[scores={money=${money}..}] add varmoney` )
          world.getDimension("overworld").runCommand(`execute "${interaction.player.name}" ~~~ give @s[tag=varmoney] emerald ${input2} ` )
          world.getDimension("overworld").runCommand(`execute "${interaction.player.name}" ~~~ scoreboard players remove money ${money}` )
          world.getDimension("overworld").runCommand(`execute "${interaction.player.name}" ~~~ tellraw @s[tag=varmoney] {"rawtext":[{"text":"<Server> §2Item successfully sold! \nMoney lost >> ${money}"}]}` )
   	      world.getDimension("overworld").runCommand(`tag "${interaction.player.name}" remove varmoney` )
   	     }
   	     	if(input1 == "gold"){
   	     		let money = 20*input2
   	     		world.getDimension("overworld").runCommand(`execute "${interaction.player.name}" ~~~ tag @s[scores={money=${money}..}] add varmoney` )
          world.getDimension("overworld").runCommand(`execute "${interaction.player.name}" ~~~ give @s[tag=varmoney] golden_ore ${input2} ` )
          world.getDimension("overworld").runCommand(`execute "${interaction.player.name}" ~~~ scoreboard players remove @s[tag=varmoney] ${money}` )
          world.getDimension("overworld").runCommand(`execute "${interaction.player.name}" ~~~ tellraw @s[tag=varmoney] {"rawtext":[{"text":"<Server> §2Item successfully sold! \nMoney lost >> ${money}"}]}` )
   	      world.getDimension("overworld").runCommand(`tag "${interaction.player.name}" remove varmoney` )
   	     		
   	     	}
   	     if(input1 == "netherite"){
   	     	let money = 80*input2
   	     	world.getDimension("overworld").runCommand(`execute "${interaction.player.name}" ~~~ tag @s[scores={money=${money}..}] add varmoney` )
          world.getDimension("overworld").runCommand(`execute "${interaction.player.name}" ~~~ give @s[tag=varmoney] netherite_ingot ${input2} ` )
          world.getDimension("overworld").runCommand(`execute "${interaction.player.name}" ~~~ scoreboard players remove @s[tag=varmoney] money ${money}` )
          world.getDimension("overworld").runCommand(`execute "${interaction.player.name}" ~~~ tellraw @s[tag=varmoney] {"rawtext":[{"text":"<Server> §2Item successfully sold! \nMoney lost >> ${money}"}]}` )
   	      world.getDimension("overworld").runCommand(`tag "${interaction.player.name}" remove varmoney` )
   	     }
   	     if(input1 == "iron"){
   	     	let money = 25*input2
   	     	world.getDimension("overworld").runCommand(`execute "${interaction.player.name}" ~~~ tag @s[scores={money=${money}..}] add varmoney` )
          world.getDimension("overworld").runCommand(`execute "${interaction.player.name}" ~~~ give "${interaction.player.name}" iron_ingot ${input2} ` )
          world.getDimension("overworld").runCommand(`execute "${interaction.player.name}" ~~~ scoreboard players remove @s[tag=varmoney] money ${money}` )
          world.getDimension("overworld").runCommand(`execute "${interaction.player.name}" ~~~ tellraw @s[tag=varmoney] {"rawtext":[{"text":"<Server> §2Item successfully sold! \nMoney lost >> ${money}"}]}` )
          world.getDimension("overworld").runCommand(`tag "${interaction.player.name}" remove varmoney` )
 }
   	     	if(input1 == "coal"){
   	     		let money = 10*input2
   	     		world.getDimension("overworld").runCommand(`execute "${interaction.player.name}" ~~~ tag @s[scores={money=${money}..}] add varmoney` )
          world.getDimension("overworld").runCommand(`execute "${interaction.player.name}" ~~~ give @s[tag=varmoney] coal ${input2} ` )
          world.getDimension("overworld").runCommand(`execute "${interaction.player.name}" ~~~ scoreboard players remove @s[tag=varmoney] money ${money}` )
          world.getDimension("overworld").runCommand(`execute "${interaction.player.name}" ~~~ tellraw @s[tag=varmoney] {"rawtext":[{"text":"<Server> §2Item successfully sold! \nMoney lost >> ${money}"}]}` )
   	      world.getDimension("overworld").runCommand(`tag "${interaction.player.name}" remove varmoney` )
   	     	}
   }
catch(e) {
    world.getDimension("overworld").runCommand(`execute "${interaction.player.name}" ~~~ tellraw @s {"rawtext":[{"text":"<Server> §4You don't have enough money"}]}` )                                                     
       
}
	
})