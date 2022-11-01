import { world } from "@minecraft/server";
import CommandBuilder from "../classes/builders/CommandBuilder.js";
import CommandHandler from "../classes/CommandRegistration.js"

const registration1 = new CommandBuilder()
.setName('island')
.setAliases(['w'])
.setDescription('Kendi parana bakarsın')
.setUsage(['bank', 'b'])
.setCancelMessage(true)
.setPrivate(false)
const registration2 = new CommandBuilder()
.setName('island-create')
.setAliases(['wd'])
.setDescription('Kendi parana bakarsın')
.setUsage(['bank', 'b'])
.setCancelMessage(true)
.setPrivate(false)
const registration4 = new CommandBuilder()
.setName('island-del')
.setAliases(['wl'])
.setDescription('Kendi parana bakarsın')
.setUsage(['bank', 'b'])
.setCancelMessage(true)
.setPrivate(false)
var commandPrefix = 't/';

world.events.beforeChat.subscribe(msg => {
    if (msg.message.startsWith(commandPrefix)) {
      
        var args = msg.message.split(" ")
        var cmd = args[0]
        var p = msg.sender
        let homeX = Math.floor(Math.random() * 500000)
        let homeY = Math.floor(Math.random() * 100) + 120;
        let homeZ = Math.floor(Math.random() * 500000) 
        let px = p.location.x
        let py = p.location.y
        let pz = p.location.z
        let ptags = p.getTags()
        switch (cmd) {
            case 't/island-create':
              if(p.hasTag(`area-::`)){
                p.runCommand(`tellraw @s {"rawtext":[{"text":"<Server> §4You already own a island!"}]}`)
              } else {
                p.runCommand(`tp @s ${homeX} ${homeY} ${homeZ}`)
                p.runCommand(`structure load mystructure:skyisland ~~~`)
                p.runCommand(`tp @s ${px} ${py} ${pz}`)
                p.runCommand(`tellraw @s {"rawtext":[{"text":"<Server> §2Your island created\n§cCordinate >> ${homeX + 2} ${homeY + 4} ${homeZ + 2}"}]}`)
                p.runCommand(`tag @s add "area:--${homeX + 2} ${homeY + 4} ${homeZ + 2}"`)
                p.runCommand(`tag @s add "area-::"`)
              }
                break
            case 't/island':
                   let tags 
                    tags = p.getTags()
                    let tag 
            for(var x=0; x <= tags.length; x++){
              tag = tags[x]
              const ts = tag.split("--")
                if(ts[0] == `area:`){              
                    p.runCommand(`tp @s ${ts[1]}`)
                    
                }
            }
            break
            case 't/island-del':
              let tags2d
              tags2d = p.getTags()
              for(var x=0; x <= tags2d.length; x++){
                  if(tags2d[x].startsWith(`area:--`)){
                      p.runCommand(`tag @s remove "${tags2d[x]}"`)
                      p.runCommand(`tag @s remove "area-::"`)
                      p.runCommand(`tellraw @s {"rawtext":[{"text":"<Server> §2Your island has been deleted"}]}`)
                    
                  }
              }
              break
            default:
                console.log("normal message")
        }
    }
});

CommandHandler.register(registration1, (interaction) => {
  console.warn("ok")
})
CommandHandler.register(registration2, (interaction) => {
  console.warn("ok")
})
CommandHandler.register(registration4, (interaction) => {
  console.warn("ok")
})
