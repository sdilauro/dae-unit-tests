import { CameraMode, engine } from '@dcl/sdk/ecs'
import { Color4, Vector3 } from '@dcl/sdk/math'
import { test } from '@dcl/sdk/testing'
import { assertComponentValue } from '@dcl/sdk/testing/assert'
import { assertMovePlayerTo, createAreaMode, customAddEntity, waitTicks, waitTriggerTest } from './../../utils/helpers'
import { firstPersonEntity, overlapedEntity, rotatedEntity, scaledEntity, thirdPersonEntity } from './ui'

const sceneCenter: Vector3 = Vector3.create(8, 0, 8)
const cameraTarget: Vector3 = Vector3.create(16, 1, 8)
const floorColorFP: Color4 = Color4.Red()
const areaColorFP: Color4 = Color4.create(1, 0, 0, 0.3)
const floorColorTP: Color4 = Color4.Blue()
const areaColorTP: Color4 = Color4.create(0, 0, 1, 0.3)

test('Camera mode must be 0', function* (context) {
  yield* waitTriggerTest(firstPersonEntity.get())

  //Delete old entities
  customAddEntity.clean()

  //Create a cameraModeArea with mode:0, centered on scene
  createAreaMode(sceneCenter, 0, 0, 'First Person', 'FirstPerson', 0, floorColorFP, areaColorFP, Vector3.One())

  //Player is moved to inside of the cameraModeArea
  yield* assertMovePlayerTo(sceneCenter, cameraTarget)

  yield* waitTicks(5)

  assertComponentValue(engine.CameraEntity, CameraMode, {
    //Expect first person camera mode
    mode: 0
  })
})

test('Camera mode must be 1', function* (context) {
  yield* waitTriggerTest(thirdPersonEntity.get())

  //Delete old entities
  customAddEntity.clean()

  //Create a cameraModeArea with mode:1, centered on scene
  createAreaMode(sceneCenter, 0, 0, 'Third Person', 'ThirdPerson', 1, floorColorTP, areaColorTP, Vector3.One())

  //Player is moved to inside of the cameraModeArea
  yield* assertMovePlayerTo(sceneCenter, cameraTarget)

  yield* waitTicks(5)

  assertComponentValue(engine.CameraEntity, CameraMode, {
    //Expect third person camera mode
    mode: 1
  })
})

test('Transform.scale should not has effect in cameraModeArea.area', function* (context) {
  yield* waitTriggerTest(scaledEntity.get())

  //Player is moved to origin where camera isn't forced
  yield* assertMovePlayerTo(Vector3.One(), cameraTarget)

  yield* waitTicks(5)

  const camera = CameraMode.get(engine.CameraEntity)
  const cameraMode: number = camera.mode
  let modeToSet: number = 0

  //Set mode to CameraModeArea according the camera mode
  if (cameraMode == 0) {
    modeToSet = 1
  }

  //Delete old entities
  customAddEntity.clean()

  //Create a cameraModeArea with opposite mode to the current one and scaled, centered on scene
  createAreaMode(
    sceneCenter,
    0,
    0,
    'Real Area',
    'FirstPerson',
    modeToSet,
    floorColorFP,
    areaColorFP,
    Vector3.create(2, 2, 4)
  )

  //Player is moved to inside of the scaled cameraModeArea
  yield* assertMovePlayerTo(Vector3.create(8, 0, 5.5), cameraTarget)

  yield* waitTicks(5)

  assertComponentValue(engine.CameraEntity, CameraMode, {
    //Expect cameraMode without forcing because scale in Transform component shouldn't affect the areaCameraMode
    mode: cameraMode
  })
})

test('Transform.rotation should has effect in cameraModeArea.area', function* (context) {
  yield* waitTriggerTest(rotatedEntity.get())

  //Delete old entities
  customAddEntity.clean()

  createAreaMode(sceneCenter, 0, 90, 'Rotated Area', 'FirstPerson', 0, floorColorFP, areaColorFP, Vector3.One())

  //Player is moved to inside of the cameraModeArea (rotated 90° to the floor)
  yield* assertMovePlayerTo(Vector3.create(8, 0, 10), cameraTarget)

  yield* waitTicks(5)

  assertComponentValue(engine.CameraEntity, CameraMode, {
    //Expect first person camera mode
    mode: 0
  })
})

test('Camera mode must be 1 when mode of last one overlaped area is 1', function* (context) {
  yield* waitTriggerTest(overlapedEntity.get())

  //Delete old entities
  customAddEntity.clean()

  //Create area with mode: 0
  createAreaMode(sceneCenter, 0, 0, 'First Person', 'FirstPerson', 0, floorColorFP, areaColorFP, Vector3.One())

  //create area with mode: 1 overlaping the another area
  createAreaMode(sceneCenter, 90, 0, 'Third Person', 'ThirdPerson', 1, floorColorTP, areaColorTP, Vector3.One())

  //Player is moved to origin
  yield* assertMovePlayerTo(Vector3.Zero(), cameraTarget)
  //Player is moved to inside of the cameraModeArea
  yield* assertMovePlayerTo(sceneCenter, cameraTarget)

  yield* waitTicks(5)

  assertComponentValue(engine.CameraEntity, CameraMode, {
    //Expect third person camera mode because is the last one camera mode area instantiated
    mode: 1
  })
})
