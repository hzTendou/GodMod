import { world } from "@minecraft/server"

class playerBuilder {
  constructor() {
  }
  
  getTags({ name }) {
    const tag_data = world.getDimension("overworld").runCommandAsync(`tag "${name}" list`)
    if(!tag_data?.statusMessage) return []
    
    let tags = tag_data.statusMessage.match(/(?<=: ).*$/)
    if(!tags || !tags[0]) return []
    
    return tags[0].split('§r, §a') 
  }
  
  hasTag({ tag, name }) {
    const allTags = this.getTags({ name });
        if (!allTags)
            return false;
        for (const Tag of allTags)
            if (Tag.replace(/§./g, '').match(new RegExp(`^${tag.replace(/§./g, '')}$`)))
                return true;
        return false;
  }
  
  hasAllTags({ name, tags }) {
    return tags.every(tag => this.hasTag({ name, tag }))
  }
  
  exists({ name }) {
    return world.getPlayers().some(player => player.name == name || player.name == name)
  }
  
  find({ name }) {
    if(!this.exists({ name })) return
    return world.getPlayers().find(player => player.name == name || player.name == name)     
  }
}

const player = new playerBuilder()
export default player
