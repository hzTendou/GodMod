import { world, Entity, BlockLocation } from "@minecraft/server"
function getDb(){
    for(let entity of world.getDimension("overworld").getEntities()){
        if(entity.typeId == "tgm:db"){
            return entity
        }
       }
}
class Database {
    constructor(db_name) {
        this.DB_NAME = db_name
        this.ow = world.getDimension("overworld")
        let db = getDb()
        this.db = this.getEntity()
        console.warn(`DB: ${db?.typeId} ||| ${this.db?.typeId}`)
        this.stringToBinary = (str = '') => {
            let res = '';
            res = str.split('').map(char => {
               return char.charCodeAt(0).toString(2);
            }).join(' ');
            return res;
         }
         this.binaryToString = (binary = '') => {
            let strArr = binary.split(' ');
            const str = strArr.map(part => {
               return String.fromCharCode(parseInt(part, 2));
            }).join('');
            return str;
         };
    }
     getEntity(){
        if(getDb() != undefined) return getDb()
    }
    getVar(table_name, key){
        let tnb = this.stringToBinary(table_name)
        let kb = this.stringToBinary(key)
        if(this.hasKey(table_name, key)) {
            for(let tag of this.db.getTags()){
                if(tag.startsWith(`${tnb}:${kb}`)){
                    let str = tag.split(":")
                    let str1 = str[0]
                    let str2 = str[1]
                    let str3 = str[2]
                    return this.binaryToString(str3);
                } 
                break;
            }
        }
    }
    addVar(table_name, key, value){
        let tnb = this.stringToBinary(table_name)
        let kb = this.stringToBinary(key)
        let vb = this.stringToBinary(value)
        this.db.addTag(`${tnb}:${kb}:${vb}`)
    }
    deleteVar(table_name, key, value) {
        let tnb = this.stringToBinary(table_name)
        let kb = this.stringToBinary(key)
        let vb = this.stringToBinary(value)
        if(this.hasVar(table_name, key, value)) {
            this.db.removeTag(`${tnb}:${kb}:${vb}`)
        }
    }
    deleteKey(table_name, key){
        let tnb = this.stringToBinary(table_name)
        let kb = this.stringToBinary(key)
        if(this.hasKey(table_name, key)) {
            for(let tag of this.db.getTags()){
                if(tag.startsWith(`${tnb}:${kb}`)){
                    this.db.removeTag(tag)
                } 
            }
        }
    }
    setVar(table_name, key, value, newValue){
        let tnb = this.stringToBinary(table_name)
        let kb = this.stringToBinary(key)
        let vb = this.stringToBinary(value)
        if(this.hasVar(table_name, key, value)){
            this.deleteVar(table_name, key, value)
            this.addVar(table_name, key, newValue)
        }
    }
    setKey(table_name, key, newValue){
        let tnb = this.stringToBinary(table_name)
        let kb = this.stringToBinary(key)
        if(this.hasVar(table_name, key)){
            this.deleteKey(table_name, key)
            this.addVar(table_name, key, newValue)
        } else {
            this.addVar(table_name, key, newValue)
        }
    }
    hasVar(table_name, key, value) {
        let tnb = this.stringToBinary(table_name)
        let kb = this.stringToBinary(key)
        let vb = this.stringToBinary(value)
        if(this.db.hasTag(`${tnb}:${kb}:${vb}`)){
            return true 
        } else {
            return false
        }
    }
    hasKey(table_name, key) {
        let tnb = this.stringToBinary(table_name)
        let kb = this.stringToBinary(key)
        for(let tag of this.db.getTags()){
            if(tag.startsWith(`${tnb}:${kb}`)){
                return true 
            } else {
                return false
            }
        }
    }
    listOfVars(table_name){
        let list = []
        let x = 0
        for(let tag of this.db.getTags()){
            if(tag.startsWith(`${this.stringToBinary(table_name)}`)){
                list[x] = tag.substring(this.stringToBinary(table_name).length + 1)
                x++
            } 
        }
        let vars = ""
        for(let i=0; i > list.length; x++){
            let str = list[i].split(`:`)
            let str1 = this.binaryToString(str[0])
            let str2 = this.binaryToString(str[1])
            vars = vars + "," + str1 + ":" + str2
        }
        return vars
    }
    listOfVarKeys(table_name){
        let list = []
        let x = 0
        for(let tag of this.db.getTags()){
            if(tag.startsWith(`${this.stringToBinary(table_name)}`)){
                list[x] = tag.substring(this.stringToBinary(table_name).length + 1)
                x++
            } 
        }
        let vars = ""
        for(let i=0; i > list.length; x++){
            let str = list[i].split(`:`)
            let str1 = this.binaryToString(str[0])
            vars = vars + "," + str1
        }
        return vars
    }

}

export {Database}