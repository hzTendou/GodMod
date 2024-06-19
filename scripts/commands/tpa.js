import { world } from '@minecraft/server'
import CommandBuilder from "../classes/builders/CommandBuilder.js";
import CommandHandler from "../classes/CommandRegistration.js"
import { ActionFormData, ModalFormData, MessageFormData } from '@minecraft/server-ui'
const registration = new CommandBuilder()
.setName('tpa')
.setAliases(['t'])
.setDescription('tp player')
.setUsage(['tpa', 'tpa <Player name>'])
.setCancelMessage(true)
.setPrivate(false)
.addInput(input => {
  return input.setName('nickname').setType('string').setDescription('player')
})

CommandHandler.register(registration, (interaction) => {
    try {
        let input1 = interaction.command.getInput('nickname')?.getValue()
        for(let playert of world.getPlayers()){
          if(playert.name == input1){
            let tpaacuii = new ModalFormData()
            .title("§cTpa Request")
            .toggle(`${interaction.player.name} want to teleport you`,true);
            tpaacuii.show(playert).then(res => {
              if(res.formValues[0] == true){
                ow.runCommandAsync(`tp "${interaction.player.name}" "${playert.name}"`)
              }
              if(res.formValues[0] == false){
                sendMsg(interaction.player.name, "<Server> §5Player decline your tpa request")
              }
            })
          }
        }                                                   
    
      } 
catch(e) {
    world.getDimension("overworld").runCommandAsync(`execute as "${interaction.player.name}" run tellraw @s {"rawtext":[{"text":"<Server> §4There is no such player!"}]}`)          
    world.sendMessage(`${e} and ${e.stack}`)                                      
       
  }
})