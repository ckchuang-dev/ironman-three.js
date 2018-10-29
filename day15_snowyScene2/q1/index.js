let renderer, scene, camera
let cameraControl, stats, points
let material

function initStats() {
  const stats = new Stats()
  stats.setMode(0)
  document.getElementById('stats').appendChild(stats.domElement)
  return stats
}

function createPoints() {
  const geometry = new THREE.Geometry()
  const texture = new THREE.TextureLoader().load('../snowflake.png')
  material = new THREE.PointsMaterial({
    size: 5,
    map: texture,
    blending: THREE.AdditiveBlending,
    depthTest: false,
    transparent: true
  })
  // material.color.setHSL(1.0, 0.3, 0.7)

  const range = 500
  for (let i = 0; i < 15000; i++) {
    const particle = new THREE.Vector3(
      Math.random() * range - range / 2,
      Math.random() * range - range / 2,
      Math.random() * range - range / 2
    )
    geometry.vertices.push(particle)
  }

  points = new THREE.Points(geometry, material)
  scene.add(points)
}

function init() {
  // scene
  scene = new THREE.Scene()
  scene.fog = new THREE.FogExp2(0x000000, 0.0008)

  // camera
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    1,
    2000
  )
  camera.position.set(0, 0, 100)
  camera.lookAt(scene.position)

  // OrbitControls
  cameraControl = new THREE.OrbitControls(camera)
  cameraControl.enableDamping = true
  cameraControl.dampingFactor = 0.25

  // stats
  stats = initStats()

  let axes = new THREE.AxesHelper(20)
  scene.add(axes)

  // renderer
  renderer = new THREE.WebGLRenderer()
  renderer.setSize(window.innerWidth, window.innerHeight)

  createPoints()

  document.body.appendChild(renderer.domElement)
}

function render() {
  // const time = Date.now() * 0.00005
  // const h = ((360 * (1.0 + time)) % 360) / 360
  // material.color.setHSL(h, 0.5, 0.5)

  for (let i = 0; i < scene.children.length; i++) {
    var object = scene.children[i]
    if (object instanceof THREE.Points) {
      object.position.y -= 0.5
      if (object.position.y < 0) {
        object.position.y = 100
      }
    }
  }

  stats.update()
  requestAnimationFrame(render)
  cameraControl.update()
  renderer.render(scene, camera)
}

window.addEventListener('resize', function() {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
})

init()
render()
