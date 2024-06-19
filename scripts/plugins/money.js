import { Dimension, world } from "@minecraft/server"

world.afterEvents.entityHitEntity.subscribe(data => {
    let hp = data.hitEntity.getComponent("health").currentValue
    if(hp <= 0){
    if(data.hitEntity.typeId == "minecraft:player"){
        data.damagingEntity.runCommandAsync(`scoreboard players add @s money 30`)
    } else {
        data.damagingEntity.runCommandAsync(`scoreboard players add @s money 10`)
    }
}
})

world.afterEvents.playerBreakBlock.subscribe(data => {
    if(data.player){
        data.player.runCommandAsync(`scoreboard players add @s money 1`)
    }
})