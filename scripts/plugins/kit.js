import { world } from "@minecraft/server"
import { ActionFormData, ModalFormData } from "@minecraft/server-ui"
function runCmd(command){
    world.getDimension("overworld").runCommandAsync(command)
}
function resinv(player) {
    player.runCommandAsync("replaceitem entity @s slot.hotbar 0 air")
    player.runCommandAsync("replaceitem entity @s slot.hotbar 1 air")
    player.runCommandAsync("replaceitem entity @s slot.hotbar 2 air")
    player.runCommandAsync("replaceitem entity @s slot.hotbar 3 air")
    player.runCommandAsync("replaceitem entity @s slot.hotbar 4 air")
    player.runCommandAsync("replaceitem entity @s slot.hotbar 5 air")
}
world.afterEvents.entityHitEntity.subscribe(data => {
    if(data.hitEntity.hasTag("slapper:kit")) {
        let player = data.damagingEntity
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
                player.runCommandAsync("replaceitem entity @s slot.hotbar 0 diamond_sword")
                player.runCommandAsync("replaceitem entity @s slot.hotbar 1 golden_apple 10")
                player.runCommandAsync("replaceitem entity @s slot.armor.head 0 chainmail_helmet")
                player.runCommandAsync("replaceitem entity @s slot.armor.chest 0 chainmail_chestplate")
                player.runCommandAsync("replaceitem entity @s slot.armor.legs 0 chainmail_leggings")
                player.runCommandAsync("replaceitem entity @s slot.armor.feet 0 chainmail_boots")
                player.runCommandAsync(`tp @s @e[type=tgm:kittp]`)
                player.runCommandAsync(`title @s actionbar §2Start Figth!`)
            }
            if(res.selection == 1) {
                resinv(player)
                player.runCommandAsync("replaceitem entity @s slot.hotbar 0 bow")
                player.runCommandAsync("replaceitem entity @s slot.hotbar 1 golden_apple 15")
                player.runCommandAsync("replaceitem entity @s slot.armor.head 0 iron_helmet")
                player.runCommandAsync("replaceitem entity @s slot.armor.chest 0 iron_chestplate")
                player.runCommandAsync("replaceitem entity @s slot.armor.legs 0 iron_leggings")
                player.runCommandAsync("replaceitem entity @s slot.armor.feet 0 iron_boots")
                player.runCommandAsync(`replaceitem entity @s slot.hotbar 2 arrow 64`)
                player.runCommandAsync(`replaceitem entity @s slot.hotbar 3 arrow 64`)
                player.runCommandAsync(`tp @s @e[type=tgm:kittp]`)
                player.runCommandAsync(`title @s actionbar §2Start Figth!`)
            }
            if(res.selection == 2) {
                resinv(player)
                player.runCommandAsync("replaceitem entity @s slot.hotbar 0 stone_sword")
                player.runCommandAsync("replaceitem entity @s slot.hotbar 1 golden_apple 5")
                player.runCommandAsync("replaceitem entity @s slot.armor.head 0 diamond_helmet")
                player.runCommandAsync("replaceitem entity @s slot.armor.chest 0 diamond_chestplate")
                player.runCommandAsync("replaceitem entity @s slot.armor.legs 0 diamond_leggings")
                player.runCommandAsync("replaceitem entity @s slot.armor.feet 0 diamond_boots")
                player.runCommandAsync(`tp @s @e[type=tgm:kittp]`)
                player.runCommandAsync(`title @s actionbar §2Start Figth!`)
            }
            if(res.selection == 3) {
                resinv(player)
                player.runCommandAsync(`replaceitem entity @s slot.hotbar 0 potion 1 8`)
                player.runCommandAsync(`replaceitem entity @s slot.hotbar 1 potion 1 10`)
                player.runCommandAsync(`replaceitem entity @s slot.hotbar 2 potion 1 12`)
                player.runCommandAsync(`replaceitem entity @s slot.hotbar 3 potion 1 15`)
                player.runCommandAsync(`replaceitem entity @s slot.hotbar 4 potion 1 22`)
                player.runCommandAsync("replaceitem entity @s slot.hotbar 5 stone_sword")
                player.runCommandAsync("replaceitem entity @s slot.armor.chest 0 iron_chestplate")
                player.runCommandAsync("replaceitem entity @s slot.armor.legs 0 iron_leggings")
                player.runCommandAsync("replaceitem entity @s slot.armor.feet 0 iron_boots")
                player.runCommandAsync(`tp @s @e[type=tgm:kittp]`)
                player.runCommandAsync(`title @s actionbar §2Start Figth!`)

            }
        })
    }
})