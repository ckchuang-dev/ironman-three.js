let scene, renderer, camera
let cube

// 初始化場景、渲染器、相機、物體
function init() {
  // 建立場景
  scene = new THREE.Scene()

  // 建立渲染器
  renderer = new THREE.WebGLRenderer()
  renderer.setSize(window.innerWidth, window.innerHeight)

  // 將渲染器的 DOM 綁到網頁上
  document.body.appendChild(renderer.domElement)

  // 建立相機
  camera = new THREE.PerspectiveCamera(
    45, window.innerWidth / window.innerHeight, 0.1, 100
  )
  camera.position.set(10, 10, 10)
  camera.lookAt(scene.position)

  // 建立光源
  let light = new THREE.PointLight(0xffffff, 1, 100)
  light.position.set(10, 10, -10);
  scene.add(light)
  let ambientLight = new THREE.AmbientLight(0x444444)
  scene.add(ambientLight)

  // 建立物體
  const geometry = new THREE.BoxGeometry(1, 1, 1)
  const material = new THREE.MeshPhongMaterial({
    color: 0x777777
  })
  cube = new THREE.Mesh(geometry, material)
  cube.position.set(0, 0, 0)
  scene.add(cube)
}

// 建立動畫
function animate() {
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
}

// 渲染場景
function render() {
  animate()
  renderer.render(scene, camera)
  requestAnimationFrame(render)
}

// 監聽螢幕寬高來做簡單 RWD 設定
window.addEventListener('resize', function () {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
})

init()
render()