import { OrbitControls } from '../lib/OrbitControls.js'

let renderer, scene, camera
let cameraControl, stats, gui
let creeperObj, plane
let rotateHeadOffset = 0,
  walkOffset = 0,
  scaleHeadOffset = 0
const textureLoader = new THREE.TextureLoader()

// points
const pointCount = 1000
// const movementSpeed = 0.000000001
const movementSpeed = 10
let explosion = []
let size = 10
const smokeTexture = textureLoader.load('./smoke.png')

class Explosion {
  constructor(x, y, z, color) {
    const geometry = new THREE.Geometry()

    this.material = new THREE.PointsMaterial({
      size: size,
      color: color,
      map: smokeTexture,
      blending: THREE.CustomBlending,
      depthWrite: false,
      transparent: true,
      opacity: 0.7
    })

    this.pCount = pointCount
    this.movementSpeed = movementSpeed
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

// 苦力怕物件
class Creeper {
  constructor() {
    // 宣告頭、身體、腳幾何體大小
    const headGeo = new THREE.BoxGeometry(4, 4, 4)
    const bodyGeo = new THREE.BoxGeometry(4, 8, 2)
    const footGeo = new THREE.BoxGeometry(2, 3, 2)

    const headMap = textureLoader.load('../assets/img/creeper_face.png')
    const skinMap = textureLoader.load('../assets/img/creeper.png')

    const skinMat = new THREE.MeshPhongMaterial({
      map: skinMap // 皮膚貼圖
    })

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
    this.creeper.name = 'creeper'

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
  this.explosionTrigger = function() {
    for (let i = 0; i < scene.children.length; i++) {
      const object = scene.children[i]

      // 場景內有苦力怕才爆炸
      if (object.name === 'creeper') {
        // 清除之前爆炸粒子
        if (explosion) {
          const len = explosion.length
          if (len > 0) {
            for (let i = 0; i < len; i++) {
              explosion[i].destroy()
            }
          }
          explosion.length = 0
        }

        // 移除苦力怕
        scene.remove(creeperObj.creeper)

        // 產生爆炸
        explosion[0] = new Explosion(0, 0, 0, 0x000000)
        explosion[1] = new Explosion(5, 5, 5, 0x333333)
        explosion[2] = new Explosion(-5, 5, 10, 0x666666)
        explosion[3] = new Explosion(-5, 5, 5, 0x999999)
        explosion[4] = new Explosion(5, 5, -5, 0xcccccc)
      }
    }
  }
  this.resetCreeper = function() {
    scene.add(creeperObj.creeper)
  }
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
    20,
    1000
  )
  camera.position.set(50, 50, 50)
  camera.lookAt(scene.position)

  let axes = new THREE.AxesHelper(20)
  scene.add(axes)

  stats = initStats()

  // 渲染器設定
  renderer = new THREE.WebGLRenderer()
  // renderer.setClearColor(0xeeeeee, 1.0)
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

  // 爆炸
  // explosion = new Explosion(0, 0)

  // light
  let ambientLight = new THREE.AmbientLight(0x404040)
  scene.add(ambientLight)
  let spotLight = new THREE.SpotLight(0xf0f0f0)
  spotLight.position.set(-10, 30, 20)
  // spotLight.castShadow = true
  scene.add(spotLight)
  let pointLight = new THREE.PointLight(0xccffcc, 1, 100) // 顏色, 強度, 距離
  pointLight.castShadow = true // 投影
  pointLight.position.set(-30, 30, 30)
  scene.add(pointLight)

  // dat.GUI 控制面板
  gui = new dat.GUI()
  gui.add(datGUIControls, 'explosionTrigger')
  gui.add(datGUIControls, 'resetCreeper')

  document.body.appendChild(renderer.domElement)
}

// 苦力怕膨脹
function creeperScaleBody() {
  scaleHeadOffset += 0.04
  let scaleRate = Math.abs(Math.sin(scaleHeadOffset)) / 16 + 1
  creeperObj.creeper.scale.set(scaleRate, scaleRate, scaleRate)
}

function render() {
  if (explosion) {
    const len = explosion.length
    if (len > 0) {
      for (let i = 0; i < len; i++) {
        explosion[i].update()
      }
    }
  }
  stats.update()
  cameraControl.update()
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
