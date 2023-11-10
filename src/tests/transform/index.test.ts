import {
  Raycast,
  RaycastQueryType,
  RaycastResult,
  Transform,
  engine,
  type Entity
} from '@dcl/sdk/ecs'
import { Quaternion, Vector3 } from '@dcl/sdk/math'
import { test } from './../../testing'
import { assert, assertEquals } from './../../testing/assert'
import { customAddEntity } from './../../utils/entity'

// function getGlobalTransformPosition(entity: Entity) {
//   // TODO: compute recursive position
//   return Transform.get(entity).position
// }

let customWaitAndAssertTransformPositionTimestamp = 0
function* waitAndAssertTransformPosition(
  entity: Entity,
  assertPrefix: string,
  mockedPosition: Vector3 // TODO: remove when getGlobalTransformPosition is ready
): Generator<void> {
  customWaitAndAssertTransformPositionTimestamp += 1
  Raycast.createOrReplace(entity, {
    timestamp: customWaitAndAssertTransformPositionTimestamp,
    originOffset: Vector3.Zero(),
    direction: {
      $case: 'localDirection',
      localDirection: Vector3.Forward()
    },
    maxDistance: 0.1,
    queryType: RaycastQueryType.RQT_QUERY_ALL,
    continuous: false,
    collisionMask: 0xffffffff
  })

  yield
  yield // TODO: this should work without this, but foundation doesn't compute the raycast in the proper tick

  assert(
    RaycastResult.getOrNull(entity) !== null,
    `${assertPrefix}raycast should have arrived`
  )

  // const globalPosition = getGlobalTransformPosition(entity) // TODO
  // getGlobalTransform(entity)
  const globalPosition = mockedPosition
  const calculatedPosition = RaycastResult.get(entity).globalOrigin
  assertEquals(
    calculatedPosition,
    globalPosition,
    `${assertPrefix}global origin from raycast is different to computed transform position`
  )
}

test('should this test be the first one', function* (context) {
  assert(context.currentTestNumber === 1, 'context.currentTestNumber == 1')
})

test('should transform test-mechanism works well', function* (context) {
  assert(
    customAddEntity.isEmpty(),
    'custom add entity should be empty in the second test'
  )

  const testEntityA = customAddEntity.addEntity()
  Transform.create(testEntityA, {
    position: Vector3.create(3.3, 4.4, 5.5)
  })
  yield* waitAndAssertTransformPosition(
    testEntityA,
    '(test entity A1)',
    Vector3.create(3.3, 4.4, 5.5)
  )

  Transform.getMutable(testEntityA).position = Vector3.add(
    Vector3.One(),
    Vector3.create(3.3, 4.4, 5.5)
  )
  yield* waitAndAssertTransformPosition(
    testEntityA,
    '(test entity A2)',
    Vector3.create(4.3, 5.4, 6.5)
  )

  const testEntityB = customAddEntity.addEntity()
  Transform.getMutable(testEntityA).position = Vector3.One()
  Transform.create(testEntityB, {
    position: Vector3.create(1.3, 1.4, 1.5),
    parent: testEntityA
  })
  yield* waitAndAssertTransformPosition(
    testEntityB,
    '(test entity B with A as parent)',
    Vector3.create(2.3, 2.4, 2.5)
  )

  let testEntityC = customAddEntity.addEntity()
  Transform.create(testEntityC, {
    position: Vector3.create(5, 5, 5),
    rotation: Quaternion.fromAngleAxis(90, Vector3.Up())
  })
  const testEntityD = customAddEntity.addEntity()
  Transform.create(testEntityD, {
    position: Vector3.Forward(),
    parent: testEntityC
  })
  yield* waitAndAssertTransformPosition(
    testEntityD,
    '(test entity D with C rotated as parent)',
    Vector3.create(6, 5, 5)
  )

  engine.removeEntity(testEntityC)
  yield* waitAndAssertTransformPosition(
    testEntityD,
    '(test entity D removing its parent)',
    Vector3.create(0, 0, 1)
  )

  testEntityC = customAddEntity.addEntity()
  Transform.create(testEntityC, {
    position: Vector3.create(5, 5, 5),
    scale: Vector3.create(2, 2, 2)
  })
  Transform.createOrReplace(testEntityD, {
    position: Vector3.Forward(),
    parent: testEntityC
  })

  yield* waitAndAssertTransformPosition(
    testEntityD,
    '(test entity D with C scaled as parent)',
    Vector3.create(5, 5, 7)
  )

  engine.removeEntity(testEntityC)
  yield* waitAndAssertTransformPosition(
    testEntityD,
    '(test entity D removing its parent)',
    Vector3.create(0, 0, 1)
  )

  // assertEquals(
  //   Array.from(dumpTree(engine.RootEntity)),
  //   ['0', '└──testEntityA', '   └──testEntityB', '└──testEntityD'],
  //   `tree failed`
  // )
})
