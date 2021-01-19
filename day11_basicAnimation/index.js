import { OrbitControls } from '../lib/OrbitControls.js'

let renderer, scene, camera
let cameraControl, stats, gui
let creeperObj, plane
let rotateHeadOffset = 0,
  walkOffset = 0,
  scaleHeadOffset = 0
let startRotateHead = false
let startWalking = false
let startScaleBody = false

// 苦力怕物件
class Creeper {
  constructor() {
    // 宣告頭、身體、腳幾何體大小
    const headGeo = new THREE.BoxGeometry(4, 4, 4)
    const bodyGeo = new THREE.BoxGeometry(4, 8, 2)
    const footGeo = new THREE.BoxGeometry(2, 3, 2)

    // 苦力怕臉部貼圖
    const headMap = new THREE.TextureLoader().load(
      '../assets/img/creeper_face.png'
    )
    // 苦力怕皮膚貼圖
    const skinMap = new THREE.TextureLoader().load(
      '../assets/img/creeper.png'
    )

    // 身體與腳的材質設定
    const skinMat = new THREE.MeshPhongMaterial({
      map: skinMap // 皮膚貼圖
    })

    // 準備頭部與臉的材質
    const headMaterials = []
    for (let i = 0; i < 6; i++) {
      let map

      if (i === 4) map = headMap
      else map = skinMap

      headMaterials.push(new THREE.MeshPhongMaterial({ map: map }))
    }

    // 頭
    this.head = new THREE.Mesh(headGeo, headMaterials)
    this.head.position.set(0, 6, 0)
    // this.head.rotation.y = 0.5 // 稍微的擺頭

    // 身體
    this.body = new THREE.Mesh(bodyGeo, skinMat)
    this.body.position.set(0, 0, 0)

    // 四隻腳
    this.foot1 = new THREE.Mesh(footGeo, skinMat)
    this.foot1.position.set(-1, -5.5, 2)
    this.foot2 = this.foot1.clone()
    this.foot2.position.set(-1, -5.5, -2)
    this.foot3 = this.foot1.clone()
    this.foot3.position.set(1, -5.5, 2)
    this.foot4 = this.foot1.clone()
    this.foot4.position.set(1, -5.5, -2)

    // 將四隻腳組合為一個 group
    this.feet = new THREE.Group()
    this.feet.add(this.foot1) // 前腳左
    this.feet.add(this.foot2) // 後腳左
    this.feet.add(this.foot3) // 前腳右
    this.feet.add(this.foot4) // 後腳右

    // 將頭、身體、腳組合為一個 group
    this.creeper = new THREE.Group()
    this.creeper.add(this.head)
    this.creeper.add(this.body)
    this.creeper.add(this.feet)

    this.creeper.traverse(function(object) {
      if (object instanceof THREE.Mesh) {
        object.castShadow = true
        object.receiveShadow = true
      }
    })
  }
}

// 生成苦力怕並加到場景
function createCreeper() {
  creeperObj = new Creeper()
  scene.add(creeperObj.creeper)
}

let datGUIControls = new (function() {
  this.startRotateHead = false
  this.startWalking = false
  this.startScaleBody = false
})()

function initStats() {
  const stats = new Stats()
  stats.setMode(0)
  document.getElementById('stats').appendChild(stats.domElement)
  return stats
}

// 畫面初始化
function init() {
  scene = new THREE.Scene()

  // 相機設定
  camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  )
  camera.position.set(50, 50, 50)
  camera.lookAt(scene.position)

  let axes = new THREE.AxesHelper(20)
  scene.add(axes)

  stats = initStats()

  // 渲染器設定
  renderer = new THREE.WebGLRenderer()
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = 2 // THREE.PCFSoftShadowMap

  // 建立 OrbitControls
  cameraControl = new OrbitControls(camera, renderer.domElement)
  cameraControl.enableDamping = true // 啟用阻尼效果
  cameraControl.dampingFactor = 0.25 // 阻尼系數

  // 簡單的地板
  const planeGeometry = new THREE.PlaneGeometry(80, 80)
  const planeMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff })
  plane = new THREE.Mesh(planeGeometry, planeMaterial)
  plane.rotation.x = -0.5 * Math.PI
  plane.position.set(0, -7, 0)
  plane.receiveShadow = true
  plane.name = 'floor'
  scene.add(plane)

  // 產生苦力怕物體
  createCreeper()

  // 設置環境光提供輔助柔和白光
  let ambientLight = new THREE.AmbientLight(0x404040)
  scene.add(ambientLight)

  // 設置聚光燈幫忙照亮物體
  let spotLight = new THREE.SpotLight(0xf0f0f0)
  spotLight.position.set(-10, 30, 20)
  // spotLight.castShadow = true
  scene.add(spotLight)

  // 移動點光源
  let pointLight = new THREE.PointLight(0xccffcc, 1, 100) // 顏色, 強度, 距離
  pointLight.castShadow = true // 投影
  pointLight.position.set(-30, 30, 30)
  scene.add(pointLight)

  // dat.GUI 控制面板
  gui = new dat.GUI()
  gui.add(datGUIControls, 'startRotateHead').onChange(function(e) {
    startRotateHead = e
  })
  gui.add(datGUIControls, 'startWalking').onChange(function(e) {
    startWalking = e
  })
  gui.add(datGUIControls, 'startScaleBody').onChange(function(e) {
    startScaleBody = e
  })

  document.body.appendChild(renderer.domElement)
}

// 苦力怕擺頭
function creeperHeadRotate() {
  rotateHeadOffset += 0.04
  if (startRotateHead) {
    creeperObj.head.rotation.y = Math.sin(rotateHeadOffset)
  }
}

// 苦力怕走動
function creeperFeetWalk() {
  walkOffset += 0.04
  if (startWalking) {
    creeperObj.foot1.rotation.x = Math.sin(walkOffset) / 4 // 前腳左
    creeperObj.foot2.rotation.x = -Math.sin(walkOffset) / 4 // 後腳左
    creeperObj.foot3.rotation.x = -Math.sin(walkOffset) / 4 // 前腳右
    creeperObj.foot4.rotation.x = Math.sin(walkOffset) / 4 // 後腳右
  }
}

// 苦力怕膨脹
function creeperScaleBody() {
  scaleHeadOffset += 0.04
  if (startScaleBody) {
    let scaleRate = Math.abs(Math.sin(scaleHeadOffset)) / 16 + 1
    creeperObj.creeper.scale.set(scaleRate, scaleRate, scaleRate)
  }
}

function render() {
  stats.update()
  cameraControl.update()
  creeperHeadRotate()
  creeperFeetWalk()
  creeperScaleBody()

  requestAnimationFrame(render)
  renderer.render(scene, camera)
}

window.addEventListener('resize', function() {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
})

init()
render()
