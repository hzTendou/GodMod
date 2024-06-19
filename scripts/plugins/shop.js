import { world } from "@minecraft/server"
import { ActionFormData, ModalFormData } from "@minecraft/server-ui"
function runCmd(command){
    world.getDimension("overworld").runCommandAsync(command)
}

world.afterEvents.entityHitEntity.subscribe(data => {
    if(data.hitEntity.hasTag("slapper:shop")) {
        let player = data.damagingEntity
        let shopui = new ActionFormData()
        .title("§cShop")
        .button("§2Blocks\n§8[Click Me]", "textures/blocks/brick.png")
        .button("§2Tools\n§8[Click Me]", "textures/blocks/chest_front.png")
        shopui.show(player).then(res => {
            if(res.selection == 0){
            let blocksui = new ActionFormData()
            .title(`§cBlocks`)
            .button("§2Brick §e[15GC] \n§8[Click Me]", "textures/blocks/brick.png")
            .button("§2Stone §e[5GC] \n§8[Click Me]", "textures/blocks/stone.png")
            .button("§2StoneBrick §e[30GC] \n§8[Click Me]", "textures/blocks/stonebrick.png")
            .button("§2EndBrick §e[35GC] \n§8[Click Me]", "textures/blocks/end_bricks.png")
            .button("§2EndStone §e[10GC] \n§8[Click Me]", "textures/blocks/end_stone.png")
            .button("§2Log §e[5GC] \n§8[Click Me]", "textures/blocks/log_oak.png")
            .button("§2Glass §e[20GC] \n§8[Click Me]", "textures/blocks/glass_red.png")
            .button("§2Sand §e[5GC] \n§8[Click Me]", "textures/blocks/sand.png")
            blocksui.show(player).then(res => {
                if(res.selection == 0) {
                    let brick = new ModalFormData()
                    .title("§cBuy Brick")
                    .slider("§2Select amount", 1, 64, 1, 1)
                    brick.show(player).then(res => {
                        let bamo = 15*res.formValues[0]
                      player.runCommand(`tag @s[scores={money=${bamo}..}] add havemoney`)
                      if(player.hasTag("havemoney")){
                          player.runCommandAsync(`give @s brick_block ${res.formValues[0]}`)
                          player.runCommandAsync(`scoreboard players remove @s money ${bamo}`)
                          player.runCommandAsync(`tag @s remove havemoney`)
                      }
                    })
                }
                if(res.selection == 1) {
                    let brick = new ModalFormData()
                    .title("§cBuy Stone")
                    .slider("§2Select amount", 1, 64, 1, 1)
                    brick.show(player).then(res => {
                        let bamo = 5*res.formValues[0]
                      player.runCommand(`tag @s[scores={money=${bamo}..}] add havemoney`)
                      if(player.hasTag("havemoney")){
                          player.runCommandAsync(`give @s stone ${res.formValues[0]}`)
                          player.runCommandAsync(`scoreboard players remove @s money ${bamo}`)
                          player.runCommandAsync(`tag @s remove havemoney`)
                      }
                    })
                } if(res.selection == 2) {
                    let brick = new ModalFormData()
                    .title("§cBuy Stone Brick")
                    .slider("§2Select amount", 1, 64, 1, 1)
                    brick.show(player).then(res => {
                        let bamo = 30*res.formValues[0]
                      player.runCommand(`tag @s[scores={money=${bamo}..}] add havemoney`)
                      if(player.hasTag("havemoney")){
                          player.runCommandAsync(`give @s stonebrick ${res.formValues[0]}`)
                          player.runCommandAsync(`scoreboard players remove @s money ${bamo}`)
                          player.runCommandAsync(`tag @s remove havemoney`)
                      }
                    })
                } if(res.selection == 3) {
                    let brick = new ModalFormData()
                    .title("§cBuy End Brick")
                    .slider("§2Select amount", 1, 64, 1, 1)
                    brick.show(player).then(res => {
                        let bamo = 35*res.formValues[0]
                      player.runCommand(`tag @s[scores={money=${bamo}..}] add havemoney`)
                      if(player.hasTag("havemoney")){
                          player.runCommandAsync(`give @s end_bricks ${res.formValues[0]}`)
                          player.runCommandAsync(`scoreboard players remove @s money ${bamo}`)
                          player.runCommandAsync(`tag @s remove havemoney`)
                      }
                    })
                } if(res.selection == 4) {
                    let brick = new ModalFormData()
                    .title("§cBuy End Stone")
                    .slider("§2Select amount", 1, 64, 1, 1)
                    brick.show(player).then(res => {
                        let bamo = 10*res.formValues[0]
                      player.runCommand(`tag @s[scores={money=${bamo}..}] add havemoney`)
                      if(player.hasTag("havemoney")){
                          player.runCommandAsync(`give @s end_brick ${res.formValues[0]}`)
                          player.runCommandAsync(`scoreboard players remove @s money ${bamo}`)
                          player.runCommandAsync(`tag @s remove havemoney`)
                      }
                    })
                } if(res.selection == 5) {
                    let brick = new ModalFormData()
                    .title("§cBuy Log")
                    .slider("§2Select amount", 1, 64, 1, 1)
                    brick.show(player).then(res => {
                        let bamo = 5*res.formValues[0]
                      player.runCommand(`tag @s[scores={money=${bamo}..}] add havemoney`)
                      if(player.hasTag("havemoney")){
                          player.runCommandAsync(`give @s log ${res.formValues[0]}`)
                          player.runCommandAsync(`scoreboard players remove @s money ${bamo}`)
                          player.runCommandAsync(`tag @s remove havemoney`)
                      }
                    })
                    
                }
                if(res.selection == 6) {
                    let brick = new ModalFormData()
                    .title("§cBuy Glass")
                    .slider("§2Select amount", 1, 64, 1, 1)
                    brick.show(player).then(res => {
                        let bamo = 20*res.formValues[0]
                      player.runCommand(`tag @s[scores={money=${bamo}..}] add havemoney`)
                      if(player.hasTag("havemoney")){
                          player.runCommandAsync(`give @s glass ${res.formValues[0]}`)
                          player.runCommandAsync(`scoreboard players remove @s money ${bamo}`)
                          player.runCommandAsync(`tag @s remove havemoney`)
                      }
                    })
                }
                if(res.selection == 7) {
                    let brick = new ModalFormData()
                    .title("§cBuy Sand")
                    .slider("§2Select amount", 1, 64, 1, 1)
                    brick.show(player).then(res => {
                        let bamo = 5*res.formValues[0]
                      player.runCommand(`tag @s[scores={money=${bamo}..}] add havemoney`)
                      if(player.hasTag("havemoney")){
                          player.runCommandAsync(`give @s sand ${res.formValues[0]}`)
                          player.runCommandAsync(`scoreboard players remove @s money ${bamo}`)
                          player.runCommandAsync(`tag @s remove havemoney`)
                      }
                    })
                }
                //bitis 1
            })
            }
            if(res.selection == 1){
                let toolsui = new ActionFormData()
                .title(`§cTools`)
                .button("§2Chest §e[10GC] \n§8[Click Me]", "textures/blocks/chest_front.png")
                .button("§2Ender Pearl §e[30GC] \n§8[Click Me]", "textures/items/ender_pearl.png")
                .button("§2Fishing Rod §e[30GC] \n§8[Click Me]", "textures/items/fishing_rod_uncast.png")
                .button("§2Lantern §e[20GC] \n§8[Click Me]", "textures/items/lantern.png")
                .button("§2Torch §e[5GC] \n§8[Click Me]", "textures/blocks/torch_on.png")
                .button("§2Cooked Beef §e[5GC] \n§8[Click Me]", "textures/items/hoglin_meat_cooked.png")
                .button("§2Armor Stand §e[20GC] \n§8[Click Me]", "textures/items/armor_stand.png")
                .button("§2Sign §e[5GC] \n§8[Click Me]", "textures/items/sign.png");
                toolsui.show(player).then(res => {
                    if(res.selection == 0) {
                        let brick = new ModalFormData()
                        .title("§cBuy Chest")
                        .slider("§2Select amount", 1, 64, 1, 1)
                        brick.show(player).then(res => {
                            let bamo = 10*res.formValues[0]
                          player.runCommand(`tag @s[scores={money=${bamo}..}] add havemoney`)
                          if(player.hasTag("havemoney")){
                              player.runCommandAsync(`give @s chest ${res.formValues[0]}`)
                              player.runCommandAsync(`scoreboard players remove @s money ${bamo}`)
                              player.runCommandAsync(`tag @s remove havemoney`)
                          }
                        })
                    }
                    if(res.selection == 1) {
                        let brick = new ModalFormData()
                        .title("§cBuy Ender Pearl")
                        .slider("§2Select amount", 1, 64, 1, 1)
                        brick.show(player).then(res => {
                            let bamo = 30*res.formValues[0]
                          player.runCommand(`tag @s[scores={money=${bamo}..}] add havemoney`)
                          if(player.hasTag("havemoney")){
                              player.runCommandAsync(`give @s ender_pearl ${res.formValues[0]}`)
                              player.runCommandAsync(`scoreboard players remove @s money ${bamo}`)
                              player.runCommandAsync(`tag @s remove havemoney`)
                          }
                        })
                    } if(res.selection == 2) {
                        let brick = new ModalFormData()
                        .title("§cBuy Fishing Rod")
                        .slider("§2Select amount", 1, 64, 1, 1)
                        brick.show(player).then(res => {
                            let bamo = 30*res.formValues[0]
                          player.runCommand(`tag @s[scores={money=${bamo}..}] add havemoney`)
                          if(player.hasTag("havemoney")){
                              player.runCommandAsync(`give @s fishing_rod ${res.formValues[0]}`)
                              player.runCommandAsync(`scoreboard players remove @s money ${bamo}`)
                              player.runCommandAsync(`tag @s remove havemoney`)
                          }
                        })
                    } if(res.selection == 3) {
                        let brick = new ModalFormData()
                        .title("§cBuy Lantern")
                        .slider("§2Select amount", 1, 64, 1, 1)
                        brick.show(player).then(res => {
                            let bamo = 20*res.formValues[0]
                          player.runCommand(`tag @s[scores={money=${bamo}..}] add havemoney`)
                          if(player.hasTag("havemoney")){
                              player.runCommandAsync(`give @s lantern ${res.formValues[0]}`)
                              player.runCommandAsync(`scoreboard players remove @s money ${bamo}`)
                              player.runCommandAsync(`tag @s remove havemoney`)
                          }
                        })
                    } if(res.selection == 4) {
                        let brick = new ModalFormData()
                        .title("§cBuy Torch")
                        .slider("§2Select amount", 1, 64, 1, 1)
                        brick.show(player).then(res => {
                            let bamo = 5*res.formValues[0]
                          player.runCommand(`tag @s[scores={money=${bamo}..}] add havemoney`)
                          if(player.hasTag("havemoney")){
                              player.runCommandAsync(`give @s torch ${res.formValues[0]}`)
                              player.runCommandAsync(`scoreboard players remove @s money ${bamo}`)
                              player.runCommandAsync(`tag @s remove havemoney`)
                          }
                        })
                    } if(res.selection == 5) {
                        let brick = new ModalFormData()
                        .title("§cBuy Cooked Beef")
                        .slider("§2Select amount", 1, 64, 1, 1)
                        brick.show(player).then(res => {
                            let bamo = 5*res.formValues[0]
                          player.runCommand(`tag @s[scores={money=${bamo}..}] add havemoney`)
                          if(player.hasTag("havemoney")){
                              player.runCommandAsync(`give @s cooked_beef ${res.formValues[0]}`)
                              player.runCommandAsync(`scoreboard players remove @s money ${bamo}`)
                              player.runCommandAsync(`tag @s remove havemoney`)
                          }
                        })
                        
                    }
                    if(res.selection == 6) {
                        let brick = new ModalFormData()
                        .title("§cBuy Armor Stand")
                        .slider("§2Select amount", 1, 64, 1, 1)
                        brick.show(player).then(res => {
                            let bamo = 20*res.formValues[0]
                          player.runCommand(`tag @s[scores={money=${bamo}..}] add havemoney`)
                          if(player.hasTag("havemoney")){
                              player.runCommandAsync(`give @s armor_stand ${res.formValues[0]}`)
                              player.runCommandAsync(`scoreboard players remove @s money ${bamo}`)
                              player.runCommandAsync(`tag @s remove havemoney`)
                          }
                        })
                    }
                    if(res.selection == 7) {
                        let brick = new ModalFormData()
                        .title("§cBuy Sign")
                        .slider("§2Select amount", 1, 64, 1, 1)
                        brick.show(player).then(res => {
                            let bamo = 5*res.formValues[0]
                          player.runCommand(`tag @s[scores={money=${bamo}..}] add havemoney`)
                          if(player.hasTag("havemoney")){
                              player.runCommandAsync(`give @s oak_sign ${res.formValues[0]}`)
                              player.runCommandAsync(`scoreboard players remove @s money ${bamo}`)
                              player.runCommandAsync(`tag @s remove havemoney`)
                          }
                        })
                    }
                })
                }
        })
    }
})