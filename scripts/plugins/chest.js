import { world, MinecraftBlockTypes, BlockLocation, Items, ItemStack } from "@minecraft/server"
import { ActionFormData, ModalFormData, MessageFormData } from "@minecraft/server-ui"
let ow = world.getDimension("overworld")
function getPlayers() {
  let players = world.getPlayers()
  let plist = "Select:"
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
        }
    }
}
world.events.blockPlace.subscribe(data => {
  if(data.block.typeId == "minecraft:chest") {
    data.player.addTag(`chest=${data.block.location.x}:${data.block.location.y}:${data.block.location.z}`)
  }
})
world.events.beforeItemUseOn.subscribe(data => {
  let db = getDatabase()
    let player = data.source
    let hitBlock = data.source.getBlockFromViewVector()
    if(hitBlock.typeId == "minecraft:chest"){
    let x = hitBlock.location.x
      let y = hitBlock.location.y
      let z = hitBlock.location.z
      if(data.source.isSneaking == false){
      if(data.source.hasTag(`chest=${x}:${y}:${z}`)) return;
      else {
        data.cancel = true
      }
     } 
     else {
      if(db.hasTag(`crates=${x}:${y}:${z}`) == false) {
        for(const entity of ow.getEntities()){
            if(entity.typeId == "tgm:database"){
                data.cancel = true
        if(data.source.hasTag(`chest=${x}:${y}:${z}`)) {
          if(entity.hasTag(`crate=${x}:${y}:${z}`) == false){
            if(entity.hasTag(`shops=${x}:${y}:${z}`) == false){
            let cshopui = new ModalFormData()
            .title("§2ChestShop Menu")
            .textField("Item Name (ex: minecraft:armor_stand)", "Name")
            .textField("Item Price (price of one)", "Number")
            .textField("Item Data (Optional)", "Number", "0");
            cshopui.show(player).then(res => {
                ow.runCommand(`tag @e[type=tgm:database] add "shops=${x}:${y}:${z}"`)
                player.runCommand(`tag @e add "shops=${x}:${y}:${z}"`)
                ow.runCommand(`tag @e[type=tgm:database] add "(${x}:${y}:${z})shop=${res.formValues[0]}:${res.formValues[1]}:${res.formValues[2]}:${player.name}:tendou"`)
            })
        }
      }
    }
      else {
        data.cancel = true
        if(entity.hasTag(`shops=${x}:${y}:${z}`)){
        for(let tag of entity.getTags()){
            if(tag.startsWith(`(${x}:${y}:${z})shop=`)){
                let shop = tag.replace(`(${x}:${y}:${z})shop=`, "")
                let shopv = shop.split(":")
                let onlineplayers = getPlayers()
                if(onlineplayers.includes(shopv[3])){
                let shopui = new ModalFormData()
                .title(`§c${shopv[3]}'s Shop`)
                .textField(`§2Item Name >> ${shopv[0]}\n§ePrice of one >> ${shopv[1]}\n§9Enter Amount`,"number","1");
                shopui.show(player).then(res => {
                    let money = getScore(player, "money")
                    let price = shopv[1]*res.formValues[0]
                    if(money >= price){
                        let inventoryComponent = hitBlock.getComponent("inventory")
                        let inv = inventoryComponent.container
                        for(let x=0; inv.size > x; x++){
                            let slot = inv.getItem(x)
                            let amt = parseInt(res.formValues[0])
                            let data = parseInt(shopv[2])
                            if(slot.typeId == shopv[0] && slot.amount >= amt && slot.data == data){
                                player.runCommand(`scoreboard players remove @s money ${price}`)
                                player.runCommand(`give @s ${shopv[0]} ${res.formValues[0]} ${shopv[2]}`)
                                let newamt = slot.amount - amt
                                if(newamt != 0) {
                                inv.setItem(x, new ItemStack(Items.get(shopv[0]), newamt, data))
                            } else {
                                 inv.setItem(x, new ItemStack(Items.get("minecraft:air")))
                                }
                                break;
                            }
                        }
                }
                })
              }
              else {
                let shopwarn = new ActionFormData()
                .title("§cWarn")
                .body(`§9Sorry, ${shopv[4]}, the owner of the market, is not in the game at the moment.`)
                .button("ok");
                shopwarn.show(player).then(res => { return; })
              }
            }
        }
        }
    
      }
     }

    }

  }

}
}
})

world.events.blockBreak.subscribe(data => {
  let x = data.block.location.x
  let y = data.block.location.y
  let z = data.block.location.z
  for(let entity of ow.getEntities()){
    for(let tag of entity.getTags()){
      if(tag.startsWith(`chest=${x}:${y}:${z}`)){
        entity.removeTag(tag)
      }
      if(tag.startsWith(`(${x}:${y}:${z})shop=`)){
        entity.removeTag(tag)
      }
      if(tag.startsWith(`shops=${x}:${y}:${z}`)){
        entity.removeTag(tag)
      }
      if(tag.startsWith(`crates=${x}:${y}:${z}`)){
        entity.removeTag(tag)
      }
    }
  }
})

world.events.tick.subscribe(data => {
  for(let player of world.getPlayers()){
    let block = player.getBlockFromViewVector()
    if(block){
    if(block.typeId == "minecraft:chest"){
    let x = block.location.x
    let z = block.location.z
    let y = block.location.y
    if(player.hasTag(`perm:Admin`) == false){
      if(player.hasTag(`chest=${x}:${y}:${z}`)){
        return;
      }
      else {
        player.runCommand(`effect @s mining_fatigue 1 255 true`)
      }
    } 
  }
}
  }
})