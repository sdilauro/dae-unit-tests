import {
  MeshCollider,
  Raycast,
  RaycastQueryType,
  RaycastResult,
  Transform
} from '@dcl/sdk/ecs'
import { Quaternion, Vector3 } from '@dcl/sdk/math'
import { assertEquals } from '../../testing/assert'
import { test } from './../../testing'
import { customAddEntity } from './../../utils/entity'

const [eA, eB, eC] = Array.from({ length: 3 }, () =>
  customAddEntity.addEntity()
)

test('raycast to anothers entity', function* (context) {
  //An entity A with Raycast hits B and no C (because it hits all but C is in another layer)
  Transform.create(eA, { position: Vector3.One() })

  Transform.create(eB, { position: Vector3.create(4, 1, 1) })
  MeshCollider.create(eB, {
    collisionMask: 1,
    mesh: {
      $case: 'box',
      box: { uvs: [] }
    }
  })

  Transform.create(eC, { position: Vector3.create(6, 1, 1) })
  MeshCollider.create(eC, {
    collisionMask: 2,
    mesh: {
      $case: 'box',
      box: { uvs: [] }
    }
  })

  Raycast.createOrReplace(eA, {
    direction: {
      $case: 'localDirection',
      localDirection: Vector3.Right()
    },
    maxDistance: 15,
    queryType: RaycastQueryType.RQT_QUERY_ALL,
    continuous: false,
    collisionMask: 1
  })

  yield
  yield

  let rayResult = RaycastResult.get(eA)

  assertEquals(
    rayResult.hits.length,
    1,
    'raycast should hits only the colliderMesh with CM 1.'
  )

  // entity C collisionLayer is now 1, so Raycast hits twice
  MeshCollider.createOrReplace(eC, {
    collisionMask: 1,
    mesh: {
      $case: 'box',
      box: { uvs: [] }
    }
  })

  Raycast.createOrReplace(eA, {
    direction: {
      $case: 'localDirection',
      localDirection: Vector3.Right()
    },
    maxDistance: 15,
    queryType: RaycastQueryType.RQT_QUERY_ALL,
    continuous: false,
    collisionMask: 1
  })

  yield
  yield

  rayResult = RaycastResult.get(eA)
  //console.log({ rayResult })

  assertEquals(
    rayResult.hits.length,
    2,
    'raycast should hits all the colliderMeshs with CM 1.'
  )

  // now raycast only hit the first entity
  Raycast.createOrReplace(eA, {
    direction: {
      $case: 'localDirection',
      localDirection: Vector3.Right()
    },
    maxDistance: 15,
    queryType: RaycastQueryType.RQT_HIT_FIRST,
    continuous: false,
    collisionMask: 1
  })

  yield
  yield

  rayResult = RaycastResult.get(eA)

  assertEquals(
    rayResult.hits.length,
    1,
    'raycast should hits only the first entity.'
  )

  // rotated raycast no hits any entity
  Transform.createOrReplace(eA, {
    position: Vector3.One(),
    rotation: Quaternion.fromEulerDegrees(0, -90, 0)
  })
  Raycast.createOrReplace(eA, {
    direction: {
      $case: 'localDirection',
      localDirection: Vector3.Right()
    },
    maxDistance: 15,
    queryType: RaycastQueryType.RQT_HIT_FIRST,
    continuous: false,
    collisionMask: 0xffffffff
  })

  yield
  yield

  rayResult = RaycastResult.get(eA)
  assertEquals(
    rayResult.hits.length,
    0,
    'raycast has been rotated, it should hits any entities. '
  )

  Transform.createOrReplace(eB, { position: Vector3.create(1, 1, 4) })

  Transform.createOrReplace(eC, { position: Vector3.create(1, 1, 6) })

  Raycast.createOrReplace(eA, {
    direction: {
      $case: 'localDirection',
      localDirection: Vector3.Right()
    },
    maxDistance: 15,
    queryType: RaycastQueryType.RQT_QUERY_ALL,
    continuous: false,
    collisionMask: 0xffffffff
  })

  yield
  yield

  rayResult = RaycastResult.get(eA)
  console.log({ rayResult })
  assertEquals(
    rayResult.hits.length,
    2,
    'raycast hits should be 2 when CollisionMask is 0xffffffff. '
  )
})
