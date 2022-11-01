//here is for v9
import { world } from "@minecraft/server"
import { ModalFormData, ActionFormData } from "@minecraft/server-ui"
let ow = world.getDimension("overworld")
function getPlayers() {
  let players = world.getPlayers()
  let plist = ""
  for(let player of players){
    plist = plist + "-" + player.name
  }
  let plarr = plist.split("-")
  return plarr;
  }

  function getScore(entity, objective) {
    try {
      const command = entity.runCommand(`scoreboard players test @s "${objective}" * *`)
      return parseInt(String(command.statusMessage?.split(" ")[1]), 10);
    } catch (error) {
      return 0;
    }
  }

function getDatabase() {
    for(let entity of ow.getEntities()){
        if(entity.typeId == "tgm:database"){
            return entity;
            break;
        }
    }
}
function getRandomItem(items){
     let allitems = items.split("-")
     let number = Math.floor(Math.random() * allitems.length)
     let item = allitems[number]
     return item;
}
function getCrate(x, y, z){
  let entity = getDatabase()
  let tags = entity.getTags()
  for(let tag of tags){
    if(tag.startsWith(`(${x}:${y}:${z})crate=`)){
     let tagr = tag.replace(`(${x}:${y}:${z})crate=`, '')
     let args = tagr.split(`:`)
     return args;
     break;
    }
  }
} 
world.events.beforeItemUseOn.subscribe(data => {
    let entity = getDatabase()
    if(data.item.typeId == "minecraft:stick" && data.item.data == 1001){
    let player = data.source
    let block = player.getBlockFromViewVector()
    let x = block.location.x
    let y = block.location.y
    let z = block.location.z
    if(player.hasTag(`chest=${x}:${y}:${z}`)) {
        if(player.hasTag(`shops=${x}:${y}:${z}`) == false){
            if(entity.hasTag(`crates=${x}:${y}:${z}`) == false){
              data.cancel = true
            let crate = new ModalFormData()
            .title("§2Crate Menu")
            .textField("<item name>=<item amount> (ex: armor_stand=12-stone=65-diamond=31-diamond_sword=1 )\n\nItems Name", "Name")
            .textField("Crate Opening Price (price of one opening)", "Number");
            crate.show(player).then(res => {
                    if(entity.typeId == "tgm:database"){
                        entity.addTag(`(${x}:${y}:${z})crate=${res.formValues[0]}:${res.formValues[1]}:tendou`)
                        entity.addTag(`crates=${x}:${y}:${z}`)
                }
            })
        }
        }
    }
    }
})

world.events.beforeItemUseOn.subscribe(data => {
    let player = data.source
    let entity = getDatabase()
    let item = data.item
    let block = data.source.getBlockFromViewVector()
       if(block.typeId == "minecraft:chest"){
          let x = block.location.x
          let y = block.location.y
          let z = block.location.z
          
          if(entity.hasTag(`crates=${x}:${y}:${z}`)){
            data.cancel = true
            let crate = getCrate(x, y, z)
            let tpaacui = new ModalFormData()
              .title("§cCrate Request")
              .toggle(`§9Are you sure for spin?\n§4Price >> ${crate[1]}\n§2Items >> ${crate[0].replaceAll(`-`," ")}`,true)
              tpaacui.show(player).then(res => {
                if(res.formValues[0] == true){
                  try {
                  let money = getScore(player, "money")
                  console.warn(x, y, z)
                  console.warn(money)
                  let price = parseInt(crate[1])
                     if(money >= price){
                      let crate = getCrate(x, y, z)
                      console.log("naber11")
                      player.runCommand(`scoreboard players remove @s money ${crate[1]}`)
                      let item = getRandomItem(crate[0]).split("=")
                      console.log(item)
                      player.runCommand(`give @s ${item[0]} ${item[1]}`)
                      console.log("naber11")
                     }
                    } catch (e) {
                      ow.runCommand(`say ${e} ${e.stack}`)
                    }
                }
              })
          
          }
       } 
      
})