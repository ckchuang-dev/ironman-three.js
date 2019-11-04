let renderer, scene, camera
let cameraControl, stats, gui

// points
const pointCount = 10000
const movementSpeed = 20
let explosion
let size = 20
const textureLoader = new THREE.TextureLoader()
const smokeTexture = textureLoader.load('./smoke.png')

function initStats() {
  const stats = new Stats()
  stats.setMode(0)
  document.getElementById('stats').appendChild(stats.domElement)
  return stats
}

// dat.GUI
let controls = new (function() {
  this.explosionTrigger = function() {
    if (explosion) {
      explosion.destroy()
    }
    explosion = new Explosion(0, 0)
  }
  this.pointSize = 20
  this.cameraNear = 500
  // this.pointCount = 1000
})()

// 建立粒子系統
class Explosion {
  constructor(x, y) {
    const geometry = new THREE.Geometry()

    this.material = new THREE.PointsMaterial({
      size: size,
      color: new THREE.Color(Math.random() * 0xffffff),
      map: smokeTexture,
      blending: THREE.AdditiveBlending,
      depthTest: false
      // transparent: true,
      // opacity: 0.7
    })

    this.pCount = pointCount
    this.movementSpeed = movementSpeed
    this.dirs = []

    for (let i = 0; i < this.pCount; i++) {
      const vertex = new THREE.Vector3(x, y, 0) // 每個頂點起點都在爆炸起源點
      geometry.vertices.push(vertex)
      const r = this.movementSpeed * THREE.Math.randFloat(0, 1) + 2
      // 噴射方向隨機 -> 不規則球體
      const theta = Math.random() * Math.PI * 2
      const phi = Math.random() * Math.PI
      this.dirs.push({
        x: r * Math.sin(phi) * Math.cos(theta),
        y: r * Math.sin(phi) * Math.sin(theta),
        z: r * Math.cos(phi)
      })
      // 噴射方向隨機 -> 正方體
      // this.dirs.push({
      //   x: Math.random() * r - r / 2,
      //   y: Math.random() * r - r / 2,
      //   z: Math.random() * r - r / 2
      // })
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
      // 每個頂點往自己噴射方向一直移動，會漸漸淡出是也可見範圍，但他仍一直在運動
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

function init() {
  // scene
  scene = new THREE.Scene()
  scene.fog = new THREE.FogExp2(0x000000, 0.0008)

  // camera
  camera = new THREE.PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight,
    500,
    5000
  )
  camera.position.set(0, 0, 1000)
  camera.lookAt(scene.position)

  // stats
  stats = initStats()

  // let axes = new THREE.AxesHelper(20)
  // scene.add(axes)

  // renderer
  renderer = new THREE.WebGLRenderer()
  // renderer.setClearColor(0xcccccc, 1.0)
  renderer.setSize(window.innerWidth, window.innerHeight)

  // OrbitControls
  // cameraControl = new THREE.OrbitControls(camera, renderer.domElement)
  // cameraControl.enableDamping = true
  // cameraControl.dampingFactor = 0.25

  // explosion = new Explosion(0, 0)

  // dat.GUI
  gui = new dat.GUI()
  gui.add(controls, 'explosionTrigger')
  gui.add(controls, 'pointSize', 10, 200).onChange(e => {
    size = e
  })
  gui.add(controls, 'cameraNear', 1, 1000).onChange(near => {
    camera = new THREE.PerspectiveCamera(
      70,
      window.innerWidth / window.innerHeight,
      near,
      5000
    )
    camera.position.set(0, 0, 1000)
    camera.lookAt(scene.position)
  })
  // gui.add(controls, 'pointCount', 100, 10000).onChange(e => {
  //   explosion.destroy()
  //   pointCount = e
  //   explosion = new Explosion(0, 0)
  // })

  document.body.appendChild(renderer.domElement)
}

function render() {
  if (explosion) {
    explosion.update()
  }

  stats.update()
  requestAnimationFrame(render)
  // cameraControl.update()
  renderer.render(scene, camera)
}

window.addEventListener('resize', function() {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
})

init()
render()
