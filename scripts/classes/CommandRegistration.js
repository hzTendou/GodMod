import { ScriptEventCommandMessageAfterEvent, world } from "@minecraft/server"
import Collection from './include/Collection.js';
import player from '../utils/player.js'
import event from './manager/EventEmitter.js'
import CommandError from './error/command.js';
import Interaction from './interaction/interaction.js';
import CommandParser from './parser/command.js'
import database from '../utils/database.js'
import MS from '../utils/ms.js'
import { setTickTimeout } from '../utils/scheduling.js';

class CustomCommand {
    constructor() {
        this.prefix = "!";
        this.cooldowns = database.table('commandCooldowns')
        this.commands = new Collection();
         world.beforeEvents.chatSend.subscribe(beforeChatPacket => {
            this.exec(beforeChatPacket)
        })
    };
    
    getCommand(command) {
        const cmd = command?.toLowerCase();
        return this.commands.get(cmd) || this.commands.find(v => v.aliases?.includes(cmd));
    };
    
    getAllCommands() {
        return this.commands
    }
    
    getPrefix() {
        return this.prefix
    }
    
    setPrefix(value) {
        this.prefix = value
    }
    
    register(registration, callback) {
        this.commands.set(registration.name.toLowerCase(), {
            ...registration,
            callback
        });
    };
    
    triggerCommand(command, interaction) {
        this.getCommand(command).callBack(interaction)
    }
    
    
    exec(beforeChatPacket) {
        try {
        let { message, sender } = beforeChatPacket
        if (!message.startsWith(this.prefix))
            return;
        
        beforeChatPacket.cancel = true
        const args = message.slice(this.prefix.length).trim().match(/([^\s"]+|"[^"]*")+/g).map(v => /\s/.test(v) ? v.replace(/^"|"$/g, '') : v);
        
        const commandName = args?.shift()?.toLowerCase();
        const command = this.getCommand(commandName);
        if (!command || command.private && !player.hasTag({ tag: 'private', name: sender.name }))
            return new CommandError({ message: `${commandName} wrong command`, player: sender.name, });
        if(command.requiredTags.length && !player.hasAllTags({ tags: command.requiredTags, name: sender.name }))
            return new CommandError({ message: `you do not have the required permissions to use ${commandName}! you must have all of these tags to execute the command: ${command.requiredTags}`, player: sender.name, })
        
        beforeChatPacket.cancel = command.cancelMessage
        
        let ParsedCommand;
        try {
            ParsedCommand = new CommandParser({ command, args }).toParsedCommand()
        }  catch(e) {
            new CommandError({ message: e.message, player: sender.name })
            return;
        }
        
        const interaction = new Interaction(ParsedCommand, sender, message, args)
        event.emit('commandRan', interaction)
        
        command.callback(interaction);
        } catch(e) {
            world.getDimension("overworld").runCommandAsync(`say ${e} ${e.stack}`)
        }
        
    };
};

const CommandHandler = new CustomCommand()
export default CommandHandler 
