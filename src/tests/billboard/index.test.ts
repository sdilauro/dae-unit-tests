import {
  Billboard,
  CameraModeArea,
  MeshCollider,
  MeshRenderer,
  Raycast,
  RaycastQueryType,
  RaycastResult,
  Transform,
  engine
} from '@dcl/sdk/ecs'
import { Vector3 } from '@dcl/sdk/math'
import { assertEquals } from '../../testing/assert'
import { test } from './../../testing'
import { customAddEntity } from './../../utils/entity'
import { assertMovePlayerTo } from './../../utils/helpers'
import { waitTicks } from './../../utils/waiters'

const sceneCenter = Vector3.create(8, 1, 8)
const cameraModeAreaE = engine.addEntity()
Transform.create(cameraModeAreaE, { position: sceneCenter })
CameraModeArea.create(cameraModeAreaE, {
  area: Vector3.create(16, 5, 16),
  mode: 0
})

test('billboard: billboard follows the camera', function* (context) {
  customAddEntity.clean()
  const billboardEntity = customAddEntity.addEntity()
  Transform.create(billboardEntity, { position: sceneCenter })
  Billboard.create(billboardEntity)

  const colliderToRaycast = customAddEntity.addEntity()
  Transform.create(colliderToRaycast, {
    parent: engine.PlayerEntity,
    position: Vector3.create(0, 2, 1),
    scale: Vector3.create(1, 2, 0.1)
  })

  MeshRenderer.create(colliderToRaycast, {
    mesh: {
      $case: 'box',
      box: { uvs: [] }
    }
  })
  MeshCollider.create(colliderToRaycast, {
    collisionMask: 1,
    mesh: {
      $case: 'box',
      box: { uvs: [] }
    }
  })

  yield* assertMovePlayerTo(Vector3.create(8, 0, 0), sceneCenter)

  Raycast.create(billboardEntity, {
    direction: {
      $case: 'localDirection',
      localDirection: Vector3.Backward()
    },
    maxDistance: 30,
    queryType: RaycastQueryType.RQT_QUERY_ALL,
    continuous: false,
    collisionMask: 1
  })

  yield* waitTicks(3)

  const rayResult = RaycastResult.get(billboardEntity)
  // console.log({ rayResult })
  // const playerPosition = Transform.get(engine.PlayerEntity).position
  // console.log({ playerPosition })

  assertEquals(
    rayResult.hits.length,
    1,
    'raycast from billboarded entity should always hit the collider'
  )
})

engine.removeEntity(cameraModeAreaE)
