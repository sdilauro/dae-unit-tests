import {
  Billboard,
  BillboardMode,
  CameraModeArea,
  ColliderLayer,
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
import { waitForMeshColliderApplied } from '../../utils/godot'

// BM_NONE = 0,
// BM_X = 1,
// BM_Y = 2,
// BM_Z = 4,
// BM_ALL = 7

const sceneCenter = Vector3.create(8, 1, 8)

test('billboard: mode BM_NONE', async function (context) {
  customAddEntity.clean()
  const cameraModeAreaE = customAddEntity.addEntity()
  Transform.create(cameraModeAreaE, { position: sceneCenter })
  CameraModeArea.create(cameraModeAreaE, {
    area: Vector3.create(16, 5, 16),
    mode: 0
  })
  const colliderToRaycast = customAddEntity.addEntity()
  Transform.create(colliderToRaycast, {
    parent: engine.PlayerEntity,
    position: Vector3.create(0, 1, 0.45),
    scale: Vector3.create(3, 3, 0.1)
  })
  MeshCollider.create(colliderToRaycast, {
    collisionMask: ColliderLayer.CL_CUSTOM5,
    mesh: {
      $case: 'box',
      box: { uvs: [] }
    }
  })
  await waitForMeshColliderApplied(context)

  const billboardEntity = customAddEntity.addEntity()
  Transform.create(billboardEntity, { position: sceneCenter })
  Billboard.create(billboardEntity, { billboardMode: BillboardMode.BM_NONE })
  MeshRenderer.create(billboardEntity, {
    mesh: {
      $case: 'box',
      box: { uvs: [] }
    }
  })
  await assertMovePlayerTo(context, Vector3.create(4, 0, 4), sceneCenter)

  Raycast.create(billboardEntity, {
    direction: {
      $case: 'localDirection',
      localDirection: Vector3.Backward()
    },
    maxDistance: 30,
    queryType: RaycastQueryType.RQT_QUERY_ALL,
    continuous: false,
    collisionMask: ColliderLayer.CL_CUSTOM5
  })

  await context.helpers.waitNTicks(3)

  const rayResult = RaycastResult.get(billboardEntity)

  assertEquals(
    rayResult.hits.length,
    0,
    'raycast from entity should not hit the collider '
  )
})

test('billboard: mode BM_Y', async function (context) {
  customAddEntity.clean()

  // Setup player
  const cameraModeAreaE = customAddEntity.addEntity()
  Transform.create(cameraModeAreaE, { position: sceneCenter })
  CameraModeArea.create(cameraModeAreaE, {
    area: Vector3.create(16, 5, 16),
    mode: 0
  })
  await assertMovePlayerTo(context, Vector3.create(4, 0, 4), sceneCenter)

  // Animation of the camera mode area takes several ticks
  await context.helpers.waitNTicks(100)

  // Setup billboard
  const colliderToRaycast = customAddEntity.addEntity()
  Transform.create(colliderToRaycast, {
    parent: engine.PlayerEntity,
    position: Vector3.create(0, 1, 0.45),
    scale: Vector3.create(3, 3, 0.1)
  })
  MeshCollider.create(colliderToRaycast, {
    collisionMask: ColliderLayer.CL_CUSTOM5,
    mesh: {
      $case: 'box',
      box: { uvs: [] }
    }
  })
  await waitForMeshColliderApplied(context)

  const billboardEntity = customAddEntity.addEntity()
  Transform.create(billboardEntity, { position: sceneCenter })
  Billboard.create(billboardEntity, { billboardMode: BillboardMode.BM_Y })
  MeshRenderer.create(billboardEntity, {
    mesh: {
      $case: 'box',
      box: { uvs: [] }
    }
  })

  Raycast.create(billboardEntity, {
    direction: {
      $case: 'localDirection',
      localDirection: Vector3.Backward()
    },
    maxDistance: 30,
    queryType: RaycastQueryType.RQT_QUERY_ALL,
    continuous: false,
    collisionMask: ColliderLayer.CL_CUSTOM5
  })

  await context.helpers.waitNTicks(3)

  const rayResult = RaycastResult.get(billboardEntity)

  assertEquals(
    rayResult.hits.length,
    1,
    'raycast from entity should hit the collider'
  )
})

test('billboard: mode BM_ALL', async function (context) {
  const stepBoxSize = 4.0

  customAddEntity.clean()
  const cameraModeAreaE = customAddEntity.addEntity()
  Transform.create(cameraModeAreaE, { position: sceneCenter })
  CameraModeArea.create(cameraModeAreaE, {
    area: Vector3.create(16, stepBoxSize + 6, 16),
    mode: 0
  })

  const stepBoxPosition = Vector3.create(4, stepBoxSize / 2.0, 4)

  const stepBox = customAddEntity.addEntity()
  Transform.create(stepBox, {
    position: stepBoxPosition,
    scale: Vector3.create(2, stepBoxSize, 2)
  })
  MeshCollider.create(stepBox, {
    collisionMask: ColliderLayer.CL_PHYSICS | ColliderLayer.CL_POINTER
  })
  await waitForMeshColliderApplied(context)

  await assertMovePlayerTo(
    context,
    Vector3.add(stepBoxPosition, Vector3.create(0, 3, 0)),
    sceneCenter
  )

  // Animation of the camera mode area takes several ticks
  // Also the gravity to make the player fall
  await context.helpers.waitNTicks(150)

  const colliderToRaycast = customAddEntity.addEntity()
  Transform.create(colliderToRaycast, {
    parent: engine.PlayerEntity,
    position: Vector3.create(0, 1, 0),
    scale: Vector3.create(1, 2, 1) // TODO: change Z to 0.1 to make it more precisely
  })
  MeshCollider.create(colliderToRaycast, {
    collisionMask: ColliderLayer.CL_CUSTOM4,
    mesh: {
      $case: 'cylinder',
      cylinder: {
        radiusBottom: 0.7,
        radiusTop: 0.7
      }
    }
  })
  await waitForMeshColliderApplied(context)

  const billboardEntity = customAddEntity.addEntity()
  Transform.create(billboardEntity, { position: sceneCenter })
  Billboard.create(billboardEntity, { billboardMode: BillboardMode.BM_ALL })
  MeshRenderer.create(billboardEntity, {
    mesh: {
      $case: 'box',
      box: { uvs: [] }
    }
  })

  Raycast.create(billboardEntity, {
    direction: {
      $case: 'localDirection',
      localDirection: Vector3.Backward()
    },
    maxDistance: 30,
    queryType: RaycastQueryType.RQT_QUERY_ALL,
    continuous: false,
    collisionMask: ColliderLayer.CL_CUSTOM4
  })

  await context.helpers.waitNTicks(3)

  const rayResult = RaycastResult.get(billboardEntity)

  CameraModeArea.deleteFrom(cameraModeAreaE)
  await context.helpers.waitNTicks(3)

  assertEquals(
    rayResult.hits.length,
    1,
    'raycast from entity should hit the collider'
  )
})
