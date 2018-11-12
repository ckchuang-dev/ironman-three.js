// points
const particleCount = 15000
let pointsScene
let pointsSceneMaterial
const textureLoader = new THREE.TextureLoader()
const snowTexture = textureLoader.load('./img/snowflake.png')
const rainTexture = textureLoader.load('./img/raindrop.png')

function createPointsScene() {
  const geometry = new THREE.Geometry()

  pointsSceneMaterial = new THREE.PointsMaterial({
    size: 5,
    map: snowTexture,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    transparent: true,
    opacity: 0.5
  })

  const range = 300
  for (let i = 0; i < particleCount; i++) {
    const x = THREE.Math.randInt(-range / 2, range / 2)
    const y = THREE.Math.randInt(0, range * 20)
    const z = THREE.Math.randInt(-range / 2, range / 2)
    const point = new THREE.Vector3(x, y, z)
    point.velocityX = THREE.Math.randFloat(-0.16, 0.16)
    point.velocityY = THREE.Math.randFloat(0.1, 0.3)
    geometry.vertices.push(point)
  }

  pointsScene = new THREE.Points(geometry, pointsSceneMaterial)
  scene.add(pointsScene)
}

function pointsSceneAnimation() {
  pointsScene.geometry.vertices.forEach(function(v) {
    if (v.y >= 0) {
      v.x = v.x - v.velocityX
      v.y = v.y - v.velocityY
    }
    if (v.x <= -150 || v.x >= 150) v.velocityX = v.velocityX * -1
  })

  pointsScene.geometry.verticesNeedUpdate = true
}
