// 苦力怕物件
class Creeper {
  constructor(sizeScale, massScale) {
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

    this.head = new THREE.Mesh(headGeo, headMaterials)
    this.head.position.set(0, 12 * sizeScale, 0)

    const headShape = new CANNON.Box(
      new CANNON.Vec3(2 * sizeScale, 2 * sizeScale, 2 * sizeScale)
    )
    this.headBody = new CANNON.Body({
      mass: 5 * massScale,
      position: new CANNON.Vec3(0, 12 * sizeScale, 0)
    })
    this.headBody.addShape(headShape)
    this.headBody.position.copy(this.head.position)

    this.body = new THREE.Mesh(bodyGeo, skinMat)
    this.body.position.set(0, 6 * sizeScale, 0)

    const bodyShape = new CANNON.Box(
      new CANNON.Vec3(2 * sizeScale, 4 * sizeScale, 1 * sizeScale)
    )
    this.bodyBody = new CANNON.Body({
      mass: 10 * massScale,
      position: new CANNON.Vec3(0, 6 * sizeScale, 0)
    })
    this.bodyBody.addShape(bodyShape)

    this.leftFrontLeg = new THREE.Mesh(footGeo, skinMat)
    this.leftFrontLeg.position.set(
      -1 * sizeScale,
      1.5 * sizeScale,
      2 * sizeScale
    )
    this.leftBackLeg = this.leftFrontLeg.clone()
    this.leftBackLeg.position.set(
      -1 * sizeScale,
      1.5 * sizeScale,
      -2 * sizeScale
    )
    this.rightFrontLeg = this.leftFrontLeg.clone()
    this.rightFrontLeg.position.set(
      1 * sizeScale,
      1.5 * sizeScale,
      2 * sizeScale
    )
    this.rightBackLeg = this.leftFrontLeg.clone()
    this.rightBackLeg.position.set(
      1 * sizeScale,
      1.5 * sizeScale,
      -2 * sizeScale
    )

    const footShape = new CANNON.Box(
      new CANNON.Vec3(1 * sizeScale, 1.5 * sizeScale, 1 * sizeScale)
    )
    this.leftFrontLegBody = new CANNON.Body({
      mass: 10 * massScale,
      position: new CANNON.Vec3(-1 * sizeScale, 1.5 * sizeScale, 2 * sizeScale)
    })
    this.leftFrontLegBody.addShape(footShape)
    this.leftBackLegBody = new CANNON.Body({
      mass: 10 * massScale,
      position: new CANNON.Vec3(-1 * sizeScale, 1.5 * sizeScale, -2 * sizeScale)
    })
    this.leftBackLegBody.addShape(footShape)
    this.rightFrontLegBody = new CANNON.Body({
      mass: 10 * massScale,
      position: new CANNON.Vec3(1 * sizeScale, 1.5 * sizeScale, 2 * sizeScale)
    })
    this.rightFrontLegBody.addShape(footShape)
    this.rightBackLegBody = new CANNON.Body({
      mass: 10 * massScale,
      position: new CANNON.Vec3(1 * sizeScale, 1.5 * sizeScale, -2 * sizeScale)
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
}
