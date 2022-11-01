import { Dimension, EntityQueryOptions, world } from "@minecraft/server"
import { SimulatedPlayer, Test} from "@minecraft/server-gametest"

world.events.entityHit.subscribe(data => {
    if(data.hitBlock) return;
    let hp = data.hitEntity.getComponent("health").current
    if(hp <= 0){
    if(data.hitEntity.typeId == "minecraft:player"){
        data.entity.runCommand(`scoreboard players add @s money 30`)
    } else {
        data.entity.runCommand(`scoreboard players add @s money 10`)
    }
}
})

world.events.blockBreak.subscribe(data => {
    if(data.player){
        data.player.runCommand(`scoreboard players add @s money 1`)
    }
})