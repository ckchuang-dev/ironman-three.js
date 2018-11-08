let tween, tweenBack
let walkSpeed = 0
let scaleHeadOffset = 0

function tweenHandler() {
  let offset = { x: 0, z: 0, rotateY: 0 }
  let target = { x: 100, z: 100, rotateY: 0.7853981633974484 } // 目標值

  // 苦力怕走動及轉身補間動畫
  const onUpdate = () => {
    // 移動
    creeperObj.feet.position.x = offset.x
    creeperObj.feet.position.z = offset.z
    creeperObj.head.position.x = offset.x
    creeperObj.head.position.z = offset.z
    creeperObj.body.position.x = offset.x
    creeperObj.body.position.z = offset.z
    pointLight.position.x = offset.x - 20
    pointLight.position.z = offset.z + 20

    // 轉身
    if (target.x > 0) {
      creeperObj.feet.rotation.y = offset.rotateY
      creeperObj.head.rotation.y = offset.rotateY
      creeperObj.body.rotation.y = offset.rotateY
    } else {
      creeperObj.feet.rotation.y = -offset.rotateY
      creeperObj.head.rotation.y = -offset.rotateY
      creeperObj.body.rotation.y = -offset.rotateY
    }
  }

  // 計算新的目標值
  const handleNewTarget = () => {
    // 限制苦力怕走路邊界
    const range = 100
    if (camera.position.x > range) target.x = range
    else if (camera.position.x < -range) target.x = -range
    else target.x = camera.position.x
    if (camera.position.z > range) target.z = range
    else if (camera.position.z < -range) target.z = -range
    else target.z = camera.position.z

    const v1 = new THREE.Vector2(0, 1) // 原點面向方向
    const v2 = new THREE.Vector2(target.x, target.z) // 苦力怕面向新相機方向

    // 內積除以純量得兩向量 cos 值
    let cosValue = v1.dot(v2) / (v1.length() * v2.length())

    // 防呆，cos 值區間為（-1, 1）
    if (cosValue > 1) cosValue = 1
    else if (cosValue < -1) cosValue = -1

    // cos 值求轉身角度
    target.rotateY = Math.acos(cosValue)
  }

  // 計算新的目標值
  const handleNewTweenBackTarget = () => {
    // 限制苦力怕走路邊界
    const range = 150
    const tmpX = target.x
    const tmpZ = target.z

    target.x = THREE.Math.randFloat(-range, range)
    target.z = THREE.Math.randFloat(-range, range)

    const v1 = new THREE.Vector2(tmpX, tmpZ)
    const v2 = new THREE.Vector2(target.x, target.z)

    // 內積除以純量得兩向量 cos 值
    let cosValue = v1.dot(v2) / (v1.length() * v2.length())

    // 防呆，cos 值區間為（-1, 1）
    if (cosValue > 1) cosValue = 1
    else if (cosValue < -1) cosValue = -1

    // cos 值求轉身角度
    target.rotateY = Math.acos(cosValue)
  }

  // 朝相機移動
  tween = new TWEEN.Tween(offset)
    .to(target, 15000)
    .easing(TWEEN.Easing.Quadratic.Out)
    .onUpdate(onUpdate)
    .onComplete(() => {
      handleNewTweenBackTarget()
      invert = -1
      tweenBack.start()
    })

  // 隨機移動
  tweenBack = new TWEEN.Tween(offset)
    .to(target, 15000)
    .easing(TWEEN.Easing.Quadratic.Out)
    .onUpdate(onUpdate)
    .onComplete(() => {
      handleNewTarget() // 計算新的目標值
      invert = 1
      tween.start()
    })
}

// 苦力怕原地走動動畫
function creeperFeetWalk() {
  walkSpeed += 0.04
  creeperObj.foot1.rotation.x = Math.sin(walkSpeed) / 4 // 前腳左
  creeperObj.foot2.rotation.x = -Math.sin(walkSpeed) / 4 // 後腳左
  creeperObj.foot3.rotation.x = -Math.sin(walkSpeed) / 4 // 前腳右
  creeperObj.foot4.rotation.x = Math.sin(walkSpeed) / 4 // 後腳左
}

// 苦力怕膨脹
function creeperScaleBody() {
  scaleHeadOffset += 0.04
  let scaleRate = Math.abs(Math.sin(scaleHeadOffset)) / 16 + 1
  creeperObj.creeper.scale.set(scaleRate, scaleRate, scaleRate)
}
