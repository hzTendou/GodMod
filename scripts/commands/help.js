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
    world.getDimension("overworld").runCommand(`tellraw "${interaction.player.name}" {"rawtext":[{"text":"§2Prefix: t/ \nt/help - opens this list\nt/setup - creates everything needed \nt/tpa <Player> - teleports to another player \nt/money - shows your money \nt/send-money <Player>-<Amount> - specified sends money to player \nt/bank - bank shows your money \nt/deposit-money <amount> - deposit money into bank\nt/withdraw-money <amount> - withdraw your existing funds\nt/sell-ore <diamond/gold/iron /coal/netherite>-<amount> - sell your ores (take item)\nt/buy-ore <diamond/gold/iron/coal/netherite>-<amount> - buy ore\nt/warp <Warp name> - Sends you to warp at the entered name\nt/warp-add <Warp name> - adds warp (perm:Admin only)\nt/warp-del <warp name> - deletes warp (perm:Admin only)\nt/warp-list - warp list comes up\nt/hub-set - sets your stop at the lobby point (perm:Admin only)\nt/set-home - makes your stop your home point\nt/go-home - you go to your home\nt/island - go to your island\nt/island-create - create island for you\nt/island-del - delete your island \n\nCompass usage: right click on pc and press and hold on mobile to go to lobby\nRank usage:\n/tag <player name> add rank:<Rank Name>"}]}`)
  }
 catch(e) {
    world.getDimension("overworld").runCommand(`say ${e} ${e.stack}`)
  }
  })
