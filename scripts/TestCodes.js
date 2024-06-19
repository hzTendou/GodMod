   import { Database } from "./utils/db.js"
   let db = new Database("general")
   //////////////////////////////////////////////////////////////////////
     function ban(player){
    for(let playerf of world.getPlayers()){
          if(playerf.name == player){
        playerf.addTag("banned")
        db.addVar("bans", `${playerf.name}`, "banned")
      }
    }
  }
  function getBans(){
    return db.listOfVarKeys("bans")
   }
   function addCommand(command){
     for(let x=1; x < 32000; x++){
       if(db.hasVar("codes", `command-${x}`, `${command}`)){
         return;
       } else {
         db.addVar(`codes`, `command-${x}`, command)
         break;
       }
     }
   }
   function removeCommand(commandNumber){
     if(db.hasKey("codes", commandNumber)){
       db.deleteKey("codes", commandNumber)
     }
   }
   function listCommand() {
     return db.listOfVarKeys("codes")
   }
   world.events.tick.subscribe(data => {
     for(let x=0; 32000 > x; x++){
       if(db.hasKey('codes', `command-${x}`)){
         ow.runCommandAsync(db.getVar("codes",`command-${x}`))
       } else {
         break;
       }
     }
   })
   world.events.tick.subscribe(data => {
     for(let player of world.getPlayers()){
       if(db.hasKey("bans", player.name)){
         player.addTag("banned")
       }
     }
   })
   world.events.tick.subscribe(data => {
     for(let player of world.getPlayers()){
         db.setKey("playerStats", `${player.name}.kill`, `${getScore(player, "player.kill")}`)
         db.setKey("playerStats", `${player.name}.health`, `${getScore(player, "player.health")}`)
         db.setKey("playerStats", `${player.name}.money`, `${getScore(player, "money")}`)
         db.setKey("playerStats", `${player.name}.bank`, `${getScore(player, "bank")}`)
         db.setKey("playerStats", `${player.name}.sneaking`, `${getScore(player, "player.sneaking")}`)
     }
   })
   //////////////////////////////////////////////////////////////////////
 world.events.beforeChat.subscribe((chatEvent) => {
   if (chatEvent.message.startsWith("$")) {
     chatEvent.cancel = true;
     if(chatEvent.sender.hasTag("perm:Admin")){
     eval(chatEvent.message.substring(1));
     } 
   }
 });

//////////////////////////////////////////////////////////////////////
 
setTickInterval(() => {
    try {
  for(let player of world.getPlayers()){
    let x = player.location.x
    let y = player.location.y
    let z = player.location.z
        let count = getScore(player, 'chestGuiMarket')
        console.log(count)
        if(count <= 0){
          ow.runCommandAsync(`summon tgm:chestuimarket "§l§9Public Market §8[-${player.name}-]" ${x} ${y} ${z}`)
          ow.runCommandAsync(`scoreboard players set "${player.name}" chestGuiMarket 1`)
        }
  }
    } catch(e) {
      ow.runCommandAsync(`say ${e}`)
    }
  }, 20)
  setTickInterval(() => {
   for(let entity of ow.getEntities()){
     if(entity.typeId == 'tgm:chestuimarket'){
       let namep1 = entity.nameTag
       let namep2 = namep1.split("-")
       let name = namep2[1]
       for(let player of world.getPlayers()){
         if(player.name == name){
           let inv = player.getComponent('minecraft:inventory')
           let slot = inv.container
           let item = slot.getItem(player.selectedSlot)
           if(item?.typeId == 'minecraft:book' && item?.data == 6969){
             player.runCommandAsync(`execute @s ~~~ tp @e[type=tgm:chestuimarket, name="${entity.nameTag}"] ^^1.35^0.5`)
           } else {
             player.runCommandAsync(`execute @s ~~~ tp @e[type=tgm:chestuimarket, name="${entity.nameTag}"] ^^11^`)
           }
         }
       }
     }
   }
  }, 20)

//////////////////////////////////////////////////////////////////////
  if(res.selection == 2) {
    let pm = new ActionFormData()
    .title("§cPublicMarket Settings")
    .body("§9Select a option")
    .button("§2Add Item\n§8[Click me]", "textures/ui/color_plus.png")
    pm.show(playerd).then(res => {
      if(res.selection == 0){
        let itemadd = new ModalFormData()
        .title("§cAdd item to PublicMarket")
        .textField("§2Write item slot number in your inventory (0-35)", "Slot Number")
        .textField("§2Write item selling price (%10 commision)", "Number")
        itemadd.show(playerd).then(res => {
              let inv1 = playerd.getComponent("minecraft:inventory").container
              let item = inv1.getItem(parseInt(res.formValues[0]))
              
                let namep = playerd.nameTag.split('§2')
                let name = namep[1]
                ow.runCommandAsync(`tag @e[type=tgm:database] add "PublicMarket,${item.typeId},${item.amount},${item.data},${res.formValues[1]},${name}"`)
                inv1.setItem(res.formValues[0], new ItemStack(Items.get("minecraft:air")))
            
        })
      }
    })
  }


  ///////////////////////////////////////////////////////////
  //  system.runInterval(() => {
//    try {
//  for(let player of world.getPlayers()){
//    let x = player.location.x
//    let y = player.location.y
//    let z = player.location.z
//       let count = world.scoreboard.getObjective('chestGuiMarket').getScore(player)
//        if(count == 0){
//          ow.runCommandAsync(`summon tgm:chestuimarket "§l§9Public Market §8[-${player.name}-]" ${x} ${y} ${z}`)
//          player.runCommandAsync(`scoreboard players set @s chestGuiMarket 1`)
//        }
//  }
//    } catch(e) {
//      ow.runCommandAsync(`say ${e}`)
//    }
//  }, 120)
// system.runInterval(() => {
//  for(let entity of ow.getEntities()){
//    if(entity.typeId == 'tgm:chestuimarket'){
//      let namep1 = entity.nameTag
//      let namep2 = namep1.split("-")
//      let name = namep2[1]
//      for(let player of world.getPlayers()){
//        if(player.name == name){
//          let inv = player.getComponent(EntityComponentTypes.Equippable)
//          let item = inv.getEquipment(EquipmentSlot.Mainhand)
//          if(item?.typeId == 'minecraft:book'){
//            player.runCommand(`tp @e[type=tgm:chestuimarket, name="${entity.nameTag}"] ^^1.35^0.5`)
//          } else {
//            player.runCommand(`tp @e[type=tgm:chestuimarket, name="${entity.nameTag}"] ^^11^`)
//          }
//        }
//      }
//    }
//  }
// }, 10)
