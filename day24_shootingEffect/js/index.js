// Creeper and Three.js setting
let renderer, scene, camera
let stats, gui
let controls
let creeperObj
let explosion = []
let boxes = []
let boxMeshes = []
let balls = []
let ballMeshes = []

// Cannon.js
let world
let physicsMaterial
let groundBody
let sphereShape, sphereBody
const dt = 1.0 / 60.0 // seconds
let time = Date.now()

function initCannon() {
  // 初始化 cannon.js、重力、碰撞偵測
  world = new CANNON.World()
  world.gravity.set(0, -20, 0)
  world.broadphase = new CANNON.NaiveBroadphase()

  // 解算器設定
  const solver = new CANNON.GSSolver()
  solver.iterations = 7
  solver.tolerance = 0.1
  const split = true
  if (split) world.solver = new CANNON.SplitSolver(solver)
  else world.solver = solver

  // 接觸材質相關設定（摩擦力、恢復係數）
  world.defaultContactMaterial.contactEquationStiffness = 1e9
  world.defaultContactMaterial.contactEquationRelaxation = 4
  physicsMaterial = new CANNON.Material('slipperyMaterial')
  const physicsContactMaterial = new CANNON.ContactMaterial(
    physicsMaterial,
    physicsMaterial,
    0.0, // 摩擦力
    0.3 // 恢復係數
  )
  world.addContactMaterial(physicsContactMaterial)

  // 鼠標控制器剛體
  sphereShape = new CANNON.Sphere(1.5)
  sphereBody = new CANNON.Body({ mass: 5 })
  sphereBody.addShape(sphereShape)
  sphereBody.position.set(0, 5, 0)
  sphereBody.linearDamping = 0.9
  world.addBody(sphereBody)
}

function initStats() {
  const stats = new Stats()
  stats.setMode(0)
  document.getElementById('stats').appendChild(stats.domElement)
  return stats
}

function initScene() {
  scene = new THREE.Scene()
  scene.fog = new THREE.FogExp2(0x000000, 0.0008)
}

function initCamera() {
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  )
  // camera.position.set(20, 20, 20)
  // camera.lookAt(scene.position)
}

function initRenderer() {
  renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setClearColor(0x80adfc, 1.0)
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = 2 // THREE.PCFSoftShadowMap
}

function initLight() {
  // 設置環境光提供輔助柔和白光
  let ambientLight = new THREE.AmbientLight(0x404040)
  scene.add(ambientLight)

  // 點光源
  pointLight = new THREE.PointLight(0xf0f0f0, 1, 100) // 顏色, 強度, 距離
  pointLight.castShadow = true // 投影
  pointLight.position.set(-30, 30, 30)
  // scene.add(pointLight)
  light = new THREE.SpotLight(0xffffff)
  light.position.set(10, 30, 20)
  light.target.position.set(0, 0, 0)
  if (true) {
    light.castShadow = true
    light.shadow.camera.near = 20
    light.shadow.camera.far = 50 //camera.far;
    light.shadow.camera.fov = 40
    light.shadowMapBias = 0.1
    light.shadowMapDarkness = 0.7
    light.shadow.mapSize.width = 2 * 512
    light.shadow.mapSize.height = 2 * 512
    //light.shadowCameraVisible = true;
  }
  scene.add(light)
}

function initHelper() {
  // let axes = new THREE.AxesHelper(20)
  // scene.add(axes)
}

function createGround() {
  // 建立地板剛體
  let groundShape = new CANNON.Plane()
  let groundCM = new CANNON.Material()
  groundBody = new CANNON.Body({
    mass: 0,
    shape: groundShape,
    material: groundCM
  })
  // setFromAxisAngle 旋轉 x 軸 -90 度
  groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2)
  world.add(groundBody)

  const groundGeometry = new THREE.PlaneGeometry(300, 300, 50, 50)
  const groundMaterial = new THREE.MeshLambertMaterial({ color: 0xa5a5a5 })
  let ground = new THREE.Mesh(groundGeometry, groundMaterial)
  ground.rotation.x = -Math.PI / 2
  ground.receiveShadow = true
  ground.name = 'floor'
  scene.add(ground)
}

function createCreeper() {
  creeperObj = new Creeper()
  // tweenHandler()
  creeperObj.creeper.position.set(10, 0, 0)
  scene.add(creeperObj.creeper)
}

function createBoxes(count) {
  // Add boxes
  const halfExtents = new CANNON.Vec3(1, 1, 1)
  const boxShape = new CANNON.Box(halfExtents)
  const boxGeometry = new THREE.BoxGeometry(
    halfExtents.x * 2,
    halfExtents.y * 2,
    halfExtents.z * 2
  )

  for (let i = 0; i < count; i++) {
    const x = (Math.random() - 0.5) * 30
    const y = 10 + (Math.random() - 0.5) * 1
    const z = (Math.random() - 0.5) * 30
    const boxBody = new CANNON.Body({ mass: 5 })
    boxBody.addShape(boxShape)
    const boxMaterial = new THREE.MeshLambertMaterial({
      color: Math.random() * 0xffffff
    })
    const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial)
    world.addBody(boxBody)
    scene.add(boxMesh)
    boxBody.position.set(x, y, z)
    boxMesh.position.set(x, y, z)
    boxMesh.castShadow = true
    boxMesh.receiveShadow = true
    boxes.push(boxBody)
    boxMeshes.push(boxMesh)
  }
}

// Three.js init setting
function init() {
  initCannon()
  initScene()
  initCamera()
  initPointerLockControls()
  initRenderer()
  initLight()
  initHelper()
  // initDatGUI()
  stats = initStats()

  createGround()
  createCreeper()
  createBoxes(30)
  // createPointsScene()

  document.body.appendChild(renderer.domElement)
}

// shooting related settings
const ballShape = new CANNON.Sphere(0.2)
const ballGeometry = new THREE.SphereGeometry(ballShape.radius, 32, 32)
let shootDirection = new THREE.Vector3()
const shootVelo = 15
let raycaster = new THREE.Raycaster() // create once
let mouse = new THREE.Vector2() // create once

function getShootDir(event, targetVec) {
  // calculate mouse position in normalized device coordinates
  // (-1 to +1) for both components
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1
  // update the picking ray with the camera and mouse position
  raycaster.setFromCamera(mouse, camera)
  targetVec.copy(raycaster.ray.direction)
}

// shooting event
window.addEventListener('click', function(e) {
  if (controls.enabled == true) {
    let x = sphereBody.position.x
    let y = sphereBody.position.y
    let z = sphereBody.position.z
    const ballBody = new CANNON.Body({ mass: 1 })
    ballBody.addShape(ballShape)
    const ballMaterial = new THREE.MeshLambertMaterial({ color: 0xffddff })
    const ballMesh = new THREE.Mesh(ballGeometry, ballMaterial)
    world.addBody(ballBody)
    scene.add(ballMesh)
    ballMesh.castShadow = true
    ballMesh.receiveShadow = true
    balls.push(ballBody)
    ballMeshes.push(ballMesh)
    getShootDir(e, shootDirection)
    ballBody.velocity.set(
      shootDirection.x * shootVelo,
      shootDirection.y * shootVelo,
      shootDirection.z * shootVelo
    )
    // Move the ball outside the player sphere
    x += shootDirection.x * (sphereShape.radius * 1.02 + ballShape.radius)
    y += shootDirection.y * (sphereShape.radius * 1.02 + ballShape.radius)
    z += shootDirection.z * (sphereShape.radius * 1.02 + ballShape.radius)
    ballBody.position.set(x, y, z)
    ballMesh.position.set(x, y, z)
  }
})

function render() {
  requestAnimationFrame(render)
  stats.update()
  // pointsSceneAnimation()

  if (controls.enabled) {
    world.step(dt)
    // Update box mesh positions
    for (let i = 0; i < boxes.length; i++) {
      boxMeshes[i].position.copy(boxes[i].position)
      boxMeshes[i].quaternion.copy(boxes[i].quaternion)
    }
    // Update shooting ball positions
    for (let i = 0; i < balls.length; i++) {
      ballMeshes[i].position.copy(balls[i].position)
      ballMeshes[i].quaternion.copy(balls[i].quaternion)
    }
  }
  controls.update(Date.now() - time)
  time = Date.now()

  // creeperFeetWalk()
  // TWEEN.update()
  // explosion
  // if (explosion) {
  //   const len = explosion.length
  //   if (len > 0) {
  //     for (let i = 0; i < len; i++) {
  //       explosion[i].update()
  //     }
  //   }
  // }

  renderer.render(scene, camera)
}

window.addEventListener('resize', function() {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
})

init()
render()
