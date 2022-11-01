import { world } from "@minecraft/server"
import { ActionFormData, ModalFormData } from "@minecraft/server-ui"
function runCmd(command){
    world.getDimension("overworld").runCommand(command)
}
world.events.beforeChat.subscribe(data => {
    let prefix ="t/"
    let player = data.sender
    if(data.message.startsWith(prefix)){
       let msg = data.message
       let cmd = msg.substr(prefix.length)
      if(cmd.startsWith("set-tp-point")){
        player.runCommand(`summon tgm:kittp ~~~`)
      }
      if(cmd.startsWith("reset-tp-point")){
          runCmd(`kill @e[type=tgm:kittp]`)
      }
    }
})
function resinv(player) {
    player.runCommand("replaceitem entity @s slot.hotbar 0 air")
    player.runCommand("replaceitem entity @s slot.hotbar 1 air")
    player.runCommand("replaceitem entity @s slot.hotbar 2 air")
    player.runCommand("replaceitem entity @s slot.hotbar 3 air")
    player.runCommand("replaceitem entity @s slot.hotbar 4 air")
    player.runCommand("replaceitem entity @s slot.hotbar 5 air")
}
world.events.entityHit.subscribe(data => {
    if(data.hitBlock) return;
    if(data.hitEntity.hasTag("slapper:kit")) {
        let player = data.entity
        let kitui = new ActionFormData()
        .title("§cSelect your kit!")
        .body(`§9Don't wait!`)
        .button("§2Warrior\n§8[Click Me]", "textures/items/diamond_sword.png")
        .button("§2Archer\n§8[Click Me]", "textures/items/bow_standby.png")
        .button("§2Tank\n§8[Click Me]", "textures/items/diamond_chestplate.png")
        .button("§2Witcher\n§8[Click Me]", "textures/items/potion_bottle_fireResistance.png")
        kitui.show(player).then(res => {
            if(res.selection == 0) {
                resinv(player)
                player.runCommand("replaceitem entity @s slot.hotbar 0 diamond_sword")
                player.runCommand("replaceitem entity @s slot.hotbar 1 golden_apple 10")
                player.runCommand("replaceitem entity @s slot.armor.head 0 chainmail_helmet")
                player.runCommand("replaceitem entity @s slot.armor.chest 0 chainmail_chestplate")
                player.runCommand("replaceitem entity @s slot.armor.legs 0 chainmail_leggings")
                player.runCommand("replaceitem entity @s slot.armor.feet 0 chainmail_boots")
                player.runCommand(`tp @s @e[type=tgm:kittp]`)
                player.runCommand(`title @s actionbar §2Start Figth!`)
            }
            if(res.selection == 1) {
                resinv(player)
                player.runCommand("replaceitem entity @s slot.hotbar 0 bow")
                player.runCommand("replaceitem entity @s slot.hotbar 1 golden_apple 15")
                player.runCommand("replaceitem entity @s slot.armor.head 0 iron_helmet")
                player.runCommand("replaceitem entity @s slot.armor.chest 0 iron_chestplate")
                player.runCommand("replaceitem entity @s slot.armor.legs 0 iron_leggings")
                player.runCommand("replaceitem entity @s slot.armor.feet 0 iron_boots")
                player.runCommand(`replaceitem entity @s slot.hotbar 2 arrow 64`)
                player.runCommand(`replaceitem entity @s slot.hotbar 3 arrow 64`)
                player.runCommand(`tp @s @e[type=tgm:kittp]`)
                player.runCommand(`title @s actionbar §2Start Figth!`)
            }
            if(res.selection == 2) {
                resinv(player)
                player.runCommand("replaceitem entity @s slot.hotbar 0 stone_sword")
                player.runCommand("replaceitem entity @s slot.hotbar 1 golden_apple 5")
                player.runCommand("replaceitem entity @s slot.armor.head 0 diamond_helmet")
                player.runCommand("replaceitem entity @s slot.armor.chest 0 diamond_chestplate")
                player.runCommand("replaceitem entity @s slot.armor.legs 0 diamond_leggings")
                player.runCommand("replaceitem entity @s slot.armor.feet 0 diamond_boots")
                player.runCommand(`tp @s @e[type=tgm:kittp]`)
                player.runCommand(`title @s actionbar §2Start Figth!`)
            }
            if(res.selection == 3) {
                resinv(player)
                player.runCommand(`replaceitem entity @s slot.hotbar 0 potion 1 8`)
                player.runCommand(`replaceitem entity @s slot.hotbar 1 potion 1 10`)
                player.runCommand(`replaceitem entity @s slot.hotbar 2 potion 1 12`)
                player.runCommand(`replaceitem entity @s slot.hotbar 3 potion 1 15`)
                player.runCommand(`replaceitem entity @s slot.hotbar 4 potion 1 22`)
                player.runCommand("replaceitem entity @s slot.hotbar 5 stone_sword")
                player.runCommand("replaceitem entity @s slot.armor.chest 0 iron_chestplate")
                player.runCommand("replaceitem entity @s slot.armor.legs 0 iron_leggings")
                player.runCommand("replaceitem entity @s slot.armor.feet 0 iron_boots")
                player.runCommand(`tp @s @e[type=tgm:kittp]`)
                player.runCommand(`title @s actionbar §2Start Figth!`)

            }
        })
    }
})