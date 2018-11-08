/**
 * @author mrdoob / http://mrdoob.com/
 * @author schteppe / https://github.com/schteppe
 */
let PointerLockControls = function(camera, cannonBody) {
  let eyeYPos = 2 // eyes are 2 meters above the ground
  let velocityFactor = 0.2
  let jumpVelocity = 15
  let scope = this

  let pitchObject = new THREE.Object3D()
  pitchObject.add(camera)

  let yawObject = new THREE.Object3D()
  yawObject.position.y = 2
  yawObject.add(pitchObject)

  let quat = new THREE.Quaternion()

  let moveForward = false
  let moveBackward = false
  let moveLeft = false
  let moveRight = false

  let canJump = false

  let contactNormal = new CANNON.Vec3() // Normal in the contact, pointing *out* of whatever the player touched
  let upAxis = new CANNON.Vec3(0, 1, 0)
  cannonBody.addEventListener('collide', function(e) {
    let contact = e.contact

    // contact.bi and contact.bj are the colliding bodies, and contact.ni is the collision normal.
    // We do not yet know which one is which! Let's check.
    if (contact.bi.id == cannonBody.id)
      // bi is the player body, flip the contact normal
      contact.ni.negate(contactNormal)
    else contactNormal.copy(contact.ni) // bi is something else. Keep the normal as it is

    // If contactNormal.dot(upAxis) is between 0 and 1, we know that the contact normal is somewhat in the up direction.
    if (contactNormal.dot(upAxis) > 0.5)
      // Use a "good" threshold value between 0 and 1 here!
      canJump = true
  })

  let velocity = cannonBody.velocity

  let PI_2 = Math.PI / 2

  let onMouseMove = function(event) {
    if (scope.enabled === false) return

    let movementX =
      event.movementX || event.mozMovementX || event.webkitMovementX || 0
    let movementY =
      event.movementY || event.mozMovementY || event.webkitMovementY || 0

    yawObject.rotation.y -= movementX * 0.002
    pitchObject.rotation.x -= movementY * 0.002

    pitchObject.rotation.x = Math.max(
      -PI_2,
      Math.min(PI_2, pitchObject.rotation.x)
    )
  }

  let onKeyDown = function(event) {
    switch (event.keyCode) {
      case 38: // up
      case 87: // w
        moveForward = true
        break

      case 37: // left
      case 65: // a
        moveLeft = true
        break

      case 40: // down
      case 83: // s
        moveBackward = true
        break

      case 39: // right
      case 68: // d
        moveRight = true
        break

      case 32: // space
        if (canJump === true) {
          velocity.y = jumpVelocity
        }
        canJump = false
        break
    }
  }

  let onKeyUp = function(event) {
    switch (event.keyCode) {
      case 38: // up
      case 87: // w
        moveForward = false
        break

      case 37: // left
      case 65: // a
        moveLeft = false
        break

      case 40: // down
      case 83: // a
        moveBackward = false
        break

      case 39: // right
      case 68: // d
        moveRight = false
        break
    }
  }

  document.addEventListener('mousemove', onMouseMove, false)
  document.addEventListener('keydown', onKeyDown, false)
  document.addEventListener('keyup', onKeyUp, false)

  this.enabled = false

  this.getObject = function() {
    return yawObject
  }

  this.getDirection = function(targetVec) {
    targetVec.set(0, 0, -1)
    quat.multiplyVector3(targetVec)
  }

  // Moves the camera to the Cannon.js object position and adds velocity to the object if the run key is down
  let inputVelocity = new THREE.Vector3()
  let euler = new THREE.Euler()
  this.update = function(delta) {
    if (scope.enabled === false) {
      moveForward = false
      moveLeft = false
      moveBackward = false
      moveRight = false
      return
    }

    delta *= 0.1

    inputVelocity.set(0, 0, 0)

    if (moveForward) {
      inputVelocity.z = -velocityFactor * delta
    }
    if (moveBackward) {
      inputVelocity.z = velocityFactor * delta
    }

    if (moveLeft) {
      inputVelocity.x = -velocityFactor * delta
    }
    if (moveRight) {
      inputVelocity.x = velocityFactor * delta
    }

    // Convert velocity to world coordinates
    euler.x = pitchObject.rotation.x
    euler.y = yawObject.rotation.y
    euler.order = 'XYZ'
    quat.setFromEuler(euler)
    inputVelocity.applyQuaternion(quat)
    //quat.multiplyVector3(inputVelocity);

    // Add to the object
    velocity.x += inputVelocity.x
    velocity.z += inputVelocity.z

    yawObject.position.copy(cannonBody.position)
  }
}
