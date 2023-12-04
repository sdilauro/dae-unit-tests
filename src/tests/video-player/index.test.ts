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
  let snapshot_id: number = 0
  let succesful_counter: number = 0
  let test_finished: boolean = false
  let results: TakeAndCompareSnapshotResponse[] = []

  yield* waitTicks(1)

  const snapshots_quantity: number = 4

  function takeSnapshots(dt: number) {
    timer -= dt
    if (timer <= 0) {
      timer = 1
      snapshot_id += 1
      const params: TakeAndCompareSnapshotRequest = {
        id: `video player ${snapshot_id}`,
        cameraPosition: Vector3.create(8, 8, 8),
        cameraTarget: Vector3.create(8, 8, 16),
        snapshotFrameSize: Vector3.create(512, 512),
        tolerance: 0.99
      }

      const result: TakeAndCompareSnapshotResponse = (
        Testing as any
      ).takeAndCompareSnapshot(params)

      if (result) {
        results.push(result)
      }

      if (results.length == snapshots_quantity) {
        engine.removeSystem(takeSnapshots)
        test_finished = true
        return
      }
    }
  }

  engine.addSystem(takeSnapshots)

  yield* waitTicksUntil(() => {
    if (test_finished == true) {
      return true
    } else {
      return false
    }
  })

  engine.removeSystem(takeSnapshots)

  for (const result of results) {
    const snapshot_id: string = `video player  ${results.indexOf(result) + 1}`
    assertEquals(
      result.isMatch,
      true,
      `Snapshot ${snapshot_id} wasn't exist or didn't match with reference`
    )
  }

  customAddEntity.clean()
})
