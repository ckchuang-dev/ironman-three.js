// Creeper and Three.js setting
let renderer, scene, camera
let stats, gui
let controls
let creeperObj
let explosion = []
let boxes = []
let boxMeshes = []
let ammos = []
let ammoMeshes = []

// Cannon.js
let world
let physicsMaterial
let groundBody
let sphereShape = new CANNON.Sphere(1.5)
let playerBody
const dt = 1.0 / 60.0 // seconds
let time = Date.now()
let cannonDebugRenderer

const halfExtents = new CANNON.Vec3(1, 1, 1)
const boxShape = new CANNON.Box(halfExtents)
const boxGeometry = new THREE.BoxGeometry(
  halfExtents.x * 2,
  halfExtents.y * 2,
  halfExtents.z * 2
)

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
    0.0,
    0.3
  )
  world.addContactMaterial(physicsContactMaterial)

  // 鼠標控制器剛體
  // const playerShapeVec3 = new CANNON.Vec3(1, 1, 1)
  // const playerShape = new CANNON.Box(playerShapeVec3)
  playerBody = new CANNON.Body({ mass: 5 })
  playerBody.addShape(sphereShape)
  playerBody.position.set(10, 0, 10)
  playerBody.linearDamping = 0.9
  world.addBody(playerBody)

  // cannonDebugRenderer = new THREE.CannonDebugRenderer(scene, world)
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
  let axes = new THREE.AxesHelper(20)
  scene.add(axes)
}

function createGround() {
  // 建立地板剛體
  let groundShape = new CANNON.Plane()
  // let groundCM = new CANNON.Material()
  groundBody = new CANNON.Body({
    mass: 0,
    shape: groundShape,
    material: physicsMaterial
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
  creeperObj = new Creeper(3, 1)
  // tweenHandler()
  scene.add(creeperObj.creeper)
  world.addBody(creeperObj.headBody)
  world.addBody(creeperObj.bodyBody)
  world.addBody(creeperObj.leftFrontLegBody)
  world.addBody(creeperObj.leftBackLegBody)
  world.addBody(creeperObj.rightFrontLegBody)
  world.addBody(creeperObj.rightBackLegBody)
  world.addConstraint(creeperObj.neckJoint)
  world.addConstraint(creeperObj.leftFrontKneeJoint)
  world.addConstraint(creeperObj.leftBackKneeJoint)
  world.addConstraint(creeperObj.rightFrontKneeJoint)
  world.addConstraint(creeperObj.rightBackKneeJoint)
}

function createBoxes(count) {
  // Add boxes
  for (let i = 0; i < count; i++) {
    const x = (Math.random() - 0.5) * 60
    const y = 10 + (Math.random() - 0.5) * 1
    const z = (Math.random() - 0.5) * 60
    const boxBody = new CANNON.Body({ mass: 5, material: physicsMaterial })
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
  createBoxes(20)
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
  // 取得滑鼠在網頁上 (x, y) 位置
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1

  // 透過 raycaster 取得目前玩家朝向方向
  raycaster.setFromCamera(mouse, camera)

  // 取得 raycaster 方向並決定發射方向
  targetVec.copy(raycaster.ray.direction)
}

// shooting event
window.addEventListener('click', function(e) {
  if (controls.enabled == true) {
    let ammoShape
    let ammoGeometry
    let ammoMass
    let ammoColor
    switch (e.which) {
      case 1: // 左鍵射擊
        ammoShape = ballShape
        ammoGeometry = ballGeometry
        ammoMass = 20
        ammoColor = 0x93882f
        break
      case 3: // 右鍵疊磚
        ammoShape = boxShape
        ammoGeometry = boxGeometry
        ammoMass = 50
        ammoColor = 0x0f0201
      default:
        break
    }

    // 取得目前玩家位置
    let x = playerBody.position.x
    let y = playerBody.position.y
    let z = playerBody.position.z

    // 子彈剛體與網格
    const ammoBody = new CANNON.Body({ mass: ammoMass })
    ammoBody.addShape(ammoShape)
    const ammoMaterial = new THREE.MeshStandardMaterial({ color: ammoColor })
    const ammoMesh = new THREE.Mesh(ammoGeometry, ammoMaterial)
    world.addBody(ammoBody)
    scene.add(ammoMesh)
    ammoMesh.castShadow = true
    ammoMesh.receiveShadow = true
    ammos.push(ammoBody)
    ammoMeshes.push(ammoMesh)
    getShootDir(e, shootDirection)
    ammoBody.velocity.set(
      shootDirection.x * shootVelo,
      shootDirection.y * shootVelo,
      shootDirection.z * shootVelo
    )
    // Move the ball outside the player sphere
    x += shootDirection.x * (sphereShape.radius * 1.02 + ballShape.radius)
    y += shootDirection.y * (sphereShape.radius * 1.02 + ballShape.radius)
    z += shootDirection.z * (sphereShape.radius * 1.02 + ballShape.radius)
    ammoBody.position.set(x, y, z)
    ammoMesh.position.set(x, y, z)
  }
})

function render() {
  requestAnimationFrame(render)
  stats.update()
  // pointsSceneAnimation()

  if (controls.enabled) {
    world.step(dt)
    // cannonDebugRenderer.update() // Update the debug renderer
    // Update box mesh positions
    for (let i = 0; i < boxes.length; i++) {
      boxMeshes[i].position.copy(boxes[i].position)
      boxMeshes[i].quaternion.copy(boxes[i].quaternion)
    }
    // Update shooting ball positions
    for (let i = 0; i < ammos.length; i++) {
      ammoMeshes[i].position.copy(ammos[i].position)
      ammoMeshes[i].quaternion.copy(ammos[i].quaternion)
    }
    creeperObj.head.position.copy(creeperObj.headBody.position)
    creeperObj.head.quaternion.copy(creeperObj.headBody.quaternion)
    creeperObj.body.position.copy(creeperObj.bodyBody.position)
    creeperObj.body.quaternion.copy(creeperObj.bodyBody.quaternion)
    creeperObj.leftFrontLeg.position.copy(creeperObj.leftFrontLegBody.position)
    creeperObj.leftFrontLeg.quaternion.copy(
      creeperObj.leftFrontLegBody.quaternion
    )
    creeperObj.leftBackLeg.position.copy(creeperObj.leftBackLegBody.position)
    creeperObj.leftBackLeg.quaternion.copy(
      creeperObj.leftBackLegBody.quaternion
    )
    creeperObj.rightFrontLeg.position.copy(
      creeperObj.rightFrontLegBody.position
    )
    creeperObj.rightFrontLeg.quaternion.copy(
      creeperObj.rightFrontLegBody.quaternion
    )
    creeperObj.rightBackLeg.position.copy(creeperObj.rightBackLegBody.position)
    creeperObj.rightBackLeg.quaternion.copy(
      creeperObj.rightBackLegBody.quaternion
    )
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
