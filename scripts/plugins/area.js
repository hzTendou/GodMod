import { world, ItemStack,system, EntityComponentTypes, ItemLockMode, EquipmentSlot, BlockComponentTypes, Player } from "@minecraft/server"
import { ActionFormData, ModalFormData } from "@minecraft/server-ui"
import { Vec3 } from "../utils/vec3.d.js";
function getDatabase() {
    for(let entity of world.getDimension("overworld").getEntities()){
        if(entity.typeId == "tgm:database"){
            return entity;
        }
    }
  }
function getAvr(lil,big){
    let arr = []
    let i = 0
    for(let x=lil; big >= x; x++){
        arr[i] = parseInt(x)
        i++
    }
    return arr;
}
function getTag(player, startW){
    let tag
    for(tag of player.getTags()){
        if(tag.startsWith(startW)){
            tag = tag
            break
        }
    }
    return tag
}
function isInside(fx, fz, ax1, ax2, az1, az2){
        let x = Math.trunc(fx)
        let z = Math.trunc(fz)
        let arrx
        let arrz
        if(ax1 > ax2){arrx = getAvr(ax2, ax1)} else {arrx = getAvr(ax1, ax2)}
        if(az1 > az2){arrz = getAvr(az2, az1)} else {arrz = getAvr(az1, az2)}
        if(arrx.includes(x) && arrz.includes(z)) return true
        else { return false }
    }
function isInsideAnyArea(player){
    let status = false
    for(let tag of getDatabase().getTags()){
        if(tag.startsWith("sparea:")){
            let sptag = tag.split(":")
            if(isInside(player.location.x, player.location.z, sptag[2], sptag[4], sptag[3], sptag[5])){
                status = true
               }
        }
    }
    return status
}
function getAreaValues(player){
    let values = []
    for(let tag of getDatabase().getTags()){
        if(tag.startsWith("sparea:")){
            let sptag = tag.split(":")
            if(isInside(player.location.x, player.location.z, sptag[2], sptag[4], sptag[3], sptag[5])){
                values = sptag
               }
        }
    }
    return values
}

function hereIsHim(pl){
            let data = getAreaValues(pl)
            if(data[1] == pl.name){
                return true
            } else {
                return false
            }
}
function calculateSize(x1,z1,x2,z2){
    let l1
    let l2
    if(x1>x2){ l1 = getAvr(x2,x1)} else { l1 = getAvr(x1,x2)}
    if(z2>z1){ l2 = getAvr(z1,z2)} else { l2 = getAvr(z2,z1)}
    return l1.length*l2.length
}


world.beforeEvents.playerPlaceBlock.subscribe(data => {
    if(!data.player.hasTag("dbJob:selection")){
    if(isInsideAnyArea(data.block)){
        if(!hereIsHim(data.player)){
            data.cancel = true
        } else {
            data.cancel = false
        }
    }} else {
        if(isInsideAnyArea(data.block)){
            if(!hereIsHim(data.player)){
                data.cancel = true
                data.player.sendMessage("Here is selected before you from anyone")
            } else {
                data.cancel = true
                data.player.sendMessage("You selected here before")
            }
        } else {
            if(!data.player.hasTag("dbJob:selection1")){
                data.player.sendMessage("First cordinate selected")
            data.player.runCommandAsync(`tag @s add dbJob:selection1`)
            data.player.runCommandAsync(`tag @s add "(1)${data.player.name}=${data.block.location.x}:${data.block.location.z}"`)
            } else {
                data.player.sendMessage("Seoncd cordinate selected")
                data.player.runCommandAsync(`tag @s add "(2)${data.player.name}=${data.block.location.x}:${data.block.location.z}"`)
                let loc1 = getTag(data.player, `(1)${data.player.name}=`)
                let loc2 = getTag(data.player, `(2)${data.player.name}=`)
                let sploc1 = loc1.replace(`(1)${data.player.name}=`, "")
                let sploc2 = loc2.replace(`(2)${data.player.name}=`, "")
                let locs1 = sploc1.split(":")
                let locs2 = sploc2.split(":")
                if((calculateSize(locs1[0], locs2[1], locs2[0], locs2[1])*100)<=world.scoreboard.getObjective("money").getScore(data.player)){
                    data.player.runCommandAsync(`tag @s add "sparea:${data.player.name}:${locs1[0]}:${locs1[1]}:${locs2[0]}:${locs2[1]}"`)
                    data.player.runCommandAsync(`tag @e[type=tgm:database] add "sparea:${data.player.name}:${locs1[0]}:${locs1[1]}:${locs2[0]}:${locs2[1]}"`)
                    data.player.runCommandAsync(`scoreboard players remove @s money ${calculateSize(locs1[0], locs2[1], locs2[0], locs2[1])*100}`)
                    data.player.runCommandAsync(`tag @s remove dbJob:selection`)
                    data.player.runCommandAsync(`tag @s remove dbJob:selection1`)
                    data.player.runCommandAsync(`tag @s remove "(1)${data.player.name}=${locs1[0]}:${locs1[1]}"`)
                    data.player.runCommandAsync(`tag @s remove "(2)${data.player.name}=${locs2[0]}:${locs2[1]}"`)
                    data.player.sendMessage(`§2Area succesfully bought!`)
                }
            }
        }
    }
})
world.beforeEvents.playerInteractWithBlock.subscribe(data => {
    if(isInsideAnyArea(data.block)){
        if(!hereIsHim(data.player)){
            data.cancel = true
        } else {
            data.cancel = false
        }
    
    }
})
world.beforeEvents.playerBreakBlock.subscribe(data => {

    if(isInsideAnyArea(data.block)){
        if(!hereIsHim(data.player)){
            data.cancel = true
        } else {
            data.cancel = false
        }
    }
})
system.runInterval(() => {
    for(let player of world.getAllPlayers()){
        if(isInsideAnyArea(player)){
        if(!hereIsHim(player)){
            player.onScreenDisplay.setActionBar(`You're inside anyone's area`)
        } else {
            player.onScreenDisplay.setActionBar(`You're inside your area`)
        }
    }
}
})
