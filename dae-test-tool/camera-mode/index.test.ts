import { CameraMode, CameraModeArea, ColliderLayer, engine, Entity, InputAction, Material, MeshCollider, MeshRenderer, pointerEventsSystem, Raycast, RaycastQueryType, RaycastResult, Schemas, TextShape, Transform } from '@dcl/sdk/ecs'
import { Color4, Quaternion, Vector3 } from '@dcl/sdk/math'
import { test } from '@dcl/sdk/testing'
import { assertComponentValue } from '@dcl/sdk/testing/assert'
import { firstPersonEntity, overlapedEntity, rotatedEntity, scaledEntity, thirdPersonEntity } from './ui'
import { assertMovePlayerTo, customAddEntity, waitTicks, waitTriggerTest } from './../../utils/helpers'


test('FirstPerson', function* (context) {
    yield* waitTriggerTest(firstPersonEntity.get())

    customAddEntity.clean()

    // This entity is for center next entities
    const center = customAddEntity.addEntity()
    Transform.create(center, { position: Vector3.create(8, 0, 8) })

    // These entities are only visual references 
    const fp = customAddEntity.addEntity()
    Transform.create(fp, {
        parent: center,
        rotation: Quaternion.fromAngleAxis(-90, Vector3.Left())
    })

    const firstPersonFloor = customAddEntity.addEntity()
    MeshRenderer.setPlane(firstPersonFloor)
    Material.setPbrMaterial(firstPersonFloor, { albedoColor: Color4.Red() })
    Transform.create(firstPersonFloor, { parent: fp, scale: Vector3.create(6, 2, 1) })

    const firstPersonText = customAddEntity.addEntity()
    Transform.create(firstPersonText, { parent: fp, position: Vector3.create(0, 0, -0.01) })
    TextShape.create(firstPersonText, { text: "First Person", fontSize: 8 })

    //These entities declare and show the real area mode
    const cameraModeFirstPerson = customAddEntity.addEntity()
    Transform.create(cameraModeFirstPerson, { parent: center, position: Vector3.create(0, 2, 0) })
    CameraModeArea.create(cameraModeFirstPerson, { area: Vector3.create(6, 4, 2), mode: 0 })

    const areaFirstPerson = customAddEntity.addEntity()
    Transform.create(areaFirstPerson, { parent: cameraModeFirstPerson, scale: Vector3.create(6, 4, 2) })
    MeshRenderer.setBox(areaFirstPerson)
    Material.setPbrMaterial(areaFirstPerson, { albedoColor: Color4.create(1, 0, 0, .3) })


    //Player is moved to inside of the cameraModeArea
    yield* assertMovePlayerTo(Vector3.create(8, 0, 8), Vector3.create(16, 1, 8))

    yield* waitTicks(5)

    assertComponentValue(engine.CameraEntity, CameraMode, {
        //Expect first person camera mode
        mode: 0
    })
})

test('ThirdPerson', function* (context) {
    yield* waitTriggerTest(thirdPersonEntity.get())

    customAddEntity.clean()

    // This entity is for center next entities
    const center = customAddEntity.addEntity()
    Transform.create(center, { position: Vector3.create(8, 0, 8) })

    // These entities are only visual references 
    const tp = customAddEntity.addEntity()
    Transform.create(tp, {
        parent: center,
        rotation: Quaternion.fromAngleAxis(-90, Vector3.Left())
    })

    const thirdPersonFloor = customAddEntity.addEntity()
    MeshRenderer.setPlane(thirdPersonFloor)
    Material.setPbrMaterial(thirdPersonFloor, { albedoColor: Color4.Blue() })
    Transform.create(thirdPersonFloor, { parent: tp, scale: Vector3.create(6, 2, 1) })

    const thirdPersonText = customAddEntity.addEntity()
    Transform.create(thirdPersonText, { parent: tp, position: Vector3.create(0, 0, -0.01) })
    TextShape.create(thirdPersonText, { text: "Third Person", fontSize: 8 })

    //These entities declare and show the real area mode
    const cameraModeThirdPerson = customAddEntity.addEntity()
    Transform.create(cameraModeThirdPerson, { parent: center, position: Vector3.create(0, 2, 0) })
    CameraModeArea.create(cameraModeThirdPerson, { area: Vector3.create(6, 4, 2), mode: 1 })

    const areaThirdPerson = customAddEntity.addEntity()
    Transform.create(areaThirdPerson, { parent: cameraModeThirdPerson, scale: Vector3.create(6, 4, 2) })
    MeshRenderer.setBox(areaThirdPerson)
    Material.setPbrMaterial(areaThirdPerson, { albedoColor: Color4.create(0, 0, 1, .3) })


    //Player is moved to inside of the cameraModeArea
    yield* assertMovePlayerTo(Vector3.create(8, 0, 8), Vector3.create(16, 1, 8))

    yield* waitTicks(5)

    assertComponentValue(engine.CameraEntity, CameraMode, {
        //Expect third person camera mode
        mode: 1
    })
})

test("Scale no affect to cameraModeArea", function* (context) {
    yield* waitTriggerTest(scaledEntity.get())

    //Player is moved to origin where camera isn't forced
    yield* assertMovePlayerTo(Vector3.One(), Vector3.create(16, 1, 8))
    yield
    yield
    const camera = CameraMode.get(engine.CameraEntity)
    const cameraMode: number = camera.mode
    console.log("Camera mode: ", cameraMode)
    let modeToSet: number = 0

    //Set mode to CameraModeArea according the camera mode
    if (cameraMode == 0) {
        console.log(cameraMode)
        modeToSet = 1
    }
    console.log("Mode to set: ", modeToSet)

    customAddEntity.clean()

    // This entity is for center next entities
    const center = customAddEntity.addEntity()
    Transform.create(center, { position: Vector3.create(8, 0, 8) })

    // These entities are only visual references 
    const fp = customAddEntity.addEntity()
    Transform.create(fp, {
        parent: center,
        rotation: Quaternion.fromAngleAxis(-90, Vector3.Left())
    })

    const firstPersonFloor = customAddEntity.addEntity()
    MeshRenderer.setPlane(firstPersonFloor)
    Material.setPbrMaterial(firstPersonFloor, { albedoColor: Color4.Red() })
    Transform.create(firstPersonFloor, { parent: fp, scale: Vector3.create(6, 2, 1) })

    const firstPersonText = customAddEntity.addEntity()
    Transform.create(firstPersonText, { parent: fp, position: Vector3.create(0, 0, -0.01) })
    TextShape.create(firstPersonText, { text: "Real Area", fontSize: 8 })

    //These entities declare and show the real area mode
    const cameraModeFirstPerson = customAddEntity.addEntity()
    //Apply scale to entity, this shouldn't affect to effective area
    Transform.create(cameraModeFirstPerson, { parent: center, position: Vector3.create(0, 2, 0), scale: Vector3.create(2, 1, 4) })
    CameraModeArea.create(cameraModeFirstPerson, { area: Vector3.create(6, 4, 2), mode: modeToSet })

    const areaFirstPerson = customAddEntity.addEntity()
    Transform.create(areaFirstPerson, { parent: cameraModeFirstPerson, scale: Vector3.create(6, 4, 2) })
    MeshRenderer.setBox(areaFirstPerson)
    Material.setPbrMaterial(areaFirstPerson, { albedoColor: Color4.create(1, 0, 0, .3) })


    //Player is moved to inside of the scaled cameraModeArea
    yield* assertMovePlayerTo(Vector3.create(8, 0, 5.5), Vector3.create(16, 1, 8))

    yield* waitTicks(5)
    console.log("Camera mode: ", cameraMode)
    console.log("Mode to set: ", modeToSet)
    assertComponentValue(engine.CameraEntity, CameraMode, {
        //Expect first person camera mode
        mode: cameraMode
    })


})

test('Rotation affect to cameraModeArea', function* (context) {
    yield* waitTriggerTest(rotatedEntity.get())

    customAddEntity.clean()

    // This entity is for center next entities
    const center = customAddEntity.addEntity()
    Transform.create(center, { position: Vector3.create(8, 0, 8) })

    // These entities are only visual references 
    const fp = customAddEntity.addEntity()
    Transform.create(fp, {
        parent: center,
        rotation: Quaternion.fromAngleAxis(-90, Vector3.Left())
    })

    const firstPersonFloor = customAddEntity.addEntity()
    MeshRenderer.setPlane(firstPersonFloor)
    Material.setPbrMaterial(firstPersonFloor, { albedoColor: Color4.Red() })
    Transform.create(firstPersonFloor, { parent: fp, scale: Vector3.create(6, 2, 1) })

    const firstPersonText = customAddEntity.addEntity()
    Transform.create(firstPersonText, { parent: fp, position: Vector3.create(0, 0, -0.01) })
    TextShape.create(firstPersonText, { text: "First Person", fontSize: 8 })

    //These entities declare and show the real area mode
    const cameraModeFirstPerson = customAddEntity.addEntity()
    Transform.create(cameraModeFirstPerson, { parent: center, position: Vector3.create(0, 2, 0), rotation: Quaternion.fromAngleAxis(90, Vector3.Up()) })
    CameraModeArea.create(cameraModeFirstPerson, { area: Vector3.create(6, 4, 2), mode: 0 })

    const areaFirstPerson = customAddEntity.addEntity()
    Transform.create(areaFirstPerson, { parent: cameraModeFirstPerson, scale: Vector3.create(6, 4, 2) })
    MeshRenderer.setBox(areaFirstPerson)
    Material.setPbrMaterial(areaFirstPerson, { albedoColor: Color4.create(1, 0, 0, .3) })


    //Player is moved to inside of the cameraModeArea
    yield* assertMovePlayerTo(Vector3.create(8, 0, 10), Vector3.create(16, 1, 8))

    yield* waitTicks(5)

    assertComponentValue(engine.CameraEntity, CameraMode, {
        //Expect first person camera mode
        mode: 0
    })
})

test('CameraModeArea Overlaping', function* (context) {
    yield* waitTriggerTest(overlapedEntity.get())

    customAddEntity.clean()

    //AREA First Person
    // This entity is for center next entities
    const centerF = customAddEntity.addEntity()
    Transform.create(centerF, { position: Vector3.create(8, 0, 8) })

    // These entities are only visual references 
    const fp = customAddEntity.addEntity()
    Transform.create(fp, {
        parent: centerF,
        rotation: Quaternion.fromAngleAxis(-90, Vector3.Left())
    })

    const firstPersonFloor = customAddEntity.addEntity()
    MeshRenderer.setPlane(firstPersonFloor)
    Material.setPbrMaterial(firstPersonFloor, { albedoColor: Color4.Red() })
    Transform.create(firstPersonFloor, { parent: fp, scale: Vector3.create(6, 2, 1) })

    const firstPersonText = customAddEntity.addEntity()
    Transform.create(firstPersonText, { parent: fp, position: Vector3.create(0, 0, -0.01) })
    TextShape.create(firstPersonText, { text: "First Person", fontSize: 8 })

    //These entities declare and show the real area mode
    const cameraModeFirstPerson = customAddEntity.addEntity()
    Transform.create(cameraModeFirstPerson, { parent: centerF, position: Vector3.create(0, 2, 0) })
    CameraModeArea.create(cameraModeFirstPerson, { area: Vector3.create(6, 4, 2), mode: 0 })

    const areaFirstPerson = customAddEntity.addEntity()
    Transform.create(areaFirstPerson, { parent: cameraModeFirstPerson, scale: Vector3.create(6, 4, 2) })
    MeshRenderer.setBox(areaFirstPerson)
    Material.setPbrMaterial(areaFirstPerson, { albedoColor: Color4.create(1, 0, 0, .3) })

    //AREA Third Person
    // This entity is for center next entities
    const centerT = customAddEntity.addEntity()
    Transform.create(centerT, { position: Vector3.create(8, 0, 8), rotation: Quaternion.fromAngleAxis(90, Vector3.Up()) })

    // These entities are only visual references 
    const tp = customAddEntity.addEntity()
    Transform.create(tp, {
        parent: centerT,
        rotation: Quaternion.fromAngleAxis(-90, Vector3.Left())
    })

    const thirdPersonFloor = customAddEntity.addEntity()
    MeshRenderer.setPlane(thirdPersonFloor)
    Material.setPbrMaterial(thirdPersonFloor, { albedoColor: Color4.Blue() })
    Transform.create(thirdPersonFloor, { parent: tp, scale: Vector3.create(6, 2, 1) })

    const thirdPersonText = customAddEntity.addEntity()
    Transform.create(thirdPersonText, { parent: tp, position: Vector3.create(0, 0, -0.01) })
    TextShape.create(thirdPersonText, { text: "Third Person", fontSize: 8 })

    //These entities declare and show the real area mode
    const cameraModeThirdPerson = customAddEntity.addEntity()
    Transform.create(cameraModeThirdPerson, { parent: centerT, position: Vector3.create(0, 2, 0) })
    CameraModeArea.create(cameraModeThirdPerson, { area: Vector3.create(6, 4, 2), mode: 1 })

    const areaThirdPerson = customAddEntity.addEntity()
    Transform.create(areaThirdPerson, { parent: cameraModeThirdPerson, scale: Vector3.create(6, 4, 2) })
    MeshRenderer.setBox(areaThirdPerson)
    Material.setPbrMaterial(areaThirdPerson, { albedoColor: Color4.create(0, 0, 1, .3) })


    //Player is moved to origin
    yield* assertMovePlayerTo(Vector3.create(0, 0, 0), Vector3.create(16, 1, 8))
    //Player is moved to inside of the cameraModeArea
    yield* assertMovePlayerTo(Vector3.create(8, 0, 8), Vector3.create(16, 1, 8))

    yield* waitTicks(5)

    assertComponentValue(engine.CameraEntity, CameraMode, {
        //Expect third person camera mode because is the last one camera mode area instantiated
        mode: 1
    })
})




