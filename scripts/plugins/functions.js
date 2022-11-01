import { world } from "@minecraft/server"
export function getTags(target) {
    const command = world.getDimension("overworld").runCommand(`tag "${target}" list`)
    const raw = command.statusMessage.split(' ')
    const tags = []
    for (const string of raw) {
        if (!string.startsWith("rank:")) tags.push(string.replace('§a', '').replace('§r', '').replace(',', ' '))
    }
    return tags
}
export function customChatRanks(data) {
    data.cancel = true
    var message = data.message
    const sender = data.sender
    message = message.replaceAll('"', '\"')

    if (!message == "") {
        const tags = getTags(sender.name)
        let rank
        for (const tag of tags) {
            if (tag.startsWith('rank:')) {
                rank = tag.replace('rank:', '')
                rank = rank.replaceAll(" ", "")
                rank = rank.replaceAll('-', ' ')
            }
        }

        if (rank == undefined) rank = "§bMember"
        world.getDimension("overworld").runCommand(`tellraw @a {"rawtext":[{"text":"§8[§a${rank}§8] §2${sender.name} §c>>§9 ${message}"}]}`)
    }
}

export function customNameRanks(data) {
          for (const player of world.getPlayers()) {
        const tags = getTags(player.name)
        let rank
        for (const tag of tags) {
            if (tag.startsWith('rank:')) {
                rank = tag.replace('rank:', '')
                rank = rank.replaceAll(" ", "")
                rank = rank.replaceAll("-", " ")
            
            }
        }
        let team
        for (const tag of tags) {
            if (tag.startsWith('team:')) {
                team = tag.replace('team:', '')
                team = team.replaceAll(" ", "")
                team = team.replaceAll("-", " ")
            }
        }
        if (team == undefined) { team = "§8TEAMLESS" }
        if (rank == undefined){ rank = "§bMember" }
        const phc = player.getComponent("health")
        if(rank != "§bMember"){
            if(player.hasTag("ranked") == false) {
            player.runCommand("tag @s add ranked")
        }
        }
        let ph = Math.trunc(phc.current)
      player.nameTag = ` §8[§a${rank?.replaceAll("§2", "")}§8] §2${player.name}§2 \n§4${ph} \u2764`
    }
}

