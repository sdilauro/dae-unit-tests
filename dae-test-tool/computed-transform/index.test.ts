import { CameraMode, CameraModeArea, ColliderLayer, engine, Entity, InputAction, MeshCollider, MeshRenderer, pointerEventsSystem, Raycast, RaycastQueryType, RaycastResult, Schemas, Transform } from '@dcl/sdk/ecs'
import { Vector3 } from '@dcl/sdk/math'
import { test } from '@dcl/sdk/testing'
import { assertComponentValue } from '@dcl/sdk/testing/assert'
import { testEntityStartTest } from './ui'
import { waitTriggerTest } from './../../utils/helpers'

const ComputedTransform = engine.defineComponent('computed-transform', { position: Schemas.Vector3 })

const entity = engine.addEntity()
Transform.create(entity, { position: Vector3.create(8, 0, 8) })
CameraModeArea.create(entity, { area: Vector3.create(16, 2, 16), mode: 0 })


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

test('Trasnform computed position', function* (context) {
    yield* waitTriggerTest(testEntityStartTest)
    const entityA = engine.addEntity()
    Transform.createOrReplace(entityA, { position: Vector3.One() })

    const entityA1 = engine.addEntity()
    Transform.createOrReplace(entityA1, { position: Vector3.One(), parent: entityA })

    MeshRenderer.setBox(entityA1)
    yield

    yield* waitComputedTransform(entityA1)
    console.log({ computedTransform: ComputedTransform.get(entityA1) })
    assertComponentValue(entityA1, ComputedTransform, {
        position: Vector3.create(2, 2, 2)
    })
})


