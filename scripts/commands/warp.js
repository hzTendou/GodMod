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
var commandPrefix = '!';
function getWarps() {
    let entitys = world.getDimension("overworld").getEntities()
    let elist = ""
    for(let entity of entitys){
     for(let tag )
     }
    }
    let earr = elist.split("-")
    return earr;
  }
world.beforeEvents.chatSend.subscribe(msg => {
    if (msg.message.startsWith(commandPrefix)) {
        let args_ = msg.message.slice(commandPrefix.length).trim().split(' ');
        let cmd = args_.shift().toLowerCase();
        let args = args_.join('_').toLowerCase();
        let player = msg.sender.nameTag;
        msg.cancel = true;
        if (commandPrefix.includes(cmd) && args.length <= 0){
          world.getDimension("overworld").runCommandAsync(`tellraw "${player}" { "rawtext": [ { "text": "§cCommand not found" } ] }`); 
          return
        }
        let warpName = getWarps()
        let playerX = Math.trunc(msg.sender.location.x);
        let playerY = Math.trunc(msg.sender.location.y);
        let playerZ = Math.trunc(msg.sender.location.z);
        console.warn(warpName[1])
        switch (cmd) {
            case 'warp':
                    if (warpName.includes(args) == false) {
                        world.getDimension("overworld").runCommandAsync(`tellraw "${player}" { "rawtext":[{"text": "§2Warp not found"}]}` );
                    } else {
                        world.getDimension("overworld").runCommandAsync(`execute as @e[type=tgm:warp,name=${args}] run tp "${player}" ~ ~ ~`);
                        world.getDimension("overworld").runCommandAsync(`tellraw "${player}" {"rawtext":[{"text": "§aWarp §7: §5${args}"}]}` );
                    }
                    break;
            case 'warp-list':
                    world.getDimension("overworld").runCommandAsync(`tellraw "${player}" {"rawtext":[{"text":"${warpName}"}]}` );
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
})
CommandHandler.register(registration4, (interaction) => {
  console.log("ok")
})