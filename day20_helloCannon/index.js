// Three.js basic setting
let renderer, scene, camera
let cameraControl, stats, gui

function initStats() {
  const stats = new Stats()
  stats.setMode(0)
  document.getElementById('stats').appendChild(stats.domElement)
  return stats
}

let controls = new function() {
  this.resetBall = function() {
    sphereBody.position.set(0, 10, 0)
  }
}()

function initThreeSetting() {
  scene = new THREE.Scene()

  camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  )
  camera.position.set(20, 20, 20)
  camera.lookAt(scene.position)

  let axes = new THREE.AxesHelper(20)
  scene.add(axes)

  cameraControl = new THREE.OrbitControls(camera)

  stats = initStats()

  gui = new dat.GUI()
  gui.add(controls, 'resetBall')

  renderer = new THREE.WebGLRenderer()
  renderer.setClearColor(0xeeeeee, 1.0)
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = 2
  renderer.setSize(window.innerWidth, window.innerHeight)

  let ambientLight = new THREE.AmbientLight(0x404040)
  scene.add(ambientLight)
  let spotLight = new THREE.SpotLight(0x999999)
  spotLight.position.set(-10, 30, 20)
  scene.add(spotLight)
  let pointLight = new THREE.PointLight(0xccffcc, 1, 100)
  pointLight.castShadow = true
  pointLight.position.set(-30, 30, 30)
  scene.add(pointLight)

  document.body.appendChild(renderer.domElement)
}

// Cannon.js
let world
let sphereBody
let sphere

function initCannonWorld() {
  // 建立世界
  world = new CANNON.World()

  // 設定重力場為 -y 軸 10 m/s²
  world.gravity.set(0, -10, 0)

  // 碰撞偵測
  world.broadphase = new CANNON.NaiveBroadphase()

  // 建立地板剛體
  let groundShape = new CANNON.Plane()
  let groundBody = new CANNON.Body({
    mass: 0,
    shape: groundShape
  })
  // setFromAxisAngle 旋轉 x 軸 -90 度
  groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2)
  world.add(groundBody)

  // 建立球剛體
  let sphereShape = new CANNON.Sphere(1) // Step 1
  sphereBody = new CANNON.Body({
    mass: 5,
    position: new CANNON.Vec3(0, 10, 0),
    shape: sphereShape
  })
  world.add(sphereBody)

  // 地板網格
  let groundGeometry = new THREE.PlaneGeometry(20, 20, 32)
  let groundMaterial = new THREE.MeshLambertMaterial({
    color: 0xa5a5a5,
    side: THREE.DoubleSide
  })
  let ground = new THREE.Mesh(groundGeometry, groundMaterial)
  ground.rotation.x = -Math.PI / 2
  ground.receiveShadow = true
  scene.add(ground)

  // 球網格
  let sphereGeometry = new THREE.SphereGeometry(1, 32, 32)
  let sphereMaterial = new THREE.MeshStandardMaterial({ color: 0x33aaaa })
  sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
  sphere.castShadow = true
  scene.add(sphere)
}

const timeStep = 1.0 / 60.0 // seconds

function render() {
  world.step(timeStep)
  if (sphere) {
    sphere.position.copy(sphereBody.position)
    sphere.quaternion.copy(sphereBody.quaternion)
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

initThreeSetting()
initCannonWorld()
render()
