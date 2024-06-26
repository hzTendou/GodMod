import { world, ItemStack,system, EntityComponentTypes, ItemLockMode, EquipmentSlot, BlockComponentTypes, ItemTypes } from "@minecraft/server"
import { ActionFormData, ModalFormData } from "@minecraft/server-ui"
import { Vec3 } from "./utils/vec3.d.js";
import "./plugins/area.js"
 import './classes/manager/EventEmitter.js'
 import './commands/import.js'
//import "./plugins/crate.js"
import "./plugins/kit.js"
import "./plugins/shop.js"
import "./plugins/chest.js"
import "./plugins/money.js"
import { customChatRanks, customNameRanks } from "./plugins/functions.js"
world.beforeEvents.chatSend.subscribe(data => {
  if (data.sender.hasTag("muted") == false) {
    if (data.message.startsWith("!")) {
      data.cancel = true
    } 
    else {
      customChatRanks(data)
    }
  }
  else {
    data.cancel = true
    data.sender.runCommandAsync(`tellraw @s {"rawtext":[{"text":"<Server> §4You are muted!"}]}`)
  }
})
system.runInterval(data =>{
  customNameRanks(data)
})
function onWorldLoad(callback) {
  let TickCallback = system.runInterval((tickEvent) => {
    try {
      world.getDimension("overworld").runCommandAsync(`testfor @a`);
      world.events.tick.unsubscribe(TickCallback);
      callback();
    } catch (error) {}
  });
}
world.afterEvents.worldInitialize.subscribe(() => {
  world.getDimension("overworld").runCommandAsync(`scoreboard objectives add money dummy`)
  world.getDimension("overworld").runCommandAsync(`scoreboard objectives add bank dummy`)
  world.getDimension("overworld").runCommandAsync(`scoreboard objectives add player.health dummy`)
  world.getDimension("overworld").runCommandAsync(`scoreboard objectives add player.sneaking dummy`)
  world.getDimension("overworld").runCommandAsync(`scoreboard objectives add player.kill dummy`)
  world.getDimension("overworld").runCommandAsync(`scoreboard objectives add player.death dummy`)
  world.getDimension("overworld").runCommandAsync(`say everything created`)
})

function getEntitysItemName(entity) {
  try {
    const cmd = entity.runCommandAsync("testfor @s");
    return cmd.victim[0];
  } catch (error) {
    return entity.getComponent("item").itemStack.typeId.replace("minecraft:","")
  }
}
world.afterEvents.entitySpawn.subscribe(({ entity }) => {
  if (entity.typeId != "minecraft:item") return;
  const ItemStack = entity.getComponent("item").itemStack;
  entity.nameTag = `§8${ItemStack.amount}x §3${getEntitysItemName(entity)}`;
});

function hasItem(player, item, amount, data = 0){
  let msg = player.runCommandAsync(`testfor @s[hasitem={item=${item}, quantity=${amount}, data=${data}}]`).statusMessage
  if(msg.includes(player.name)){
      return true
  } else {
    return false
  }
}
function getDatabase() {
  for(let entity of ow.getEntities()){
      if(entity.typeId == "tgm:database"){
          return entity;
      }
  }
}
function getCScount(){
  let x=0
  for(let tag of getDatabase().getTags()){
    if(tag.startsWith("shops=")){
      x++;
    }
  }
  return x;
}
function getWarpcount(){
  let x=0
  for(let tag of getDatabase().getTags()){
    if(tag.includes("warps=")){
      x++;
    }
  }
  return x;
}
function getCS(x, y, z){
  let tagSh
  for(let tag of getDatabase().getTags()){
   if(tag.startsWith(`(${x}:${y}:${z})shop=`)){
    tagSh = tag.replace(`(${x}:${y}:${z})shop=`,"")
   }
  }
  return tagSh
}
function getStockofCS(x, y, z, item){
  let block = world.getDimension(`overworld`).getBlock(Vec3(x,y,z))
  let inv = block.getComponent(BlockComponentTypes.Inventory).container
  let stock=0
  for(let x=0; inv.size > x; x++){
    let itemi = inv.getItem(x)
    if(itemi?.typeId == "minecraft:" + item){
      stock = stock+itemi.amount
    }
  }
  return stock;
}
function isPlayerOnline(plname){
  let x = 0
    for(let player of world.getAllPlayers()){
      if(player.name == plname){
        x++; 
      }
    }
    if(x==1){
      return true;
    } else {
      return false;
    }
  }
export function setTickInterval(callback, tick) {
  new tickTimeout(callback, tick, true);
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
system.runInterval(data => {
  for(let player of world.getPlayers()){
  if (player.hasTag("old")) return
    let inv = player.getComponent("inventory").container
    let item1 = new ItemStack("minecraft:compass", 1)
    item1.keepOnDeath = true
    item1.lockMode = ItemLockMode.slot
    item1.nameTag = `§c§lTeleport Compass\n§f[Hold on/Right click]`
    inv.setItem(8, item1)
    let item2 = new ItemStack("minecraft:paper", 1)
    item2.keepOnDeath = true
    item2.lockMode = ItemLockMode.slot
    item2.nameTag = `§c§lPlayer Menu\n§f[Hold on/Right click]`
    inv.setItem(7, item2)
  player.addTag("old");
  }
})

function getScore(entity, objective) {
  try {
    return world.scoreboard.getObjective(objective).getScore(entity) 
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
 // if(player?.typeId == "minecraft:player"){
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
 // }
}
let ow = world.getDimension("overworld")
function sendMsg(player, msg) {
 ow.runCommandAsync(`tellraw "${player.name}" {"rawtext":[{"text":"${msg}"}]}`)
}
world.afterEvents.entityHitEntity.subscribe(data => {
  if(data.hitEntity){
  for (const npctag of data.hitEntity.getTags()) {
    if (npctag.startsWith("command:")) {
      const ntsp = npctag.split(":")
      data.damagingEntity.runCommandAsync(ntsp[1])
    }
  }
}
})
world.beforeEvents.playerInteractWithEntity.subscribe(data => {
  if(data.player.hasTag("teamed") && data.target.hasTag("teamed")){
    let team1 = getTeam(data.player)
    let team2 = getTeam(data.target)
    if(team1 == team2){
      data.cancel = true
    }
  }
})
world.afterEvents.itemUse.subscribe(data => {
  var playerc = data.source
  if(data.itemStack.typeId == "minecraft:compass" && data.itemStack?.nameTag == `§c§lTeleport Compass\n§f[Hold on/Right click]`) {
    let compassmenu = new ActionFormData()
    .title(`§cTeleport Compass`)
    .button("§2Lobby\n§8[Click me]", "textures/items/compass_item.png")
    .button("§2TPA\n§8[Click me]", "textures/ui/dressing_room_customization.png")
    .button("§2Home\n§8[Click me]", "textures/ui/icon_recipe_item.png")
    .button("§2Island\n§8[Click me]", "textures/ui/enable_editor.png")
    compassmenu.show(playerc).then(res => {
      if(res.selection == 0){
        try {
            playerc.runCommandAsync(`tp @s @e[type=tgm:hub]`)
            playerc.runCommandAsync(`tellraw @s {"rawtext":[{"text":"§2You are teleported lobby!"}]}`)
        } catch (e) {
          playerc.runCommandAsync(`tellraw @s {"rawtext":[{"text":"§4Lobby not found!"}]}`)
        
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
                  ow.runCommandAsync(`tp "${playerc.name}" "${playert.name}"`)
                }
                if(res.formValues[0] == false){
                  sendMsg(playerc.name, "<Server> §5Player decline your tpa request")
                }
              })
            }
          }
        })
      } catch(e) {
        ow.runCommandAsync(`say ${e} ${e.stack}`)
      }
      }
      if(res.selection == 2){
        var homeCoords = "";
        playerc.getTags().forEach(tag => {
          if (tag.includes("home: ")) {
            homeCoords = tag.replace("home: ", "");
          }
        })
        if (!homeCoords) {
          ow.runCommandAsync(`tellraw "${playerc.name}" {"rawtext":[{"text":"§4You don't have a house, first create a house >> !set-home"}]}`);
        } else {
          ow.runCommandAsync(`tellraw "${playerc.name}" {"rawtext":[{"text":"§2You've been teleported home! location >> ${homeCoords}"}]}`);
          ow.runCommandAsync(`tp "${playerc.name}" ${homeCoords}`);
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
                  p.runCommandAsync(`tp @s ${ts[1]}`)
                  
              }
       }
        } else {
          p.runCommandAsync(`tp @s ${homeX} ${homeY} ${homeZ}`)
          p.runCommandAsync(`structure load mystructure:skyisland ~~~`)
          p.runCommandAsync(`tp @s ${px} ${py} ${pz}`)
          p.runCommandAsync(`tellraw @s {"rawtext":[{"text":"<Server> §2Your island created\n§cCordinate >> ${homeX + 2} ${homeY + 4} ${homeZ + 2}"}]}`)
          p.runCommandAsync(`tag @s add "area:--${homeX + 2} ${homeY + 4} ${homeZ + 2}"`)
          p.runCommandAsync(`tag @s add "area-::"`)
        }
      }

    })
  }
})

world.afterEvents.itemUse.subscribe(data => {
  let playerd = data.source

  const { itemStack, source } = data
  if (data.itemStack.typeId == "minecraft:paper" && data.itemStack?.nameTag == `§c§lPlayer Menu\n§f[Hold on/Right click]`) {
    var playermenu = new ActionFormData()
      .title("§cPlayer Menu")
      .body("§9What do you want to do?")
      .button(`§2Profile \n§8[Click me]`, "textures/ui/gamerpic.png")
      .button(`§2Team\n§8[Click me]`, "textures/ui/FriendsIcon.png")
      .button("§2Home Settings\n§8[Click me]", "textures/ui/icon_recipe_item.png")
      .button("§2Money Transactions\n§8[Click me]", "textures/ui/icon_minecoin_9x9.png")
      .button("§2Buy area\n§8[Click me]", "textures/ui/enable_editor.png")
      .button(`§2Admin Menu\n§8[Click me]`, "textures/ui/op.png")

    playermenu.show(playerd).then(res => {
      if (res.selection == 0){
      let rank = getRank(playerd)
      let team = getTeam(playerd)
      
      var profilemenu = new ActionFormData()
      .title("§cYour profile")
      .body(`§cName >> ${playerd.name} \n§4Rank >> ${rank}\n§aTeam >> ${team}\n§2Money >> ${getScore(playerd, "money")} \n§2Bank account >> ${getScore(playerd, "bank")}`)
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
           ow.runCommandAsync(`tag @e[type=tgm:database] add "teamstat:-${res.formValues[0]}-${res.formValues[1]}-${playerd.name}"`)
           playerd.runCommandAsync(`tag @s add "team:${res.formValues[0]}"`)
           ow.runCommandAsync(`tag @e[type=tgm:database] add "teams:${res.formValues[0]}"`)
           playerd.runCommandAsync(`tag @s add teamed`)
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
                  playerd.runCommandAsync(`tag @s remove team:${res.formValues[0]}`)
                  playerd.runCommandAsync(`tag @s remove teamed`)
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
        ow.runCommandAsync(`tellraw "${playerd.name}" {"rawtext":[{"text":"§2home point determined >> ${home}!"}]}`)
       }
       if(res.selection == 1){
        playerd.getTags().forEach(tag => {
          if (tag.includes("home: ")) {
            playerd.removeTag(tag)
            playerd.runCommandAsync(`title @s actionbar §4Home Point Reset`)
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
                player.runCommandAsync(`scoreboard players add @s money ${response.formValues[1]}`)
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
              playerd.runCommandAsync(`scoreboard players add @s bank ${response.formValues[0]}`)
              playerd.runCommandAsync(`scoreboard players remove @s money ${response.formValues[0]}`) 
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
            playerd.runCommandAsync(`scoreboard players remove @s bank ${response.formValues[0]}`)
            playerd.runCommandAsync(`scoreboard players add @s money ${response.formValues[0]}`) 
           } else {
            sendMsg(playerd, "<Server> §4Your money is insufficient")
           }
            }
          } 
          
        })
      }
    } catch(e) {
      ow.runCommandAsync(`say ${e} ${e.stack}`)
    }
  })  
   }
   if(res.selection == 4){
    var areamenu = new ActionFormData()
    .title("§cArea Buying Menu")
    .body("§9Area price is calculating for per blok in selected area\nPrice for per block >> 100")
    .button("Start the selection")
    areamenu.show(playerd).then(res => {
      playerd.sendMessage("§eSelection is starteds, right click for select")
      playerd.addTag("dbJob:selection")
    })
   }
      if (res.selection == 5) {
        if (playerd.hasTag("perm:Admin")) {
          var adminmenu = new ActionFormData()
            .title("§cAdmin Menu")
            .body("§9What do you want to do?")
            .button("§2Ban Player \n§8[Click me]", "textures/blocks/barrier.png")
            .button("§2Mute Player\n§8[Click me]", "textures/ui/mute_on.png")
            .button("§2Unmute Player \n§8[Click me]", "textures/ui/mute_off.png")
            .button("§2Create Slapper \n§8[Click me]", "textures/blocks/crafting_table_top.png")
            .button("§2Hub Settings \n§8[Click me]", "textures/items/compass_item.png")
            .button("§2Warp Settings \n§8[Click me]", "textures/items/compass_item.png")
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
                      playerf.runCommandAsync(`tag @s add banned`)
                      
                    }
                  }
                })
              } catch (e) {
                ow.runCommandAsync(`say ${e}`)
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
                      playerf.runCommandAsync(`tag @s add muted`)
                    }
                  }
                })
              } catch (e) {
                ow.runCommandAsync(`say ${e}`)
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
                      playerf.runCommandAsync(`tag @s remove muted`)
                    }
                  }
                })
              } catch (e) {
                ow.runCommandAsync(`say ${e}`)
              }
            }
            if (response.selection == 3) {
              try {
                var slapper = new ModalFormData()
                  .title("§cCreate Slapper")
                  .textField("§2Enter Slapper Name", "Slapper Name")
                  .textField("§2Enter a skin index", "skin index (1,2,3)", "1")
                  .textField("§2Enter Command", "Command")
                slapper.show(playerd).then((response) => {
                  playerd.runCommandAsync(`summon tgm:slapper${response.formValues[1]} "${response.formValues[0]}" ~~~`)
                  playerd.runCommandAsync(`tag @e[type=tgm:slapper${response.formValues[1]}, name="${response.formValues[0]}"] add "command:${response.formValues[2]}"`)
                })
              } catch (e) {
                ow.runCommandAsync(`say ${e}`)
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
                    playerd.runCommandAsync(`summon tgm:hub ~~+2~`)
                    ow.runCommandAsync(`tellraw "${playerd.name}" {"rawtext":[{"text":"§2Lobby point set"}]}`)
                  }
                  if (response.selection == 1) {
                    ow.runCommandAsync(`kill @e[type=tgm:hub]`)
                    ow.runCommandAsync(`tellraw "${playerd.name}" {"rawtext":[{"text":"§4Lobby point reset"}]}`)
                  }
                })
              } catch (e) {
                ow.runCommandAsync(`say ${e}`)
              }
            }
            if (response.selection == 5) {
              try {
                var warp = new ActionFormData()
                  .title("§cWarp Settings")
                  .button("§2Add Warp", "textures/ui/check.png")
                  .button("§4Remove Warp", "textures/ui/realms_red_x.png")
                warp.show(playerd).then((response) => {
                  if (response.selection == 0) {
                    var addwarp = new ModalFormData()
                    .title("§cAdd Warp")
                    .textField("§2Warp name", "enter a name")
                    addwarp.show(playerd).then((response) => {
                      getDatabase()?.addTag(`(${getWarpcount()})warps=${Math.trunc(playerd.location.x)}:${Math.trunc(playerd.location.y)}:${Math.trunc(playerd.location.z)}:${response.formValues[0]}`)
                    })
                  }
                  if (response.selection == 1) {
                    var addwarp = new ModalFormData()
                    .title("§cAdd Warp")
                    .textField("§2Warp name", "enter a name")
                    addwarp.show(playerd).then((response) => {
                      for(let tag of getDatabase().getTags()){
                        if(tag.includes(`${response.formValues[0]}`)){
                          getDatabase().removeTag(tag)
                        }
                      }
                    })
                  }
                })
              } catch (e) {
                ow.runCommandAsync(`say ${e}`)
              }
            }


            if(response.selection == 6){
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
                  playerd.runCommandAsync(`summon tgm:slapper4 "§l§2Blocks" ~~~`)
                  playerd.runCommandAsync(`tag @e[r=1, type=tgm:slapper4] add slapper:blocks`)
                  playerd.runCommandAsync(`tp @e[r=1, type=tgm:slapper4] @s`)
              }
              if(res.selection == 1){
                playerd.runCommandAsync(`summon tgm:slapper5 "§l§5Tools" ~~~`)
                playerd.runCommandAsync(`tag @e[r=1, type=tgm:slapper5] add slapper:tools`)
                playerd.runCommandAsync(`tp @e[r=1, type=tgm:slapper5] @s`)
              }
              if(res.selection == 2){
                playerd.runCommandAsync(`summon tgm:slapper6 "§l§4Armors" ~~~`)
                playerd.runCommandAsync(`tag @e[r=1, type=tgm:slapper6] add slapper:armor`)
                playerd.runCommandAsync(`tp @e[r=1, type=tgm:slapper6] @s`)
              }
              })
            }

          })

        }
      }
      })
    }
  })
var tick = 0
 
          system.runInterval(data => {
            for (let player of world.getPlayers()) {
              player.runCommandAsync(`scoreboard players add @s money 0`)
              player.runCommandAsync(`scoreboard players add @s bank 0`)
              
              let playersc = getPlayersCount()
              ow.runCommandAsync(`scoreboard players set online database ${playersc}`)
              let phc = player.getComponent(EntityComponentTypes.Health)
              player.runCommandAsync(`scoreboard players set @s player.healt ${Math.trunc(phc.currentValue)}`)
              if (player.isSneaking == true) {
                player.runCommandAsync(`scoreboard players set @s player.sneaking 1`)
              } else {
                player.runCommandAsync(`scoreboard players set @s player.sneaking 0`)
              }
            }
          })
world.afterEvents.entityHitEntity.subscribe(data => {
  if(data.hitBlock) return
  if(data.hitEntity){
    let tagv = getTeam(data.damagingEntity)
    let tagvl = getTeam(data.hitEntity)
  if(tagv != "§8TEAMLESS" && tagvl != "§8TEAMLESS"){
    if(tagv == tagvl) {
      data.damagingEntity.runCommandAsync(`tellraw @s {"rawtext":[{"text":"<Server> §2Don't attack your team friends!"}]}`)
    }
  }
  }

})

world.afterEvents.entityHitEntity.subscribe(data => {
  let hl = data.hitEntity.getComponent("health").current
  if(0 >= hl){
    if(data.hitEntity.typeId == "minecraft:player"){
      data.entity.runCommandAsync(`scoreboard players add @s player.kill 1`)
      data.hitEntity.runCommandAsync(`scoreboard players add @s player.death 1`)
    }
  }
})
system.runInterval(() => {
  let db = getDatabase()
  for(let entity of world.getDimension("overworld").getEntities()){
    if(entity.typeId == "tgm:slapper4" && entity.hasTag("slapper:blocks")){
      let shopinvcomp = entity.getComponent("inventory")
      let inv = shopinvcomp.container
      let blocks = [
        {"name": "minecraft:grass_block", "amount": 32, "data": 0, "price": 200},
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
        {"name": "minecraft:oak_log", "amount": 32, "data": 0, "price": 200},
        {"name": "minecraft:birch_log", "amount": 32, "data": 1, "price": 200},
        {"name": "minecraft:dark_oak_log", "amount": 32, "data": 2, "price": 200},
        {"name": "minecraft:jungle_log", "amount": 32, "data": 3, "price": 200},
        {"name": "minecraft:mangrove_log", "amount": 32, "data": 0, "price": 200},
        {"name": "minecraft:cherry_log", "amount": 32, "data": 1, "price": 200},
        {"name": "minecraft:diamond_block", "amount": 1, "data": 0, "price": 1000},
        {"name": "minecraft:gold_block", "amount": 1, "data": 0, "price": 800},
        {"name": "minecraft:iron_block", "amount": 1, "data": 0, "price": 900},
        {"name": "minecraft:coal_block", "amount": 1, "data": 0, "price": 400},
        {"name": "minecraft:netherite_block", "amount": 1, "data": 0, "price": 1500},
        {"name": "minecraft:lapis_block", "amount": 1, "data": 0, "price": 400}    
      ] 
      for(let i=0; 27 > i; i++){  
        let item = new ItemStack(blocks[i].name, blocks[i].amount)
        item.nameTag = `§2Shop\n§5Item >> ${blocks[i].name.replace("minecraft:", "")}\n§9Amount >> ${blocks[i].amount}\n§ePrice >> ${blocks[i].price}`
        item.lockMode = ItemLockMode.inventory
        inv.setItem(i, item)
      }
    }
  }
}, 120)

system.runInterval(() => {
  let db = getDatabase()
  for(let entity of world.getDimension("overworld").getEntities()){
    if(entity.typeId == "tgm:slapper5" && entity.hasTag("slapper:tools")){
      let shopinvcomp = entity.getComponent("inventory")
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
        let item = new ItemStack(tools[i].name, tools[i].amount)
        item.nameTag = `§2Shop\n§5Item >> ${tools[i].name.replace("minecraft:", "")}\n§9Amount >> ${tools[i].amount}\n§ePrice >> ${tools[i].price}`
        item.lockMode = ItemLockMode.inventory
        inv.setItem(i, item)
      }
    }
  }
}, 120)


system.runInterval(() => {
  let db = getDatabase()
  for(let entity of world.getDimension("overworld").getEntities()){
    if(entity.typeId == "tgm:slapper6" && entity.hasTag("slapper:armor")){
      let shopinvcomp = entity.getComponent("inventory")
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
        {"name": "minecraft:shield", "amount": 1, "data": 0, "price": 1000},
        {"name": "minecraft:spyglass", "amount": 1, "data": 0, "price": 500},
        {"name": "minecraft:totem_of_undying", "amount": 1, "data": 0, "price": 3000},
        {"name": "minecraft:lead", "amount": 1, "data": 0, "price": 500},
        {"name": "minecraft:arrow", "amount": 32, "data": 0, "price": 300},
        {"name": "minecraft:bow", "amount": 1, "data": 0, "price": 400}    
      ] 
      for(let i=0; 27 > i; i++){  
        let item = new ItemStack(armor[i].name, armor[i].amount)
        item.nameTag = `§2Shop\n§5Item >> ${armor[i].name.replace("minecraft:", "")}\n§9Amount >> ${armor[i].amount}\n§ePrice >> ${armor[i].price}`
        item.lockMode = ItemLockMode.inventory
        inv.setItem(i, item)
      }
    }
  }
}, 120)
system.runInterval(() => {
  for(let tag of getDatabase().getTags()){
    if(tag.startsWith("shops=")){
      let tagrp = tag.replace("shops=","")
      let tagsp = tagrp.split(":")
      let block = world.getDimension("overworld").getBlock(Vec3(tagsp[0], tagsp[1], tagsp[2]))
      let inv = block.getComponent(BlockComponentTypes.Inventory).container
      let csdata = getCS(tagsp[0], tagsp[1], tagsp[2])
      let csParams = csdata.split(":")
      let csStock = getStockofCS(tagsp[0], tagsp[1], tagsp[2], csParams[0])
      let stack = csStock/64
      let stackr = Math.trunc(csStock/64)
      inv.clearAll()
      for(let x=0; inv.size  > x; x++){
        if(stack >= 1){
          inv.setItem(x, new ItemStack(csParams[0], 64))
          stack=stack-1
          if(stack < 1 && stack > 0){
          let lstack = csStock - (stackr*64)
          inv.setItem(x+1, new ItemStack(csParams[0], lstack))
          break;
          }
        } 
      }
    }
  }
},120)
system.runInterval(() => {
for(let player of world.getPlayers()){
  let inc = player.getComponent("minecraft:inventory")
  let inv = inc.container
  function air(i, player) {
    console.log(i)
    if(i == 9){
      player.runCommandAsync(`replaceitem entity @s slot.hotbar ${i - 9} air`)
    }
    else if(i > 9 && i > 35){
      player.runCommandAsync(`replaceitem entity @s slot.inventory ${i - 36} air`)
    } 
    else if(i > 9) {
      player.runCommandAsync(`replaceitem entity @s slot.inventory ${i} air`)
    }
     else {
      player.runCommandAsync(`replaceitem entity @s slot.hotbar ${i} air`)
    }
  }
    for(let x=0; 36 > x; x++){
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
            let item_pricec = args[3]
            let item_name = item_namec.split(" >> ")
            let item_amount = item_amountc.split(" >> ")
            let item_price = item_pricec.split(" >> ")
            let money = world.scoreboard.getObjective("money").getScore(player)
            if(money >= parseInt(item_price[1])){
              player.runCommandAsync(`scoreboard players remove @s money ${parseInt(item_price[1])}`)
              let shopitem = new ItemStack(String(item_name[1]), parseInt(item_amount[1]))
              inv.setItem(i)
              inv.setItem(i, shopitem)
            } else {
              inv.setItem(i)
            }
        }

      }
    } catch (e) {
      console.log(`${e} ${e.stack}`)
    }
    }
  }
},10)
system.runInterval(() => {
  for(let player of world.getPlayers()){
    let inc = player.getComponent("minecraft:inventory")
    let inv = inc.container
      for(let x=0; 36 > x; x++){
        let i = x
          let item = inv.getItem(i)
          try {
          if(item.typeId != "minecraft:air"){
          let name = item.nameTag
          if(name.startsWith("§2Warp")){
            let args = name.split("\n")
            console.warn(args)
              let item_namec = args[1]
              let item_locc = args[2]
              let item_name = item_namec.split(" >> ")
              let item_loc = item_locc.split(" >> ")
                inv.setItem(i)
                player.runCommandAsync(`tp @s ${item_loc[1].replaceAll(",", " ")}`)
          }
  
        }
      } catch (e) {
        console.log(`${e} ${e.stack}`)
      }
      }
    }
  },10)
system.runInterval(()=>{
  if(getCScount() == 0){
    for(let market of world.getDimension("overworld").getEntities()){
      if(market.typeId == "tgm:slapper4" && market.hasTag("slapper:market")){
       let inv = market.getComponent(EntityComponentTypes.Inventory).container
       for(let x=0; inv.size > x; x++){
         inv.setItem(x)
      }
     }}
   } else {
  for(let market of world.getDimension("overworld").getEntities()){
   if(market.typeId == "tgm:slapper4" && market.hasTag("slapper:market")){
    let inv = market.getComponent(EntityComponentTypes.Inventory).container
    for(let x=0; getCScount() > x; x++){
      for(let tag of getDatabase().getTags()){
        if(tag.startsWith("shops=")){
          let tagRP = tag.replace("shops=","")
          let tagSP = tagRP.split(":")
         let marketArgs = getCS(tagSP[0], tagSP[1], tagSP[2])
         let marketParms = marketArgs.split(":")
         let item = new ItemStack(marketParms[0])
         item.nameTag = `§2PublicMarket\n§5Item >> ${marketParms[0]}\n§9Amount >> ${marketParms[2]}\n§ePrice >> ${marketParms[1]}\nOwner >> ${marketParms[3]}\nStock >> ${getStockofCS(tagSP[0], tagSP[1], tagSP[2], marketParms[0])}\n§8Loc >> ${tagSP[0]},${tagSP[1]},${tagSP[2]}`
         inv.setItem(x, item)
         for(let market of world.getDimension("overworld").getEntities()){
          if(market.typeId == "tgm:chestuimarket"){
           let inv = market.getComponent(EntityComponentTypes.Inventory).container
           for(let x=getCScount(); inv.size > x; x++){
             inv.setItem(x)
          }
         }}
         x++
        }
      }
   }
  }}}
},20)

system.runInterval(() => {
for(let player of world.getPlayers()){
  let inc = player.getComponent("minecraft:inventory")
  let inv = inc.container

    for(let x=0; inv.size > x; x++){
      let i = x
        let item = inv.getItem(i)
        try {
        if(item.typeId != "minecraft:air"){
        let name = item.nameTag
        if(name.startsWith("§2PublicMarket")){
          let args = name.split("\n")
            let item_namec = args[1]
            let item_amountc = args[2]
            let item_pricec = args[3]
            let item_ownerc = args[4]
            let item_stockc = args[5]
            let item_locc = args[6]
            let item_name = item_namec.split(" >> ")
            let item_amount = item_amountc.split(" >> ")
            let item_price = item_pricec.split(" >> ")
            let item_owner = item_ownerc.split(" >> ")
            let item_stock = item_stockc.split(" >> ")
            let item_loc = item_locc.split(" >> ")
            let x = item_loc[1].split(",")[0]
            let y = item_loc[1].split(",")[1]
            let z = item_loc[1].split(",")[2]
            console.warn(item_name[1], item_amount[1], item_price[1], item_owner[1], item_stock[1], item_loc[1])
            let money = world.scoreboard.getObjective("money").getScore(player)
            if(money >= parseInt(item_price[1])){
              if(isPlayerOnline(item_owner[1]) == true){
                if(item_stock[1] > item_amount[1]){
              player.runCommandAsync(`scoreboard players remove @s money ${parseInt(item_price[1])}`)
              let shopitem = new ItemStack(String(item_name[1]), parseInt(item_amount[1]))
              inv.setItem(i)
              inv.setItem(i, shopitem)
              let block = world.getDimension(`overworld`).getBlock(Vec3(x,y,z))
              let inv2 = block.getComponent(BlockComponentTypes.Inventory).container
              for(let y=0; inv2.size > y; y++){
                let itemi = inv2.getItem(y)
                if(itemi?.typeId == "minecraft:" + item_name[1] && itemi?.amount >= item_amount[1]){
                  let count = itemi.amount - item_amount[1]
                  inv2.setItem(y, new ItemStack(itemi.typeId, count))
                  break
                }
              }
                } else {
                  player.sendMessage("§4§lThere's not enough stock")
                  inv.setItem(i)
                }
            } else {
              player.sendMessage("§4§lSeller is offline, you can't buy")
              inv.setItem(i)
            }
            } else {
              inv.setItem(i)
            }
        }

      }
    } catch (e) {
      console.log(`${e} ${e.stack}`)
    }
    }
  }
}, 10)

system.runInterval(() => {
  for(let market of world.getDimension("overworld").getEntities()){
   if(market.typeId == "tgm:slapper3" && market.hasTag("slapper:market")){
    let inv = market.getComponent(EntityComponentTypes.Inventory).container
    for(let x=0; getCScount() > x; x++){
      for(let tag of getDatabase().getTags()){
        if(tag.startsWith("shops=")){
          let tagRP = tag.replace("shops=","")
          let tagSP = tagRP.split(":")
         let marketArgs = getCS(tagSP[0], tagSP[1], tagSP[2])
         let marketParms = marketArgs.split(":")
         let item = new ItemStack(marketParms[0])
         item.nameTag = `§2PublicMarket\n§5Item >> ${marketParms[0]}\n§9Amount >> ${marketParms[2]}\n§ePrice >> ${marketParms[1]}\nOwner >> ${marketParms[3]}\nStock >> ${getStockofCS(tagSP[0], tagSP[1], tagSP[2], marketParms[0])}\n§8Loc >> ${tagSP[0]},${tagSP[1]},${tagSP[2]}`
         inv.setItem(x, item)
         for(let market of world.getDimension("overworld").getEntities()){
          if(market.typeId == "tgm:slapper3" && market.hasTag("slapper:market")){
           let inv = market.getComponent(EntityComponentTypes.Inventory).container
           for(let x=getCScount(); inv.size > x; x++){
             inv.setItem(x)
          }
         }}
         x++
        }
      }
   }
  }}
  },60)
  system.runInterval(() => {
    for(let market of world.getDimension("overworld").getEntities()){
     if(market?.nameTag == "§l§1Warps"){
      let inv = market.getComponent(EntityComponentTypes.Inventory).container
      for(let x=0; getWarpcount() > x; x++){
        for(let tag of getDatabase().getTags()){
          if(tag.startsWith(`(${x})warps=`)){
            let tagRP = tag.replace(`(${x})warps=`,"")
            let tagSP = tagRP.split(":")
           let item = new ItemStack("minecraft:compass")
           item.nameTag = `§2Warps\n§5Name >> ${tagSP[3]}\n§8Loc >> ${tagSP[0]},${tagSP[1]},${tagSP[2]}`
           inv.setItem(x, item)
             for(let i=getWarpcount(); inv.size > i; i++){
               inv.setItem(i)
            }
           }
          }
          }
        }
     }
    },60)
system.runInterval(() => {
  for(let pl of world.getPlayers()){
    if(getScore(pl, "bank") >= 100){
      world.scoreboard.getObjective("bank").addScore(pl, Math.trunc((getScore(pl, "bank") / 100) * 3))
    }
  }
},6000)
