import { CameraMode, CameraModeArea, ColliderLayer, engine, Entity, InputAction, Material, MeshCollider, MeshRenderer, pointerEventsSystem, Raycast, RaycastQueryType, RaycastResult, Schemas, TextShape, Transform } from '@dcl/sdk/ecs'
import { Color4, Quaternion, Vector3 } from '@dcl/sdk/math'
import { test } from '@dcl/sdk/testing'
import { assertComponentValue } from '@dcl/sdk/testing/assert'
import { firstPersonEntity, rotatedEntity, scaledEntity, thirdPersonEntity } from './ui'
import { assertMovePlayerTo, waitTicks, waitTriggerTest } from './../../utils/helpers'

const firstPersonFloor = engine.addEntity()
MeshRenderer.setPlane(firstPersonFloor)
Material.setPbrMaterial(firstPersonFloor, { albedoColor: Color4.Red() })
Transform.create(firstPersonFloor, { rotation: Quaternion.fromAngleAxis(90, Vector3.Left()), scale: Vector3.create(6, 2, 1), position: Vector3.create(8, 0, 4) })

const firstPersonText = engine.addEntity()
Transform.create(firstPersonText, { rotation: Quaternion.fromAngleAxis(90, Vector3.Right()), position: Vector3.create(8, 0.1, 4) })
TextShape.create(firstPersonText, { text: "First Person" })

const thirdPersonFloor = engine.addEntity()
MeshRenderer.setPlane(thirdPersonFloor)
Material.setPbrMaterial(thirdPersonFloor, { albedoColor: Color4.Blue() })
Transform.create(thirdPersonFloor, { rotation: Quaternion.fromAngleAxis(90, Vector3.Left()), scale: Vector3.create(6, 2, 1), position: Vector3.create(8, 0, 12) })

const thirdPersonText = engine.addEntity()
Transform.create(thirdPersonText, { rotation: Quaternion.fromAngleAxis(90, Vector3.Right()), position: Vector3.create(8, 0.1, 12) })
TextShape.create(thirdPersonText, { text: "Third Person" })

const cameraModeFirstPerson = engine.addEntity()
Transform.create(cameraModeFirstPerson, { position: Vector3.create(8, 2, 4) })
CameraModeArea.create(cameraModeFirstPerson, { area: Vector3.create(6, 4, 2), mode: 0 })

const areaFirstPerson = engine.addEntity()
Transform.create(areaFirstPerson, { parent: cameraModeFirstPerson, scale: Vector3.create(6, 4, 2) })
MeshRenderer.setBox(areaFirstPerson)
Material.setPbrMaterial(areaFirstPerson, { albedoColor: Color4.create(1, 0, 0, .3) })

const cameraModeThirdPerson = engine.addEntity()
Transform.create(cameraModeThirdPerson, { position: Vector3.create(8, 2, 12) })
CameraModeArea.create(cameraModeThirdPerson, { area: Vector3.create(6, 4, 2), mode: 1 })

const areaThirdPerson = engine.addEntity()
Transform.create(areaThirdPerson, { parent: cameraModeThirdPerson, scale: Vector3.create(6, 4, 2) })
MeshRenderer.setBox(areaThirdPerson)
Material.setPbrMaterial(areaThirdPerson, { albedoColor: Color4.create(0, 0, 1, .3) })




test('CameraMode is FirstPerson?', function* (context) {
    yield* waitTriggerTest(firstPersonEntity)
    yield* assertMovePlayerTo(Vector3.create(8, 0, 4), Vector3.create(8, 1, 8))
    yield* waitTicks(5)

    assertComponentValue(engine.CameraEntity, CameraMode, {
        mode: 0
    })

})

test('CameraMode is ThirdPerson?', function* (context) {
    yield* waitTriggerTest(thirdPersonEntity)
    yield* assertMovePlayerTo(Vector3.create(8, 0, 12), Vector3.create(8, 1, 8))

    yield* waitTicks(5)

    assertComponentValue(engine.CameraEntity, CameraMode, {
        mode: 1
    })
})

test('CameraModeArea not scaling from Transform', function* (context) {
    yield* waitTriggerTest(scaledEntity)
    yield* assertMovePlayerTo(Vector3.create(0, 0, 0), Vector3.create(8, 1, 8))

    Transform.createOrReplace(cameraModeFirstPerson, { position: Vector3.create(8, 2, 4), scale: Vector3.create(2, 1, 2) })
    yield* waitTicks(5)
    yield* assertMovePlayerTo(Vector3.create(8, 0, 4), Vector3.create(8, 1, 8))

    yield* waitTicks(20)

    assertComponentValue(engine.CameraEntity, CameraMode, {
        mode: 0
    })
})



test('CameraModeArea rotates from Transform', function* (context) {
    yield* waitTriggerTest(rotatedEntity)
    yield* assertMovePlayerTo(Vector3.create(8, 0, 6), Vector3.create(8, 1, 8))

    Transform.createOrReplace(firstPersonFloor, { rotation: Quaternion.multiply(Quaternion.fromAngleAxis(-90, Vector3.Left()), Quaternion.fromAngleAxis(-90, Vector3.Backward())), scale: Vector3.create(6, 2, 1), position: Vector3.create(8, 0, 4) })
    Transform.createOrReplace(cameraModeFirstPerson, { position: Vector3.create(8, 2, 4), rotation: Quaternion.fromAngleAxis(90, Vector3.Up()) })

    yield* waitTicks(20)


    assertComponentValue(engine.CameraEntity, CameraMode, {
        mode: 0
    })
})


