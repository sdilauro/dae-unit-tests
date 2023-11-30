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

test('video-player 1: if exist a reference snapshot should  match with it', function* (context) {
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
    src: 'https://gateway.pinata.cloud/ipfs/Qmd3eMnYQsgXjuhad1fdUCBnCQvzpoLKwRkMUrBDjedGtT/Cozumel%20Diving.mp4',
    playing: true,
    volume: 0.2,
    loop: true,
    position: 5
  })

  const videoTexture = Material.Texture.Video({ videoPlayerEntity: screen })

  Material.setPbrMaterial(screen, {
    texture: videoTexture,
    roughness: 1.0,
    specularIntensity: 0,
    metallic: 0
  })

  yield* waitTicks(200)

  const params: TakeAndCompareSnapshotRequest = {
    id: 'video player 1',
    cameraPosition: Vector3.create(8, 4, 8),
    cameraTarget: Vector3.create(8, 4, 16),
    snapshotFrameSize: Vector3.create(512, 512),
    tolerance: 0.99
  }

  const result: TakeAndCompareSnapshotResponse = (
    Testing as any
  ).takeAndCompareSnapshot(params)
  customAddEntity.clean()
  if (!result.wasExist) {
    Error(
      'This is the first time the tool is run. The test took the reference snapshots for future testing.'
    )
  }

  assertEquals(result.isMatch, true, `snaphot doesn't match with reference`)
})

test('video-player 2: if exist a reference snapshot should match with it', function* (context) {
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
    src: 'https://gateway.pinata.cloud/ipfs/Qmd3eMnYQsgXjuhad1fdUCBnCQvzpoLKwRkMUrBDjedGtT/Cozumel%20Diving.mp4',
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

  yield* waitTicks(15)

  const params: TakeAndCompareSnapshotRequest = {
    id: 'video player 2',
    cameraPosition: Vector3.create(8, 4, 8),
    cameraTarget: Vector3.create(8, 4, 16),
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
