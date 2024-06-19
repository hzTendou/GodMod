import { world } from "@minecraft/server"
import CommandBuilder from "../classes/builders/CommandBuilder.js";
import CommandHandler from "../classes/CommandRegistration.js"

const registration = new CommandBuilder()
.setName('setup')
.setAliases(['s'])
.setDescription('setup')
.setUsage(['setup', 'setup'])
.setCancelMessage(true)
.setPrivate(false)
CommandHandler.register(registration, (interaction) => {
  try {
    function runCmd(cmd) {
      world.getDimension("overworld").runCommandAsync(cmd)
    }
    function sendMsg(player, msg) {
     runCmd(`tellraw "${player}" {"rawtext":[{"text":"${msg}"}]}`)
    }
    world.getDimension("overworld").runCommandAsync(`scoreboard objectives add money dummy`)
    world.getDimension("overworld").runCommandAsync(`scoreboard objectives add bank dummy`)
    world.getDimension("overworld").runCommandAsync(`scoreboard objectives add player.health dummy`)
    world.getDimension("overworld").runCommandAsync(`scoreboard objectives add player.sneaking dummy`)
    interaction.player.runCommandAsync(`summon tgm:database ~~+10~`)
    runCmd(`tag @e[type=tgm:database] add database`)
    sendMsg(interaction.player.nameTag, "<Server> §2Everything created!")
  }
 catch(e) {
    world.getDimension("overworld").runCommandAsync(`say ${e} ${e.stack}`)
  }
  })
