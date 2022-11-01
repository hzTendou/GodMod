import { world } from "@minecraft/server";
import CommandBuilder from "../classes/builders/CommandBuilder.js";
import CommandHandler from "../classes/CommandRegistration.js"

const registration1 = new CommandBuilder()
.setName('warp')
.setAliases(['w'])
.setDescription('Kendi parana bakarsın')
.setUsage(['bank', 'b'])
.setCancelMessage(true)
.setPrivate(false)
const registration2 = new CommandBuilder()
.setName('warp-add')
.setAliases(['wd'])
.setDescription('Kendi parana bakarsın')
.setUsage(['bank', 'b'])
.setCancelMessage(true)
.setPrivate(false)
const registration3 = new CommandBuilder()
.setName('warp-list')
.setAliases(['ws'])
.setDescription('Kendi parana bakarsın')
.setUsage(['bank', 'b'])
.setCancelMessage(true)
.setPrivate(false)
const registration4 = new CommandBuilder()
.setName('warp-del')
.setAliases(['wl'])
.setDescription('Kendi parana bakarsın')
.setUsage(['bank', 'b'])
.setCancelMessage(true)
.setPrivate(false)
var commandPrefix = 't/';

world.events.beforeChat.subscribe(msg => {
    if (msg.message.startsWith(commandPrefix)) {
        let args_ = msg.message.slice(commandPrefix.length).trim().split(' ');
        let cmd = args_.shift().toLowerCase();
        var args = args_.join('_').toLowerCase();
        let player = msg.sender.name;
        msg.cancel = true;
        if (commandPrefix.includes(cmd) && args.length <= 0){
          world.getDimension("overworld").runCommand(`tellraw "${player}" { "rawtext": [ { "text": "§cCommand not found" } ] }`); 
          return
        }
        try { var getPlayerTag =  world.getDimension("overworld").runCommand(`tag "${msg.sender.name}" list`).statusMessage } catch(e) {}
        try { var warpName =  world.getDimension("overworld").runCommand(`testfor @e[type=tgm:warp]`).statusMessage } catch(e) { var warpName = '§l§4Error§4!§r'}
        let playerX = Math.trunc(msg.sender.location.x);
        let playerY = Math.trunc(msg.sender.location.y);
        let playerZ = Math.trunc(msg.sender.location.z);
        switch (cmd) {
            case 'warp-add':
                if (msg.sender.hasTag("perm:Admin") == true) {
                    if (warpName.search(args) == -1) {
                        world.getDimension("overworld").runCommand(`execute "${player}" ~ ~ ~ summon tgm:warp ${args} ~ ~3 ~` );
                        world.getDimension("overworld").runCommand(`tellraw "${player}" { "rawtext": [ { "text": "§bWarp successfully created\n §aName §7: §e${args}§r\n §aLocation §7: §e${playerX}, ${playerY}, ${playerZ}" } ] }` );
                    } else {
                        world.getDimension("overworld").runCommand(`tellraw "${player}" { "rawtext": [ { "text": "§4Error! delete this warp >> t/warp-del <warp ismi>${args}" } ] }` );
                    }
                } else {
                    world.getDimension("overworld").runCommand(`tellraw "${player}" {"rawtext":[{"text":"§cYou are not authorized to use this command"}]}` );
                }
            break;
            case 'warp':
                    if (warpName.search(args) == -1) {
                        world.getDimension("overworld").runCommand(`tellraw "${player}" { "rawtext":[{"text": "§2Warp not found"}]}` );
                    } else {
                        world.getDimension("overworld").runCommand(`execute @e[type=tgm:warp,name=${args}] ~ ~ ~ tp "${player}" ~ ~ ~`);
                        world.getDimension("overworld").runCommand(`tellraw "${player}" {"rawtext":[{"text": "§aWarp §7: §5${args}"}]}` );
                    }
            break;
            case 'warp-del':
                if (msg.sender.hasTag("perm:Admin") == true) {
                    if (warpName.search(args) == -1) {
                        world.getDimension("overworld").runCommand(`tellraw "${player}" { "rawtext": [ { "text": "§cWarp not found" } ] }` );
                    } else {
                        world.getDimension("overworld").runCommand(`kill @e[type=tgm:warp,name=${args}]` );
                        world.getDimension("overworld").runCommand(`tellraw "${player}" { "rawtext": [ { "text": "§bWarp successfully removed\n §aName §7: §e${args}§r" } ] }` );
                    }
                } else {
                    world.getDimension("overworld").runCommand(`tellraw "${player}" {"rawtext":[{"text":"§cYou are not authorized to use this command!"}]}` );
                }
            break;
            case 'warp-list':
                    world.getDimension("overworld").runCommand(`tellraw "${player}" {"rawtext":[{"text":"${warpName.replace(/found /i,"§2Warp list§2>>\n §7- §a").replace(/, /g,"§r\n §7- §a")}"}]}` );
            break;
            default:
                console.log("normal message")
        }
    }
});

CommandHandler.register(registration1, (interaction) => {
  console.log("ok")
})
CommandHandler.register(registration2, (interaction) => {
  console.log("ok")
})
CommandHandler.register(registration3, (interaction) => {
  console.log("ok")
})
CommandHandler.register(registration4, (interaction) => {
  console.log("ok")
})