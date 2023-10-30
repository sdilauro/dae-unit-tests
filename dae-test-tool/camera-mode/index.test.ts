import { CameraMode, CameraModeArea, ColliderLayer, engine, Entity, InputAction, MeshCollider, MeshRenderer, pointerEventsSystem, Raycast, RaycastQueryType, RaycastResult, Schemas, Transform } from '@dcl/sdk/ecs'
import { Vector3 } from '@dcl/sdk/math'
import { test } from '@dcl/sdk/testing'
import { assertComponentValue } from '@dcl/sdk/testing/assert'
import { testEntityStartTest } from './ui'

const ComputedTransform = engine.defineComponent('computed-transform', { position: Schemas.Vector3 })

const entity = engine.addEntity()
Transform.create(entity, { position: Vector3.create(8, 0, 8) })
CameraModeArea.create(entity, { area: Vector3.create(16, 2, 16), mode: 0 })


function* waitTriggerTest() {
    MeshRenderer.setSphere(testEntityStartTest)
    MeshCollider.setSphere(testEntityStartTest)
    Transform.create(testEntityStartTest, { position: Vector3.One() })
    pointerEventsSystem.onPointerDown({
        entity: testEntityStartTest,
        opts: {
            button: InputAction.IA_POINTER,
            hoverText: 'test',
            showFeedback: true
        }
    }, () => {
        Transform.deleteFrom(testEntityStartTest)
    })

    while (true) {
        if (Transform.getOrNull(testEntityStartTest) !== null) {
            yield
        } else {
            return
        }
    }
}


function* waitComputedTransform(entity: Entity) {
    Raycast.createOrReplace(entity, {
        direction: {
            $case: 'localDirection',
            localDirection: Vector3.Forward()
        },
        maxDistance: 1.0,
        queryType: RaycastQueryType.RQT_HIT_FIRST,
        collisionMask: ColliderLayer.CL_PHYSICS
    })

    // wait two ticks
    yield
    yield

    const raycastResult = RaycastResult.get(entity)
    ComputedTransform.createOrReplace(entity, {
        position: raycastResult.globalOrigin
    })
}


// test('CameraMode is FirstPerson?', function* (context) {
//     yield* waitTriggerTest()

//     console.log("frist tick")
//     yield

//     console.log("second tick")
//     assertComponentValue(engine.CameraEntity, CameraMode, {
//         mode: 0
//     })
// })

// test('CameraMode is ThirdPerson?', function* (context) {
//     yield* waitTriggerTest()

//     assertComponentValue(engine.CameraEntity, CameraMode, {
//         mode: 1
//     })
// })


test('Trasnform computed position', function* (context) {
    yield* waitTriggerTest()

    const entityA = engine.addEntity()
    Transform.createOrReplace(entityA, { position: Vector3.One() })

    const entityA1 = engine.addEntity()
    Transform.createOrReplace(entityA1, { position: Vector3.One(), parent: entityA })

    MeshRenderer.setBox(entityA1)
    yield
    yield* waitComputedTransform(entityA1)

    console.log({ computedTransform: ComputedTransform.get(entityA1) })
})


