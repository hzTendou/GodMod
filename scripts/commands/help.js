import { world } from "@minecraft/server"
import CommandBuilder from "../classes/builders/CommandBuilder.js";
import CommandHandler from "../classes/CommandRegistration.js"

const registration = new CommandBuilder()
.setName('help')
.setAliases(['h'])
.setDescription('open help menu')
.setUsage(['help', 'h'])
.setCancelMessage(true)
.setPrivate(false)
CommandHandler.register(registration, (interaction) => {
  try {
    world.getDimension("overworld").runCommandAsync(`tellraw "${interaction.player.name}" {"rawtext":[{"text":"§2Prefix: ! \n!help - opens this list\n!money - shows your money \n!send-money <Player>-<Amount> - specified sends money to player \n!hub - teleporting to you hub\n!bank - bank shows your money \n!deposit-money <amount> - deposit money into bank\n!withdraw-money <amount> - withdraw your existing funds\n!sell-ore <diamond/gold/iron /coal/netherite> <amount> - sell your ores (take item)\n!buy-ore <diamond/gold/iron/coal/netherite> <amount> - buy ore\n!set-home - makes your stop your home point\n!go-home - you go to your home\n!island - go to your island\n!island-create - create island for you\n!island-del - delete your island\nLook /function for more info\n\nCompass usage: right click on pc and press and hold on mobile\nRank usage:\n/tag <player name> add rank:<Rank Name>"}]}`)
  }
 catch(e) {
    world.getDimension("overworld").runCommandAsync(`say ${e} ${e.stack}`)
  }
  })
