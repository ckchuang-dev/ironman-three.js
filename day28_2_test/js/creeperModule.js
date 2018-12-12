// 苦力怕物件
class Creeper {
  constructor(sizeScale, massScale, creeperPosition) {
    const headGeo = new THREE.BoxGeometry(
      4 * sizeScale,
      4 * sizeScale,
      4 * sizeScale
    )
    const bodyGeo = new THREE.BoxGeometry(
      4 * sizeScale,
      8 * sizeScale,
      2 * sizeScale
    )
    const footGeo = new THREE.BoxGeometry(
      2 * sizeScale,
      3 * sizeScale,
      2 * sizeScale
    )

    const textureLoader = new THREE.TextureLoader()
    const headMap = textureLoader.load('./img/creeper_face.png')
    const skinMap = textureLoader.load('./img/creeper_skin.png')

    const skinMat = new THREE.MeshPhongMaterial({
      map: skinMap
    })

    const headMaterials = []
    for (let i = 0; i < 6; i++) {
      let map

      if (i === 4) map = headMap
      else map = skinMap

      headMaterials.push(new THREE.MeshPhongMaterial({ map: map }))
    }

    const creeperPositionX = creeperPosition[0]
    const creeperPositionZ = creeperPosition[1]

    this.head = new THREE.Mesh(headGeo, headMaterials)
    this.head.position.set(creeperPositionX, 12 * sizeScale, creeperPositionZ)

    const headShape = new CANNON.Box(
      new CANNON.Vec3(2 * sizeScale, 2 * sizeScale, 2 * sizeScale)
    )
    this.headBody = new CANNON.Body({
      mass: 5 * massScale,
      position: new CANNON.Vec3(
        creeperPositionX,
        12 * sizeScale,
        creeperPositionZ
      )
    })
    this.headBody.addShape(headShape)

    this.body = new THREE.Mesh(bodyGeo, skinMat)
    this.body.position.set(creeperPositionX, 6 * sizeScale, creeperPositionZ)

    const bodyShape = new CANNON.Box(
      new CANNON.Vec3(2 * sizeScale, 4 * sizeScale, 1 * sizeScale)
    )
    this.bodyBody = new CANNON.Body({
      mass: 10 * massScale,
      position: new CANNON.Vec3(
        creeperPositionX,
        6 * sizeScale,
        creeperPositionZ
      )
    })
    this.bodyBody.addShape(bodyShape)

    this.leftFrontLeg = new THREE.Mesh(footGeo, skinMat)
    this.leftFrontLeg.position.set(
      -1 * sizeScale + creeperPositionX,
      1.5 * sizeScale,
      2 * sizeScale + creeperPositionZ
    )
    this.leftBackLeg = this.leftFrontLeg.clone()
    this.leftBackLeg.position.set(
      -1 * sizeScale + creeperPositionX,
      1.5 * sizeScale,
      -2 * sizeScale + creeperPositionZ
    )
    this.rightFrontLeg = this.leftFrontLeg.clone()
    this.rightFrontLeg.position.set(
      1 * sizeScale + creeperPositionX,
      1.5 * sizeScale,
      2 * sizeScale + creeperPositionZ
    )
    this.rightBackLeg = this.leftFrontLeg.clone()
    this.rightBackLeg.position.set(
      1 * sizeScale + creeperPositionX,
      1.5 * sizeScale,
      -2 * sizeScale + creeperPositionZ
    )

    const footShape = new CANNON.Box(
      new CANNON.Vec3(1 * sizeScale, 1.5 * sizeScale, 1 * sizeScale)
    )
    this.leftFrontLegBody = new CANNON.Body({
      mass: 10 * massScale,
      position: new CANNON.Vec3(
        -1 * sizeScale + creeperPositionX,
        1.5 * sizeScale,
        2 * sizeScale + creeperPositionZ
      )
    })
    this.leftFrontLegBody.addShape(footShape)
    this.leftBackLegBody = new CANNON.Body({
      mass: 10 * massScale,
      position: new CANNON.Vec3(
        -1 * sizeScale + creeperPositionX,
        1.5 * sizeScale,
        -2 * sizeScale + creeperPositionZ
      )
    })
    this.leftBackLegBody.addShape(footShape)
    this.rightFrontLegBody = new CANNON.Body({
      mass: 10 * massScale,
      position: new CANNON.Vec3(
        1 * sizeScale + creeperPositionX,
        1.5 * sizeScale,
        2 * sizeScale + creeperPositionZ
      )
    })
    this.rightFrontLegBody.addShape(footShape)
    this.rightBackLegBody = new CANNON.Body({
      mass: 10 * massScale,
      position: new CANNON.Vec3(
        1 * sizeScale + creeperPositionX,
        1.5 * sizeScale,
        -2 * sizeScale + creeperPositionZ
      )
    })
    this.rightBackLegBody.addShape(footShape)

    // Neck joint
    this.neckJoint = new CANNON.LockConstraint(this.headBody, this.bodyBody)

    // Knee joint
    this.leftFrontKneeJoint = new CANNON.LockConstraint(
      this.bodyBody,
      this.leftFrontLegBody
    )
    this.leftBackKneeJoint = new CANNON.LockConstraint(
      this.bodyBody,
      this.leftBackLegBody
    )
    this.rightFrontKneeJoint = new CANNON.LockConstraint(
      this.bodyBody,
      this.rightFrontLegBody
    )
    this.rightBackKneeJoint = new CANNON.LockConstraint(
      this.bodyBody,
      this.rightBackLegBody
    )

    this.isKnockOut = false
    this.walkSpeed = 0
    this.scaleHeadOffset = 0
    this.tween
    this.tweenBack

    this.feet = new THREE.Group()
    this.feet.add(this.leftFrontLeg) // 前腳左
    this.feet.add(this.leftBackLeg) // 後腳左
    this.feet.add(this.rightFrontLeg) // 前腳右
    this.feet.add(this.rightBackLeg) // 後腳右

    this.creeper = new THREE.Group()
    this.creeper.add(this.head)
    this.creeper.add(this.body)
    this.creeper.add(this.feet)
    this.creeper.name = 'creeper'

    this.creeper.traverse(function(object) {
      if (object instanceof THREE.Mesh) {
        object.castShadow = true
        object.receiveShadow = true
      }
    })
  }

  updateMesh() {
    this.head.position.copy(this.headBody.position)
    this.head.quaternion.copy(this.headBody.quaternion)
    this.body.position.copy(this.bodyBody.position)
    this.body.quaternion.copy(this.bodyBody.quaternion)
    this.leftFrontLeg.position.copy(this.leftFrontLegBody.position)
    this.leftFrontLeg.quaternion.copy(this.leftFrontLegBody.quaternion)
    this.leftBackLeg.position.copy(this.leftBackLegBody.position)
    this.leftBackLeg.quaternion.copy(this.leftBackLegBody.quaternion)
    this.rightFrontLeg.position.copy(this.rightFrontLegBody.position)
    this.rightFrontLeg.quaternion.copy(this.rightFrontLegBody.quaternion)
    this.rightBackLeg.position.copy(this.rightBackLegBody.position)
    this.rightBackLeg.quaternion.copy(this.rightBackLegBody.quaternion)
  }

  tweenHandler() {
    let offset = { x: 0, z: 0, rotateY: 0 }
    let target = { x: 100, z: 100, rotateY: 0.7853981633974484 } // 目標值

    // 苦力怕走動及轉身補間動畫
    const onUpdate = () => {
      // 移動
      this.feet.position.x = offset.x
      this.feet.position.z = offset.z
      this.head.position.x = offset.x
      this.head.position.z = offset.z
      this.body.position.x = offset.x
      this.body.position.z = offset.z
      pointLight.position.x = offset.x - 20
      pointLight.position.z = offset.z + 20

      // 轉身
      if (target.x > 0) {
        this.feet.rotation.y = offset.rotateY
        this.head.rotation.y = offset.rotateY
        this.body.rotation.y = offset.rotateY
      } else {
        this.feet.rotation.y = -offset.rotateY
        this.head.rotation.y = -offset.rotateY
        this.body.rotation.y = -offset.rotateY
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
    this.tween = new TWEEN.Tween(offset)
      .to(target, 15000)
      .easing(TWEEN.Easing.Quadratic.Out)
      .onUpdate(onUpdate)
      .onComplete(() => {
        handleNewTweenBackTarget()
        this.tweenBack.start()
      })

    // 隨機移動
    this.tweenBack = new TWEEN.Tween(offset)
      .to(target, 15000)
      .easing(TWEEN.Easing.Quadratic.Out)
      .onUpdate(onUpdate)
      .onComplete(() => {
        handleNewTarget() // 計算新的目標值
        this.tween.start()
      })
  }

  creeperFeetWalk() {
    this.walkSpeed += 0.04
    this.leftFrontLeg.rotation.x = Math.sin(this.walkSpeed) / 4
    this.leftBackLeg.rotation.x = -Math.sin(this.walkSpeed) / 4
    this.rightFrontLeg.rotation.x = -Math.sin(this.walkSpeed) / 4
    this.rightBackLeg.rotation.x = Math.sin(this.walkSpeed) / 4
  }

  creeperScaleBody() {
    this.scaleHeadOffset += 0.04
    let scaleRate = Math.abs(Math.sin(this.scaleHeadOffset)) / 16 + 1
    this.creeper.scale.set(scaleRate, scaleRate, scaleRate)
  }
}
