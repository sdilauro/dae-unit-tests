import {
  engine,
  Material,
  MeshRenderer,
  Transform,
  VideoPlayer,
  EngineInfo
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

test('video-player: if exist a reference snapshot should match with it', function* (context) {
  yield* waitTicksUntil(() => {
    const tickNumber = EngineInfo.getOrNull(engine.RootEntity)?.tickNumber ?? 0
    if (tickNumber > 100) {
      return true
    } else {
      return false
    }
  })
  customAddEntity.clean()
  const screen = customAddEntity.addEntity()
  MeshRenderer.createOrReplace(screen, {
    mesh: { $case: 'plane', plane: { uvs: [] } }
  })
  Transform.create(screen, {
    position: Vector3.create(8, 8, 15),
    scale: Vector3.create(16, 16, 1)
  })
  VideoPlayer.create(screen, {
    // src: 'https://gateway.pinata.cloud/ipfs/Qmd3eMnYQsgXjuhad1fdUCBnCQvzpoLKwRkMUrBDjedGtT/Cozumel%20Diving.mp4',
    // src: 'https://gateway.pinata.cloud/ipfs/QmTQjzjXgL5pUiJ5cbF7wkduqDEyemu4GDJasDXcwhzp73',
    src: 'src/assets/videos/dae-video-1.mp4',
    playing: true,
    volume: 0.2,
    loop: true,
    position: 0
  })

  const videoTexture = Material.Texture.Video({ videoPlayerEntity: screen })

  Material.setPbrMaterial(screen, {
    texture: videoTexture,
    roughness: 1.0,
    specularIntensity: 0,
    metallic: 0
  })

  let timer: number = 0.5
  let snapshotId: number = 0
  let testFinished: boolean = false
  const results: TakeAndCompareSnapshotResponse[] = []

  yield* waitTicks(1)

  const snapshotsQuantity: number = 4

  function takeSnapshots(dt: number): void {
    timer -= dt
    if (timer <= 0) {
      timer = 1
      snapshotId += 1
      const params: TakeAndCompareSnapshotRequest = {
        id: `video player ${snapshotId}`,
        cameraPosition: Vector3.create(8, 8, 8),
        cameraTarget: Vector3.create(8, 8, 16),
        snapshotFrameSize: Vector3.create(512, 512),
        tolerance: 0.99
      }

      const result: TakeAndCompareSnapshotResponse = (
        Testing as any
      ).takeAndCompareSnapshot(params)
      results.push(result)
      if (results.length === snapshotsQuantity) {
        testFinished = true
      }
    }
  }

  engine.addSystem(takeSnapshots)

  yield* waitTicksUntil(() => {
    if (testFinished) {
      return true
    } else {
      return false
    }
  })

  engine.removeSystem(takeSnapshots)

  for (const result of results) {
    const snapshotId: string = `video player  ${results.indexOf(result) + 1}`
    assertEquals(
      result.isMatch,
      true,
      `Snapshot ${snapshotId} wasn't exist or didn't match with reference`
    )
  }

  customAddEntity.clean()
})
