// 苦力怕物件
class Creeper {
  constructor() {
    const headGeo = new THREE.BoxGeometry(4, 4, 4)
    const bodyGeo = new THREE.BoxGeometry(4, 8, 2)
    const footGeo = new THREE.BoxGeometry(2, 3, 2)

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
    this.head.position.set(0, 12, 0)

    this.body = new THREE.Mesh(bodyGeo, skinMat)
    this.body.position.set(0, 6, 0)

    this.foot1 = new THREE.Mesh(footGeo, skinMat)
    this.foot1.position.set(-1, 1.5, 2)
    this.foot2 = this.foot1.clone()
    this.foot2.position.set(-1, 1.5, -2)
    this.foot3 = this.foot1.clone()
    this.foot3.position.set(1, 1.5, 2)
    this.foot4 = this.foot1.clone()
    this.foot4.position.set(1, 1.5, -2)

    // const halfExtents = new CANNON.Vec3(1, 1.5, 1)
    // const boxShape = new CANNON.Box(halfExtents)
    // this.foot1_body = new CANNON.Body({ mass: 15 })
    // this.foot1_body.addShape(boxShape)
    // this.foot1_body.position.set(-1, 1.5, 2)

    this.feet = new THREE.Group()
    this.feet.add(this.foot1) // 前腳左
    this.feet.add(this.foot2) // 後腳左
    this.feet.add(this.foot3) // 前腳右
    this.feet.add(this.foot4) // 後腳右

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
