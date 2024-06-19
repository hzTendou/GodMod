import { world, ItemStack, system, PlayerInteractWithBlockAfterEvent, Block, BlockComponent, BlockComponentTypes } from "@minecraft/server"
import { ActionFormData, MessageFormData, ModalFormData } from "@minecraft/server-ui"
import { Vec3 } from "../utils/vec3.d"
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
      const command = entity.runCommandAsync(`scoreboard players test @s "${objective}" * *`)
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
world.afterEvents.playerPlaceBlock.subscribe(data => {
  if(data.block.getItemStack().typeId == "minecraft:chest") {
    data.player.addTag(`chest=${data.block.location.x}:${data.block.location.y}:${data.block.location.z}`)
  }
})

world.beforeEvents.itemUseOn.subscribe(data => {
  let db = getDatabase()
    let player = data.source
    let hitBlock = data.block
    let x = hitBlock.location.x
    let y = hitBlock.location.y
    let z = hitBlock.location.z
    if(hitBlock.getItemStack().typeId == "minecraft:chest"){
      if(!data.source.hasTag(`chest=${x}:${y}:${z}`)) data.cancel = true;
 }
})

world.afterEvents.entityHitBlock.subscribe(data => {
  let db = getDatabase()
    let player = data.damagingEntity
    let hitBlock = data.hitBlock
    let x = hitBlock.location.x
    let y = hitBlock.location.y
    let z = hitBlock.location.z
    if(player.isSneaking == true){
      if(db.hasTag(`crates=${x}:${y}:${z}`) == false) {
        for(const entity of ow.getEntities()){
            if(entity.typeId == "tgm:database"){
                data.cancel = true
        if(data.damagingEntity.hasTag(`chest=${x}:${y}:${z}`)) {
          if(entity.hasTag(`crate=${x}:${y}:${z}`) == false){
            if(entity.hasTag(`shops=${x}:${y}:${z}`) == false){
            var cshopui = new ModalFormData()
            .title("§2ChestShop Menu")
            .textField("Item Name (ex: minecraft:armor_stand)", "Name")
            .textField("Item Price (price of one)", "Number")
            .textField("Item Min Buy Amount (for PublicMarket)", "Number", "1")
            cshopui.show(player).then(res => {
              if(res.formValues[0] != undefined && res.formValues[1] != undefined){
                ow.runCommandAsync(`tag @e[type=tgm:database] add "shops=${x}:${y}:${z}"`)
                player.runCommandAsync(`tag @e add "shops=${x}:${y}:${z}"`)
                ow.runCommandAsync(`tag @e[type=tgm:database] add "(${x}:${y}:${z})shop=${res.formValues[0]}:${res.formValues[1]}:${res.formValues[2]}:${player.name}:tendou"`)
              }
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
              
                    let money = world.scoreboard.getObjective("money").getScore(player)
                    let price = shopv[1]*res.formValues[0]
                    if(money >= price){
                      
                        let inventoryComponent = hitBlock.getComponent(BlockComponentTypes.Inventory)
                        let inv = inventoryComponent.container
                        for(let x=0; inv.size > x; x++){
                            let slot = inv.getItem(x)
                            let amt = parseInt(res.formValues[0])
                            let data = parseInt(shopv[2])
                            if(slot.typeId == "minecraft:" + shopv[0] && slot.amount >= amt){
                              console.warn('okkee')
                                player.runCommandAsync(`scoreboard players remove @s money ${price}`)
                                player.runCommandAsync(`give @s ${shopv[0]} ${res.formValues[0]}`)
                                let newamt = slot.amount - amt
                                if(newamt != 0) {
                                inv.setItem(x, new ItemStack(shopv[0], newamt))
                            } else {
                                 inv.setItem(x)
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
                .body(`§9Sorry, the owner of the market, is not in the game at the moment.\n\n\nmade by hzTendou`)
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
})

world.beforeEvents.playerBreakBlock.subscribe(data => {
  if(data.block.getItemStack().typeId == "minecraft:chest"){
    let block = data.block
    let x = block.location.x
    let z = block.location.z
    let y = block.location.y
    if(data.player.hasTag(`perm:Admin`) == false){
      if(data.player.hasTag(`chest=${x}:${y}:${z}`)){
        return;
      }
      else {
        data.cancel = true
      }
    } 
  }
})
world.beforeEvents.playerInteractWithBlock.subscribe(data => {
  if(data.block.getItemStack().typeId == "minecraft:chest"){
    let block = data.block
    let x = block.location.x
    let z = block.location.z
    let y = block.location.y
    if(data.player.hasTag(`perm:Admin`) == false){
      if(data.player.hasTag(`chest=${x}:${y}:${z}`)){
        return;
      }
      else {
        data.cancel = true
      }
    } 
  }
})
world.afterEvents.playerBreakBlock.subscribe(data => {
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

