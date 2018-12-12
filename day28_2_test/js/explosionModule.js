class Explosion {
  constructor(x, y, z, color) {
    const geometry = new THREE.Geometry()

    const smokeTexture = new THREE.TextureLoader().load('./img/smoke.png')
    this.material = new THREE.PointsMaterial({
      size: 10,
      color: color,
      map: smokeTexture,
      blending: THREE.CustomBlending,
      depthWrite: false,
      transparent: true,
      opacity: 0.7
    })

    this.pCount = 1000
    this.movementSpeed = 10
    this.dirs = []

    for (let i = 0; i < this.pCount; i++) {
      const vertex = new THREE.Vector3(x, y, z)
      geometry.vertices.push(vertex)
      const r = this.movementSpeed * THREE.Math.randFloat(0, 1) + 0.5
      const theta = Math.random() * Math.PI * 2
      const phi = Math.random() * Math.PI
      this.dirs.push({
        x: r * Math.sin(phi) * Math.cos(theta),
        y: r * Math.sin(phi) * Math.sin(theta),
        z: r * Math.cos(phi)
      })
    }

    let points = new THREE.Points(geometry, this.material)

    this.object = points

    scene.add(this.object)
  }

  update() {
    let p = this.pCount
    const d = this.dirs
    while (p--) {
      let particle = this.object.geometry.vertices[p]
      particle.x += d[p].x
      particle.y += d[p].y
      particle.z += d[p].z
    }
    this.object.geometry.verticesNeedUpdate = true
  }

  destroy() {
    this.object.geometry.dispose()
    scene.remove(this.object)
    // console.log(renderer.info)
    this.dirs.length = 0
  }
}
