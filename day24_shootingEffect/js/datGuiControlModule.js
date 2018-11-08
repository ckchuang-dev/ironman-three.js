// dat.GUI
let invert = 1 // 正反向
let startTracking = false
let pointLight
let sceneType = 'SNOW'

let datGUIControls = new function() {
  // this.startTracking = false
  // this.changeScene = function() {
  //   if (sceneType === 'SNOW') {
  //     material.map = rainTexture
  //     material.size = 2
  //     sceneType = 'RAIN'
  //   } else {
  //     material.map = snowTexture
  //     material.size = 5
  //     sceneType = 'SNOW'
  //   }
  // }
  // this.explosionTrigger = function() {
  //   for (let i = 0; i < scene.children.length; i++) {
  //     const object = scene.children[i]
  //     // 場景內有苦力怕才爆炸
  //     if (object.name === 'creeper') {
  //       // 清除之前爆炸粒子
  //       if (explosion) {
  //         const len = explosion.length
  //         if (len > 0) {
  //           for (let i = 0; i < len; i++) {
  //             explosion[i].destroy()
  //           }
  //         }
  //         explosion.length = 0
  //       }
  //       // 移除苦力怕
  //       scene.remove(creeperObj.creeper)
  //       // 產生爆炸
  //       explosion[0] = new Explosion(0, 0, 0, 0x000000)
  //       explosion[1] = new Explosion(5, 5, 5, 0x333333)
  //       explosion[2] = new Explosion(-5, 5, 10, 0x666666)
  //       explosion[3] = new Explosion(-5, 5, 5, 0x999999)
  //       explosion[4] = new Explosion(5, 5, -5, 0xcccccc)
  //     }
  //   }
  // }
  // this.resetCreeper = function() {
  //   scene.add(creeperObj.creeper)
  // }
}()

function initDatGUI() {
  gui = new dat.GUI()
  // gui.add(datGUIControls, 'changeScene')
  // gui.add(datGUIControls, 'startTracking').onChange(function(e) {
  //   startTracking = e
  //   if (invert > 0) {
  //     if (startTracking) {
  //       tween.start()
  //     } else {
  //       tween.stop()
  //     }
  //   } else {
  //     if (startTracking) {
  //       tweenBack.start()
  //     } else {
  //       tweenBack.stop()
  //     }
  //   }
  // })
  // gui.add(datGUIControls, 'explosionTrigger')
  // gui.add(datGUIControls, 'resetCreeper')
}
