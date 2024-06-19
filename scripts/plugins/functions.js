import { world } from "@minecraft/server"
export function customChatRanks(data) {
    data.cancel = true
    var message = data.message
    const sender = data.sender
    message = message.replaceAll('"', '\"')

    if (!message == "") {
        const tags = sender.getTags()
        let rank
        for (const tag of tags) {
            if (tag.startsWith('rank:')) {
                rank = tag.replace('rank:', '')
                rank = rank.replaceAll(" ", "")
                rank = rank.replaceAll('-', ' ')
            }
        }

        if (rank == undefined) rank = "§bMember"
        world.getDimension("overworld").runCommandAsync(`tellraw @a {"rawtext":[{"text":"§8[§a${rank}§8] §2${sender.name} §c>>§f ${message}"}]}`)
    }
}

export function customNameRanks(data) {
          for (const player of world.getAllPlayers()) {
            const tags = player.getTags()
        let rank
        for (const tag of tags) {
            if (tag.startsWith('rank:')) {
                rank = tag.replace('rank:', '')
                rank = rank.replaceAll(" ", "")
                rank = rank.replaceAll("-", " ")
            }
        }
        if (rank == undefined){ rank = "§bMember" }
        const phc = player.getComponent("health")
        if(rank != "§bMember"){
            if(player.hasTag("ranked") == false) {
            player.runCommandAsync("tag @s add ranked")
        }
        }
        let ph = Math.trunc(phc.currentValue)
      player.nameTag = ` §8[§a${rank?.replaceAll("§2", "")}§8] §2${player.name}§2 \n§4${ph} \u2764`
    }
}

