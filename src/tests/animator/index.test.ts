import {
  Animator,
  EngineInfo,
  GltfContainer,
  Transform,
  engine
} from '@dcl/sdk/ecs'
import { Vector3 } from '@dcl/sdk/math'
import * as Testing from '~system/Testing'
import { assertEquals } from '../../testing/assert'
import { customAddEntity } from '../../utils/entity'
import type {
  TakeAndCompareSnapshotRequest,
  TakeAndCompareSnapshotResponse
} from '../../utils/snapshot-test'
import { waitTicks, waitTicksUntil } from '../../utils/waiters'
import { test } from './../../testing'

test('animator track 1: if exist a reference snapshot should match with it', function* (context) {
  yield* waitTicksUntil(() => {
    const tickNumber = EngineInfo.getOrNull(engine.RootEntity)?.tickNumber ?? 0
    if (tickNumber > 100) {
      return true
    } else {
      return false
    }
  })
  customAddEntity.clean()
  const cube = customAddEntity.addEntity()
  Transform.create(cube, {
    position: Vector3.create(8, 1, 8)
  })
  GltfContainer.create(cube, {
    src: 'src/assets/models/animated_cube.glb'
  })
  Animator.create(cube, {
    states: [
      {
        clip: 'Static Pose',
        playing: true,
        shouldReset: true,
        loop: true
      }
    ]
  })
  yield* waitTicks(15)

  const params: TakeAndCompareSnapshotRequest = {
    id: 'animator 1',
    cameraPosition: Vector3.create(6.5, 4, 6.5),
    cameraTarget: Vector3.create(8, 2, 8),
    snapshotFrameSize: Vector3.create(512, 512),
    tolerance: 0.99
  }

  const result: TakeAndCompareSnapshotResponse = (
    Testing as any
  ).takeAndCompareSnapshot(params)

  if (!result.wasExist) {
    Error(
      'This is the first time the tool is run. The test took the reference snapshots for future testing.'
    )
  }

  assertEquals(result.isMatch, true, `snapshot doesn't match with reference`)
})

test('animator track 2: if exist a  reference snapshot should match with it', function* (context) {
  customAddEntity.clean()
  const cube = customAddEntity.addEntity()
  Transform.create(cube, {
    position: Vector3.create(8, 1, 8)
  })
  GltfContainer.create(cube, {
    src: 'src/assets/models/animated_cube.glb'
  })
  Animator.create(cube, {
    states: [
      {
        clip: 'Static Pose',
        playing: false,
        shouldReset: true,
        loop: true
      },
      {
        clip: 'Action',
        playing: true,
        shouldReset: false,
        loop: true
      }
    ]
  })
  yield* waitTicks(200)

  const actionAnim = Animator.getClip(cube, 'Action')
  actionAnim.playing = false

  const params: TakeAndCompareSnapshotRequest = {
    id: 'animator 2',
    cameraPosition: Vector3.create(6.5, 4, 6.5),
    cameraTarget: Vector3.create(8, 2, 8),
    snapshotFrameSize: Vector3.create(512, 512),
    tolerance: 0.99
  }

  const result: TakeAndCompareSnapshotResponse = (
    Testing as any
  ).takeAndCompareSnapshot(params)

  if (!result.wasExist) {
    Error(
      'This is the first time the tool is run. The test took the reference snapshots for futur e testing.'
    )
  }

  assertEquals(result.isMatch, true, `snapshot doesn't match with reference`)
})
