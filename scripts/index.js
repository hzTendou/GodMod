import { Dimension, EntityQueryOptions, world, Entity, BlockLocation, Items, ItemStack } from "@minecraft/server"
import './classes/manager/EventEmitter.js'
import './commands/import.js'
import "./plugins/kit.js"
import "./plugins/shop.js"
import "./plugins/chest.js"
import "./plugins/crate.js"
import "./plugins/money.js"
import { customChatRanks, customNameRanks } from "./plugins/functions.js"
import { ActionFormData, ModalFormData, MessageFormData } from "@minecraft/server-ui"
function onWorldLoad(callback) {
  let TickCallback = world.events.tick.subscribe((tickEvent) => {
    try {
      world.getDimension("overworld").runCommand(`testfor @a`);
      world.events.tick.unsubscribe(TickCallback);
      callback();
    } catch (error) {}
  });
}

onWorldLoad(() => {
  world.getDimension("overworld").runCommand(`scoreboard objectives add money dummy`)
  world.getDimension("overworld").runCommand(`scoreboard objectives add bank dummy`)
  world.getDimension("overworld").runCommand(`scoreboard objectives add player.health dummy`)
  world.getDimension("overworld").runCommand(`scoreboard objectives add player.sneaking dummy`)
  world.getDimension("overworld").runCommand(`scoreboard objectives add player.kill dummy`)
  world.getDimension("overworld").runCommand(`scoreboard objectives add player.death dummy`)
  world.getDimension("overworld").runCommand(`scoreboard objectives add chestGuiWarp dummy`)
  world.getDimension("overworld").runCommand(`scoreboard objectives add chestGuiMarket dummy`)
  world.getDimension("overworld").runCommand(`execute @r ~~~ summon tgm:database`)
  world.getDimension("overworld").runCommand(`execute @r ~~~ summon tgm:db`)
  world.getDimension("overworld").runCommand(`tag @e[type=tgm:database] add database`)
  world.getDimension("overworld").runCommand(`tag @e[type=tgm:db] add "DB_System"`)
  world.getDimension("overworld").runCommand(`say everything created`)
})

function getEntitysItemName(entity) {
  try {
    const cmd = entity.runCommand("testfor @s");
    return cmd.victim[0];
  } catch (error) {
    return entity.getComponent("item").itemStack.typeId;
  }
}
world.events.entityCreate.subscribe(({ entity }) => {
  if (entity.typeId != "minecraft:item") return;
  const ItemStack = entity.getComponent("item").itemStack;
  entity.nameTag = `§8${ItemStack.amount}x §3${getEntitysItemName(entity)}`;
});

function hasItem(player, item, amount, data = 0){
  let msg = player.runCommand(`testfor @s[hasitem={item=${item}, quantity=${amount}, data=${data}}]`).statusMessage
  if(msg.includes(player.name)){
      return true
  } else {
    return false
  }
}
export function setTickInterval(callback, tick) {
  new tickTimeout(callback, tick, true);
}
function getMarketEntity(player){
    for(let entity of ow.getEntities()){
      if(entity.typeId = "tgm:chestuimarket"){
        if(entity.nameTag.includes(player.name)){
          return entity
        }
      }
    }
}
class tickTimeout {
  constructor(callback, tick, loop = false) {
    this.tickDelay = tick;
    this.callbackTick = 0;
    this.loop = loop;

    let TickCallBack = world.events.tick.subscribe((data) => {
      if (this.callbackTick == 0) {
        this.callbackTick = data.currentTick + this.tickDelay;
      }
      try {
        if (this.callbackTick <= data.currentTick) {
          callback();
          if (this.loop) {
            this.callbackTick = data.currentTick + this.tickDelay;
          } else {
            world.events.tick.unsubscribe(TickCallBack);
          }
        }
      } catch (error) {
        console.warn(`${error} : ${error.stack}`);
      }
    });
  }
}
function getDatabase() {
  for(let entity of ow.getEntities()){
      if(entity.typeId == "tgm:database"){
          return entity;
      }
  }
}
function getPlayers() {
  let players = world.getPlayers()
  let plist = ""
  for(let player of players){
    plist = plist + "-" + player.name
  }
  let plarr = plist.split("-")
  return plarr;
  }
  function getPlayersCount() {
    let players = world.getPlayers()
    let plist = ""
    for(let player of players){
      plist = plist + "-" + player.name
    }
    let plarr = plist.split("-")
    return plarr.length -1;
    }

function getRank(player){
  if(player.hasTag("ranked")){
 for(const tag of player.getTags()){
   if(tag.startsWith("rank:")){
    let tagr = tag.replace("rank:", "")
    return tagr;
   } 
 }
} else {
  let rank = "§bMember"
  return rank;
}
}
world.events.tick.subscribe((data) => {
  for(let player of world.getPlayers()){
  if (player.hasTag("old")) return
  ow.runCommand(`replaceitem entity @a slot.hotbar 8 minecraft:compass 1 5 {"minecraft:item_lock":{"mode":"lock_in_inventory"}, "minecraft:keep_on_death":{}}`)  
  ow.runCommand(`replaceitem entity @a slot.hotbar 7 minecraft:paper 1 2322 {"minecraft:item_lock":{"mode":"lock_in_inventory"}, "minecraft:keep_on_death":{}}`)
  ow.runCommand(`replaceitem entity @a slot.hotbar 6 minecraft:blaze_rod 1 3131 {"minecraft:item_lock":{"mode":"lock_in_inventory"}, "minecraft:keep_on_death":{}}`)
     player.addTag("old");
  }
})

function getScore(entity, objective) {
  try {
    const command = entity.runCommand(`scoreboard players test @s "${objective}" * *`)
    return parseInt(String(command.statusMessage?.split(" ")[1]), 10);
  } catch (error) {
    return 0;
  }
}
function getWarps() {
  let entitys = ow.getEntities()
  let elist = ""
  for(let entity of entitys){
    if(entity.typeId == "tgm:warp"){
    elist = elist + "-" + entity.nameTag
   }
  }
  let earr = elist.split("-")
  return earr;
}
function getTeamPlayers(teamname) {
  let entitys = ow.getEntities()
  let x = 0
  let earr = []
  for(const entity of entitys){
    x++
  if(entity.hasTag(`team:${teamname}`)) {
    earr[x] = entity.nameTag
  }
  }
  return earr;
  }
function getTeam(player){
  if(player?.typeId == "minecraft:player"){
  if(player.hasTag("teamed")){
 for(const tag of player.getTags()){
   if(tag.startsWith("team:")){
    let tagr = tag.replace("team:", "")
    return tagr;
   } 
 }
} else {
  let rank = "§8TEAMLESS"
  return rank;
}
  }
}
let ow = world.getDimension("overworld")
function sendMsg(player, msg) {
 ow.runCommand(`tellraw "${player.name}" {"rawtext":[{"text":"${msg}"}]}`)
}
world.events.beforeChat.subscribe(data => {
  if (data.sender.hasTag("muted") == false) {
    if (data.message.startsWith("t/")) {
      data.cancel = true
    }
    else {
      customChatRanks(data)
    }
  }
  else {
    data.cancel = true
    data.sender.runCommand(`tellraw @s {"rawtext":[{"text":"<Server> §4You are muted!"}]}`)
  }
})
world.events.entityHit.subscribe(data => {
  if(data.hitBlock) return;
  if(data.hitEntity){
  for (const npctag of data.hitEntity.getTags()) {
    if (npctag.startsWith("command:")) {
      const ntsp = npctag.split(":")
      data.entity.runCommand(ntsp[1])
    }
  }
}
})
world.events.beforeItemUse.subscribe(data => {
  var playerc = data.source
  if(data.item.typeId == "minecraft:compass" && data.item.data == 5) {
    let compassmenu = new ActionFormData()
    .title(`§cTeleport Compass`)
    .button("§2Lobby\n§8[Click me]", "textures/items/compass_item.png")
    .button("§2TPA\n§8[Click me]", "textures/ui/dressing_room_customization.png")
    .button("§2Home\n§8[Click me]", "textures/ui/icon_recipe_item.png")
    .button("§2Island\n§8[Click me]", "textures/ui/enable_editor.png")
    .button("§2Fix the Warp Menu\n§8[Click me]", "textures/ui/icon_iron_pickaxe.png")
    compassmenu.show(playerc).then(res => {
      if(res.selection == 0){
        try {
            playerc.runCommand(`tp @s @e[type=tgm:hub]`)
            playerc.runCommand(`tellraw @s {"rawtext":[{"text":"§2You are teleported lobby!"}]}`)
        } catch (e) {
          playerc.runCommand(`tellraw @s {"rawtext":[{"text":"§4Lobby not found!"}]}`)
        
        }
      }

      if(res.selection == 1){
        try{
          let players = getPlayers()
        let tpa = new ModalFormData()
        .title("§cTPA Menu")
       .textField(`Enter Player ${players}`,`Player Name`);
        tpa.show(playerc).then(res => {
          for(let playert of world.getPlayers()){
            if(playert.name == res.formValues[0]){
              let tpaacui = new ModalFormData()
              .title("§cTpa Request")
              .toggle(`${playerc.name} want to teleport you`,true)
              tpaacui.show(playert).then(res => {
                if(res.formValues[0] == true){
                  ow.runCommand(`tp "${playerc.name}" "${playert.name}"`)
                }
                if(res.formValues[0] == false){
                  sendMsg(playerc.name, "<Server> §5Player decline your tpa request")
                }
              })
            }
          }
        })
      } catch(e) {
        ow.runCommand(`say ${e} ${e.stack}`)
      }
      }

      if(res.selection == 2){
        var homeCoords = false;
        playerc.getTags().forEach(tag => {
          if (tag.includes("home: ")) {
            homeCoords = tag.replace("home: ", "");
          }
        })
        if (!homeCoords) {
          ow.runCommand(`tellraw "${playerc.name}" {"rawtext":[{"text":"§4You don't have a house, first create a house >> t/set-home"}]}`);
        } else {
          ow.runCommand(`tellraw "${playerc.name}" {"rawtext":[{"text":"§2You've been teleported home! location >> ${Math.trunc(homeCoords)}"}]}`);
          ow.runCommand(`tp "${playerc.name}" ${homeCoords}`);
        }
      }
      if(res.selection == 3) {
        let p = playerc
        let homeX = Math.floor(Math.random() * 500000)
        let homeY = Math.floor(Math.random() * 100) + 120;
        let homeZ = Math.floor(Math.random() * 500000) 
        let px = p.location.x
        let py = p.location.y
        let pz = p.location.z
        if(p.hasTag(`area-::`)){
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
        } else {
          p.runCommand(`tp @s ${homeX} ${homeY} ${homeZ}`)
          p.runCommand(`structure load mystructure:skyisland ~~~`)
          p.runCommand(`tp @s ${px} ${py} ${pz}`)
          p.runCommand(`tellraw @s {"rawtext":[{"text":"<Server> §2Your island created\n§cCordinate >> ${homeX + 2} ${homeY + 4} ${homeZ + 2}"}]}`)
          p.runCommand(`tag @s add "area:--${homeX + 2} ${homeY + 4} ${homeZ + 2}"`)
          p.runCommand(`tag @s add "area-::"`)
        }
      }
      if(res.selection == 4) {
        for(let entity of ow.getEntities()){
          if(entity.typeId == "tgm:chestuiwarp"){
            let p = playerc
            let px = p.location.x
            let py = p.location.y
            let pz = p.location.z
            let namep1 = entity.nameTag
            let namep2 = namep1.split("-")
            let name = namep2[1]
            if(playerc.nameTag.includes(name)){
              entity.runCommand(`tp @s 9999999 9999999 9999999`)
              entity.kill()
              let namep = playerc.nameTag.split("§")
              let name = namep[5].substring("1")
              ow.runCommand(`summon tgm:chestuiwarp "§l§9Warp Menu §8[-${name}-]" ${px} ${py} ${pz}`)
            }
          }
        }
      }

    })
  }
})

world.events.beforeChat.subscribe(data => {
  data.message
})

world.events.beforeItemUse.subscribe(data => {
  let playerd = data.source

  const { item, source } = data
  if (item.typeId == "minecraft:paper" && item.data == 2322) {
    var playermenu = new ActionFormData()
      .title("§cPlayer Menu")
      .body("§9What do you want to do?")
      .button(`§2Profile \n§8[Click me]`, "textures/ui/gamerpic.png")
      .button(`§2Team\n§8[Click me]`, "textures/ui/FriendsIcon.png")
      .button("§2Home Settings\n§8[Click me]", "textures/ui/icon_recipe_item.png")
      .button("§2Money Transactions\n§8[Click me]", "textures/ui/icon_minecoin_9x9.png")
      .button(`§2Admin Menu\n§8[Click me]`, "textures/ui/op.png");

    playermenu.show(playerd).then(res => {
      if (res.selection == 0){
      let scores = playerd.runCommand(`scoreboard players list @s`).statusMessage
      let rank = getRank(playerd)
      let ss = playerd.isSneaking
      let team = getTeam(playerd)
      
      var profilemenu = new ActionFormData()
      .title("§cYour profile")
      .body(`§cName >> ${playerd.name} \n§4Rank >> ${rank}\n§aTeam >> ${team}\n§3Sneaking >> ${ss}\n§eScores >> \n${scores}`)
      .button("Tendou-sama");
      profilemenu.show(playerd).then(res => {
        console.warn("okke")
      })
      }
    if(res.selection == 1) {
      let teammenu = new ActionFormData()
      .title("§cTeam Settings")
      .body("§9Select a option")
      .button("§2Create Team\n§8[Click me]", "textures/blocks/crafting_table_top.png")
      .button("§2Join Team\n§8[Click me]", "textures/ui/arrow_dark_right_stretch.png")
      .button("§2Leave Team\n§8[Click me]", "textures/ui/arrow_dark_left_stretch.png")
      teammenu.show(playerd).then(res => {
        if(res.selection == 0){
          if(playerd.hasTag("teamed")){
            sendMsg(playerd.name, "<Server> §4You have team!")
          } else {
          let tcmenu = new ModalFormData()
          .title("§cCreate Team")
          .textField("§2Team Name", "Enter")
          .slider("§2Player Limit", 4, 16, 4);
          tcmenu.show(playerd).then(res => {
            for(const entity of ow.getEntities()){
              if(entity.hasTag(`teams:${res.formValues[0]}`) == false){
              if(entity.hasTag("database")){
           ow.runCommand(`tag @e[type=tgm:database] add "teamstat:-${res.formValues[0]}-${res.formValues[1]}-${playerd.name}"`)
           playerd.runCommand(`tag @s add "team:${res.formValues[0]}"`)
           ow.runCommand(`tag @e[type=tgm:database] add "teams:${res.formValues[0]}"`)
           playerd.runCommand(`tag @s add teamed`)
           sendMsg(playerd.name, "<Server> §2Team created!")
              }
            } else {
              sendMsg(playerd.name, "<Server> §2There is a team by this name!")
            }
          }
          })
        }
        }
        
        if(res.selection == 1){
          if(playerd.hasTag("teamed")){
            sendMsg(playerd.name, "<Server> §4You have team!")
          } else {
          let jtmenu = new ModalFormData()
          .title("§cJoin Team")
          .textField("§2Team Name", "Enter");
          jtmenu.show(playerd).then(res => {
              for(const entity of ow.getEntities()){
                if(entity.hasTag("database")){
                if(entity.hasTag(`teams:${res.formValues[0]}`)){
                  playerd.addTag(`team:${res.formValues[0]}`)
                  playerd.addTag(`teamed`)
                  sendMsg(playerd.name, "<Server> §2You joined team!")
                } else {
                  sendMsg(playerd.name, "<Server> §4Theres is no such team!")
                }
              }
              }
          })
        }
        }

        if(res.selection == 2){
          if(playerd.hasTag("teamed") == false){
            sendMsg(playerd.name, "<Server> §4You haven't team!")
          } else {
          let jtmenu = new ModalFormData()
          .title("§cLeave Team")
          .textField("§2Team Name", "Enter");
          jtmenu.show(playerd).then(res => {
              for(const entity of ow.getEntities()){
                if(entity.hasTag("database")){
                if(entity.hasTag(`teams:${res.formValues[0]}`)){
                  if(playerd.hasTag(`team:${res.formValues[0]}`)){
                  playerd.runCommand(`tag @s remove team:${res.formValues[0]}`)
                  playerd.runCommand(`tag @s remove teamed`)
                  } else {
                    sendMsg(playerd.name, "<Server> §4You are not from this team!")
                  }

                } else {
                  sendMsg(playerd.name, "<Server> §4Theres is no such team!")
                }
              }
              }

          })
        }
        }

      })
    

  }
  
   if(res.selection == 2) {
     let homesetting = new ActionFormData()
     .title("§cHome Settings")
     .body(`§9Select Option`)
     .button("§cSet Home\n§8[Click me]", "textures/ui/check.png")
     .button(`§4Reset Home\n§8[Click me]`, "textures/ui/realms_red_x.png");
     homesetting.show(playerd).then(res => {
       if(res.selection == 0){
        var home = playerd.location.x + " " + playerd.location.y + " " + playerd.location.z
        playerd.getTags().forEach(tag => {
          if (tag.includes("home: ")) {
            playerd.removeTag(tag)
          }
        })
        playerd.addTag(`home: ${home}`)
        ow.runCommand(`tellraw "${playerd.name}" {"rawtext":[{"text":"§2home point determined >> ${home}!"}]}`)
       }
       if(res.selection == 1){
        playerd.getTags().forEach(tag => {
          if (tag.includes("home: ")) {
            playerd.removeTag(tag)
            playerd.runCommand(`title @s actionbar §4Home Point Reset`)
          }
        })
       }
     })
   }
   if(res.selection == 3){
    var menu = new ActionFormData()
    .title("§cMoney Transactions")
    .body("§9Select Option")
    .button("§2Send Money\n§8[Click me]", "textures/ui/send_icon.png")
    .button("§2Deposit Money\n§8[Click me]", "textures/ui/download_backup.png")
    .button("§2Withdraw Money\n§8[Click me]", "textures/ui/upload_glyph.png")

    menu.show(playerd).then(response => {
      try {
      if (response.selection == 0) {
        let players = getPlayers()
        var pg = new ModalFormData()
        .title("§cSend Money")
       .textField(`Enter Player ${players}`,`Player Name`)
        .slider("§2Amount", 100, 10000, 100);
  
        pg.show(playerd).then(response => {
              for(const player of world.getPlayers()){
                if(player.name == response.formValues[0]){
               let money = getScore(playerd, "money")
               if(money >= response.formValues[1]){
                player.runCommand(`scoreboard players add @s money ${response.formValues[1]}`)
               } else {
                sendMsg(playerd, "<Server> §4Your money is insufficient")
               }
                }
              }          
        })
      }
      if (response.selection == 1) {
        var py = new ModalFormData()
        .title("§cDeposit Money")
        .slider("§2Amount", 100, 10000, 100);
  
        py.show(playerd).then(response => {
            for(const player of world.getPlayers()){
              if(player.nameTag == playerd.nameTag){
             let money = getScore(playerd, "money")
             if(money >= response.formValues[0]){
              playerd.runCommand(`scoreboard players add @s bank ${response.formValues[0]}`)
              playerd.runCommand(`scoreboard players remove @s money ${response.formValues[0]}`) 
             } else {
              sendMsg(playerd, "<Server> §4Your money is insufficient")
             }
              }
            } 
          
        })
      }
      if (response.selection == 2) {
        var py = new ModalFormData()
        .title("§cWithdraw Money")
        .slider("§2Amount", 100, 10000, 100);
  
        py.show(playerd).then(response => {
          for(const player of world.getPlayers()){
            if(player.nameTag == playerd.nameTag){
           let money = getScore(playerd, "money")
           if(money >= response.formValues[0]){
            playerd.runCommand(`scoreboard players remove @s bank ${response.formValues[0]}`)
            playerd.runCommand(`scoreboard players add @s money ${response.formValues[0]}`) 
           } else {
            sendMsg(playerd, "<Server> §4Your money is insufficient")
           }
            }
          } 
          
        })
      }
    } catch(e) {
      ow.runCommand(`say ${e} ${e.stack}`)
    }
  })  
   }
      if (res.selection == 4) {
        if (playerd.hasTag("perm:Admin")) {
          var adminmenu = new ActionFormData()
            .title("§cAdmin Menu")
            .body("§9What do you want to do?")
            .button("§2Ban Player \n§8[Click me]", "textures/blocks/barrier.png")
            .button("§2Mute Player \n§8[Click me]", "textures/ui/mute_on.png")
            .button("§2UnMute Player \n§8[Click me]", "textures/ui/mute_off.png")
            .button("§2Create Slapper \n§8[Click me]", "textures/blocks/crafting_table_top.png")
            .button("§2Hub Settings \n§8[Click me]", "textures/items/compass_item.png")
            .button("§2Shops\n§8[Click me]", "textures/ui/sidebar_icons/marketplace.png");

          adminmenu.show(playerd).then((response) => {
            if (response.selection == 0) {
              try {
                let players = getPlayers()
                var ban = new ModalFormData()
                  .title("§4Ban Player")
                 .textField(`Enter Player ${players}`,`Player Name`);
                ban.show(playerd).then((response) => {
                  for (const playerf of world.getPlayers()) {
                    console.warn(response.formValues[0])
                    if (response.formValues[0] == playerf.name) {
                      playerf.runCommand(`tag @s add banned`)
                      bans.set(playerf.name, "banned player")
                    }
                  }
                })
              } catch (e) {
                ow.runCommand(`say ${e}`)
              }
            }
            if (response.selection == 1) {
              try {
                let players = getPlayers()
                var mute = new ModalFormData()
                  .title("§4Mute Player")
                 .textField(`Enter Player ${players}`,`Player Name`);
                mute.show(playerd).then((response) => {
                  for (const playerf of world.getPlayers()) {
                    console.warn(response.formValues[0])
                    if (response.formValues[0] == playerf.name) {
                      playerf.runCommand(`tag @s add muted`)
                    }
                  }
                })
              } catch (e) {
                ow.runCommand(`say ${e}`)
              }
            }
            if (response.selection == 2) {
              try {
                let players = getPlayers()
                var mute = new ModalFormData()
                  .title("§2UnMute Player")
                 .textField(`Enter Player ${players}`,`Player Name`);
                mute.show(playerd).then((response) => {
                  for (const playerf of world.getPlayers()) {
                    console.warn(response.formValues[0])
                    if (response.formValues[0] == playerf.name) {
                      playerf.runCommand(`tag @s remove muted`)
                    }
                  }
                })
              } catch (e) {
                ow.runCommand(`say ${e}`)
              }
            }
            if (response.selection == 3) {
              try {
                var slapper = new ModalFormData()
                  .title("§cCreate Slapper")
                  .textField("§2Enter Slapper Name", "Slapper Name")
                  .textField("§2Enter Command", "Command")
                slapper.show(playerd).then((response) => {
                  playerd.runCommand(`summon zombie "${response.formValues[0]}" ~~~`)
                  playerd.runCommand(`tag @e[type=zombie, name="${response.formValues[0]}"] add "command:${response.formValues[1]}"`)
                })
              } catch (e) {
                ow.runCommand(`say ${e}`)
              }
            }
            if (response.selection == 4) {
              try {
                var hub = new ActionFormData()
                  .title("§cHub Settings")
                  .button("§2Set Hub", "textures/ui/check.png")
                  .button("§4Reset Hub", "textures/ui/realms_red_x.png")
                hub.show(playerd).then((response) => {
                  if (response.selection == 0) {
                    ow.runCommand(`execute "${playerd.name}" ~~~ summon tgm:hub ~~+2~`)
                    ow.runCommand(`tellraw "${playerd.name}" {"rawtext":[{"text":"§2Lobby point set"}]}`)
                  }
                  if (response.selection == 1) {
                    ow.runCommand(`kill @e[type=tgm:hub]`)
                    ow.runCommand(`tellraw "${playerd.name}" {"rawtext":[{"text":"§4Lobby point reset"}]}`)
                  }
                })
              } catch (e) {
                ow.runCommand(`say ${e}`)
              }
            }
            if(response.selection == 5){
              let shops = new ActionFormData()
              .title("§cShops")
              .button("§2Block Shop\n§8[Click me]", "textures/ui/mashup_world.png")
              .button("§2Tools Shop\n§8[Click me]", "textures/items/bucket_water.png")
              .button("§2Armor Shop\n§8[Click me]", "textures/items/diamond_chestplate.png");
              shops.show(playerd).then(res => {
                let db = getDatabase()
                let x = Math.trunc(playerd.location.x)
                let y = Math.trunc(playerd.location.y)
                let z = Math.trunc(playerd.location.z)
                if(res.selection == 0){
                world.getDimension("overworld").runCommand(`setblock ${x} ${y} ${z} trapped_chest`)
                let block = world.getDimension("overworld").getBlock(new BlockLocation(x, y, z))
                db.runCommand(`tag @s add "blockshop=${x};${y};${z}"`)
              }
              if(res.selection == 1){
                world.getDimension("overworld").runCommand(`setblock ${x} ${y} ${z} trapped_chest`)
                let block = world.getDimension("overworld").getBlock(new BlockLocation(x, y, z))
                db.runCommand(`tag @s add "toolshop=${x};${y};${z}"`)
              }
              if(res.selection == 2){
                world.getDimension("overworld").runCommand(`setblock ${x} ${y} ${z} trapped_chest`)
                let block = world.getDimension("overworld").getBlock(new BlockLocation(x, y, z))
                db.runCommand(`tag @s add "armorshop=${x};${y};${z}"`)
              }
              })
            }
          })
        }}
      })
    }
  })
var tick = 0
          world.events.tick.subscribe(data => {
            tick++
            customNameRanks(data)
          })

          world.events.tick.subscribe(data => {
            for (let player of world.getPlayers()) {
              player.runCommand(`scoreboard players add @s money 0`)
              player.runCommand(`scoreboard players add @s bank 0`)
              player.runCommand(`scoreboard players add @s chestGuiWarp 0`)
              
              let playersc = getPlayersCount()
              ow.runCommand(`scoreboard players set online database ${playersc}`)
              let phc = player.getComponent("health")
              player.runCommand(`scoreboard players set @s player.health ${Math.trunc(phc.current)}`)
              if (player.isSneaking == true) {
                player.runCommand(`scoreboard players set @s player.sneaking 1`)
              } else {
                player.runCommand(`scoreboard players set @s player.sneaking 0`)
              }
            }
          })
world.events.entityHit.subscribe(data => {
  if(data.hitEntity){
    let tagv = getTeam(data.entity)
    let tagvl = getTeam(data.hitEntity)
  if(tagv != "§8TEAMLESS" && tagvl != "§8TEAMLESS"){
    if(tagv == tagvl) {
      data.entity.runCommand(`tellraw @s {"rawtext":[{"text":"<Server> §2Don't attack your team friends!"}]}`)
    }
  }
  }
})

world.events.beforeItemUse.subscribe(data => {
   let hitEntity = data.source.getEntitiesFromViewVector()
    let tagv = getTeam(data.source)
    let tagvl = getTeam(hitEntity[0])
  if(tagv != "§8TEAMLESS" && tagvl != "§8TEAMLESS"){
    if(tagv == tagvl) {
      data.cancel = true
    }
  }
})
world.events.entityHit.subscribe(data => {
  let hl = data.hitEntity.getComponent("health").current
  if(0 >= hl){
    if(data.hitEntity.typeId == "minecraft:player"){
      data.entity.runCommand(`scoreboard players add @s player.kill 1`)
      data.hitEntity.runCommand(`scoreboard players add @s player.death 1`)
    }
  }
})
setTickInterval(() => {
  let db = getDatabase()
  let tags = db.getTags()
  for(let tag of tags){
    if(tag.startsWith("blockshop")){
      let blockloc = tag
      let loc = blockloc.replace("blockshop=", "").split(";")
      let shop = world.getDimension("overworld").getBlock(new BlockLocation(parseInt(loc[0]), parseInt(loc[1]), parseInt(loc[2])))
      let shopinvcomp = shop.getComponent("inventory")
      let inv = shopinvcomp.container
      let blocks = [
        {"name": "minecraft:grass", "amount": 32, "data": 0, "price": 200},
        {"name": "minecraft:mob_spawner", "amount": 1, "data": 0, "price": 5000},
        {"name": "minecraft:stone", "amount": 32, "data": 0, "price": 400},
        {"name": "minecraft:cobblestone", "amount": 32, "data": 0, "price": 400},
        {"name": "minecraft:basalt", "amount": 32, "data": 0, "price": 500},
        {"name": "minecraft:blackstone", "amount": 32, "data": 0, "price": 500},
        {"name": "minecraft:brick_block", "amount": 32, "data": 0, "price": 400},
        {"name": "minecraft:chest", "amount": 32, "data": 0, "price": 300},
        {"name": "minecraft:nether_brick", "amount": 32, "data": 0, "price": 400},
        {"name": "minecraft:concrete", "amount": 32, "data": 0, "price": 300},
        {"name": "minecraft:obsidian", "amount": 8, "data": 0, "price": 400},
        {"name": "minecraft:stonebrick", "amount": 32, "data": 0, "price": 300},
        {"name": "minecraft:prismarine", "amount": 32, "data": 0, "price": 300},
        {"name": "minecraft:red_nether_brick", "amount": 32, "data": 0, "price": 300},
        {"name": "minecraft:blackstone", "amount": 32, "data": 0, "price": 400},
        {"name": "minecraft:log", "amount": 32, "data": 0, "price": 200},
        {"name": "minecraft:log", "amount": 32, "data": 1, "price": 200},
        {"name": "minecraft:log", "amount": 32, "data": 2, "price": 200},
        {"name": "minecraft:log", "amount": 32, "data": 3, "price": 200},
        {"name": "minecraft:log2", "amount": 32, "data": 0, "price": 200},
        {"name": "minecraft:log2", "amount": 32, "data": 1, "price": 200},
        {"name": "minecraft:diamond_block", "amount": 1, "data": 0, "price": 1000},
        {"name": "minecraft:gold_block", "amount": 1, "data": 0, "price": 800},
        {"name": "minecraft:iron_block", "amount": 1, "data": 0, "price": 900},
        {"name": "minecraft:coal_block", "amount": 1, "data": 0, "price": 400},
        {"name": "minecraft:netherite_block", "amount": 1, "data": 0, "price": 1500},
        {"name": "minecraft:lapis_block", "amount": 1, "data": 0, "price": 400}    
      ] 
      for(let i=0; 27 > i; i++){  
        let item = new ItemStack(Items.get(blocks[i].name), blocks[i].amount, blocks[i].data)
        item.nameTag = `§2Shop\n§5Item >> ${blocks[i].name.replace("minecraft:", "")}\n§9Amount >> ${blocks[i].amount}\n§ePrice >> ${blocks[i].price}\n§8Data >> ${blocks[i].data}`
        inv.setItem(i, item)
      }
    }
  }
}, 20)

setTickInterval(() => {
  let db = getDatabase()
  let tags = db.getTags()
  for(let tag of tags){
    if(tag.startsWith("toolshop")){
      let blockloc = tag
      let loc = blockloc.replace("toolshop=", "").split(";")
      let shop = world.getDimension("overworld").getBlock(new BlockLocation(parseInt(loc[0]), parseInt(loc[1]), parseInt(loc[2])))
      let shopinvcomp = shop.getComponent("inventory")
      let inv = shopinvcomp.container
      let tools = [
        {"name": "minecraft:oak_sign", "amount": 16, "data": 0, "price": 200},
        {"name": "minecraft:bed", "amount": 1, "data": 14, "price": 200},
        {"name": "minecraft:beacon", "amount": 1, "data": 0, "price": 5000},
        {"name": "minecraft:oak_boat", "amount": 1, "data": 0, "price": 400},
        {"name": "minecraft:blaze_rod", "amount": 32, "data": 0, "price": 500},
        {"name": "minecraft:wheat_seeds", "amount": 32, "data": 0, "price": 300},
        {"name": "minecraft:ender_chest", "amount": 8, "data": 0, "price": 1000},
        {"name": "minecraft:ender_pearl", "amount": 16, "data": 0, "price": 600},
        {"name": "minecraft:shulker_box", "amount": 1, "data": 0, "price": 400},
        {"name": "minecraft:bamboo", "amount": 32, "data": 0, "price": 500},
        {"name": "minecraft:cactus", "amount": 32, "data": 0, "price": 400},
        {"name": "minecraft:redstone", "amount": 16, "data": 0, "price": 300},
        {"name": "minecraft:elytra", "amount": 1, "data": 0, "price": 5000},
        {"name": "minecraft:diamond_sword", "amount": 1, "data": 0, "price": 500},
        {"name": "minecraft:diamond_pickaxe", "amount": 1, "data": 0, "price": 600},
        {"name": "minecraft:diamond_axe", "amount": 1, "data": 0, "price": 600},
        {"name": "minecraft:golden_sword", "amount": 1, "data": 0, "price": 450},
        {"name": "minecraft:golden_pickaxe", "amount": 1, "data": 0, "price": 500},
        {"name": "minecraft:golden_axe", "amount": 1, "data": 0, "price": 500},
        {"name": "minecraft:iron_sword", "amount": 1, "data": 0, "price": 400},
        {"name": "minecraft:iron_pickaxe", "amount": 1, "data": 0, "price": 450},
        {"name": "minecraft:iron_axe", "amount": 1, "data": 0, "price": 450},
        {"name": "minecraft:stone_sword", "amount": 1, "data": 0, "price": 200},
        {"name": "minecraft:stone_pickaxe", "amount": 1, "data": 0, "price": 250},
        {"name": "minecraft:stone_axe", "amount": 1, "data": 0, "price": 250},
        {"name": "minecraft:hopper", "amount": 1, "data": 0, "price": 800},
        {"name": "minecraft:chest_minecart", "amount": 1, "data": 0, "price": 400}    
      ] 
      for(let i=0; 27 > i; i++){  
        let item = new ItemStack(Items.get(tools[i].name), tools[i].amount, tools[i].data)
        item.nameTag = `§2Shop\n§5Item >> ${tools[i].name.replace("minecraft:", "")}\n§9Amount >> ${tools[i].amount}\n§ePrice >> ${tools[i].price}\n§8Data >> ${tools[i].data}`
        inv.setItem(i, item)
      }
    }
  }
}, 20)


setTickInterval(() => {
  let db = getDatabase()
  let tags = db.getTags()
  for(let tag of tags){
    if(tag.startsWith("armorshop")){
      let blockloc = tag
      let loc = blockloc.replace("armorshop=", "").split(";")
      let shop = world.getDimension("overworld").getBlock(new BlockLocation(parseInt(loc[0]), parseInt(loc[1]), parseInt(loc[2])))
      let shopinvcomp = shop.getComponent("inventory")
      let inv = shopinvcomp.container
      let armor = [
        {"name": "minecraft:diamond_helmet", "amount": 1, "data": 0, "price": 400},
        {"name": "minecraft:diamond_chestplate", "amount": 1, "data": 0, "price": 600},
        {"name": "minecraft:diamond_leggings", "amount": 1, "data": 0, "price": 600},
        {"name": "minecraft:diamond_boots", "amount": 1, "data": 0, "price": 400},
        {"name": "minecraft:golden_helmet", "amount": 1, "data": 0, "price": 300},
        {"name": "minecraft:golden_chestplate", "amount": 1, "data": 0, "price": 500},
        {"name": "minecraft:golden_leggings", "amount": 1, "data": 0, "price": 500},
        {"name": "minecraft:golden_boots", "amount": 1, "data": 0, "price": 300},
        {"name": "minecraft:chainmail_helmet", "amount": 1, "data": 0, "price": 300},
        {"name": "minecraft:chainmail_chestplate", "amount": 1, "data": 0, "price": 400},
        {"name": "minecraft:chainmail_leggings", "amount": 1, "data": 0, "price": 400},
        {"name": "minecraft:chainmail_boots", "amount": 1, "data": 0, "price": 300},
        {"name": "minecraft:leather_helmet", "amount": 1, "data": 0, "price": 100},
        {"name": "minecraft:leather_chestplate", "amount": 1, "data": 0, "price": 200},
        {"name": "minecraft:leather_leggings", "amount": 1, "data": 0, "price": 200},
        {"name": "minecraft:leather_leggings", "amount": 1, "data": 0, "price": 100},
        {"name": "minecraft:diamond_horse_armor", "amount": 1, "data": 0, "price": 200},
        {"name": "minecraft:golden_horse_armor", "amount": 1, "data": 0, "price": 200},
        {"name": "minecraft:iron_horse_armor", "amount": 1, "data": 0, "price": 200},
        {"name": "minecraft:leather_horse_armor", "amount": 1, "data": 0, "price": 200},
        {"name": "minecraft:armor_stand", "amount": 1, "data": 0, "price": 200},
        {"name": "minecraft:arrow", "amount": 16, "data": 25, "price": 1500},
        {"name": "minecraft:arrow", "amount": 32, "data": 0, "price": 300},
        {"name": "minecraft:arrow", "amount": 16, "data": 26, "price": 800},
        {"name": "minecraft:arrow", "amount": 16, "data": 35, "price": 400},
        {"name": "minecraft:arrow", "amount": 16, "data": 37, "price": 1500},
        {"name": "minecraft:bow", "amount": 1, "data": 0, "price": 400}    
      ] 
      for(let i=0; 27 > i; i++){  
        let item = new ItemStack(Items.get(armor[i].name), armor[i].amount, armor[i].data)
        item.nameTag = `§2Shop\n§5Item >> ${armor[i].name.replace("minecraft:", "")}\n§9Amount >> ${armor[i].amount}\n§ePrice >> ${armor[i].price}\n§8Data >> ${armor[i].data}`
        inv.setItem(i, item)
      }
    }
  }
}, 20)

setTickInterval(() => {
for(let player of world.getPlayers()){
  let inc = player.getComponent("minecraft:inventory")
  let inv = inc.container
  function air(i, player) {
    if(i > 27){
      player.runCommand(`replaceitem entity @s slot.hotbar ${i - 28} air`)
    } else {
      player.runCommand(`replaceitem entity @s slot.hotbar ${i} air`)
    }
  }
    for(let x=0; inv.size > x; x++){
      let i = x
        let item = inv.getItem(i)
        try {
        if(item.typeId != "minecraft:air"){
        let name = item.nameTag
        if(name.startsWith("§2Shop")){
          let args = name.split("\n")
          console.warn(args)
            let item_namec = args[1]
            let item_amountc = args[2]
            let item_datac = args[4]
            let item_pricec = args[3]
            let item_name = item_namec.split(" >> ")
            let item_amount = item_amountc.split(" >> ")
            let item_data =  item_datac.split(" >>")
            let item_price = item_pricec.split(" >> ")
            let money = getScore(player, "money")
            if(money >= parseInt(item_price[1])){
              player.runCommand(`scoreboard players remove @s money ${item_price[1]}`)
              let shopitem = new ItemStack(Items.get(item_name[1]), parseInt(item_amount[1]), parseInt(item_data[1]))
              air(i, player)
              inv.setItem(i, shopitem)
            } else {
              air(i, player)
            }
        }



        if(name.startsWith("§l§3Warp")){
          let args = name.split("\n")
          console.warn(args)
            let warp_namep = args[1]
            let warp_locationp = args[2]
            let warp_name = warp_namep.split(" >> ")
            let warp_location = warp_locationp.split(" >> ")
              player.runCommand(`tp @s ${warp_location[1]}`)
              player.runCommand(`tellraw @s {"rawtext":[{"text":"<Server> §l§2You teleported to ${warp_name[1]}"}]}`)
              air(i, player)
        }
      }
    } catch (e) {
      console.log(`${e} ${e.stack}`)
    }
    }
  }
}, 7)
setTickInterval(() => {
  try {
for(let player of world.getPlayers()){
  let x = player.location.x
  let y = player.location.y
  let z = player.location.z
      let count = getScore(player, 'chestGuiWarp')
      console.log(count)
      if(count <= 0){
        ow.runCommand(`summon tgm:chestuiwarp "§l§9Warp Menu §8[-${player.name}-]" ${x} ${y} ${z}`)
        ow.runCommand(`scoreboard players set "${player.name}" chestGuiWarp 1`)
      }
}
  } catch(e) {
    ow.runCommand(`say ${e}`)
  }
}, 2)
setTickInterval(() => {
 for(let entity of ow.getEntities()){
   if(entity.typeId == 'tgm:chestuiwarp'){
     let namep1 = entity.nameTag
     let namep2 = namep1.split("-")
     let name = namep2[1]
     for(let player of world.getPlayers()){
       if(player.name == name){
         let inv = player.getComponent('minecraft:inventory')
         let slot = inv.container
         let item = slot.getItem(player.selectedSlot)
         if(item?.typeId == 'minecraft:blaze_rod' && item?.data == 3131){
           player.runCommand(`execute @s ~~~ tp @e[type=tgm:chestuiwarp, name="${entity.nameTag}"] ^^1.35^0.5`)
         } else {
           player.runCommand(`execute @s ~~~ tp @e[type=tgm:chestuiwarp, name="${entity.nameTag}"] ^^10^`)
         }
       }
     }
   }
 }
}, 2)

setTickInterval(() => {
 try {
 for(let player of world.getPlayers()){
     let name = player.name
     for(let entity of ow.getEntities()){
       if(entity?.typeId == "tgm:chestuiwarp"){
       if(entity.nameTag.includes(player.name)) {
         let i = 0
         let entityinv = entity.getComponent('inventory')
         let slot = entityinv.container
         for(let entityw of ow.getEntities()){
           
          if(entityw.typeId == "tgm:warp"){
           let name = entityw.nameTag
           let x = entityw.location.x
           let y = entityw.location.y
           let z = entityw.location.z
           let item = new ItemStack(Items.get("minecraft:paper"), 1, 333)
           item.nameTag = `§l§3Warp\n§2Name >> ${name}\n§4Location >> ${Math.trunc(x)} ${Math.trunc(y)} ${Math.trunc(z)}`
           slot.setItem(i, item)    
           i++        
          }
         }
       }
     }
     }
 } 
} catch(e) {
 ow.runCommand(`say ${e} ${e.stack}`)
}
}, 4)
