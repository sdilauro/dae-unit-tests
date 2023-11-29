import {
  EngineInfo,
  Font,
  TextAlignMode,
  TextShape,
  Transform,
  engine
} from '@dcl/sdk/ecs'
import { Color4, Vector3 } from '@dcl/sdk/math'
import * as Testing from '~system/Testing'
import { assertEquals } from '../../testing/assert'
import { customAddEntity } from '../../utils/entity'
import type {
  TakeAndCompareSnapshotRequest,
  TakeAndCompareSnapshotResponse
} from '../../utils/snapshot-test'
import { waitTicks, waitTicksUntil } from '../../utils/waiters'
import { test } from './../../testing'

test('text-shape default text: if exist a reference snapshot should match with it', function* (context) {
  yield* waitTicksUntil(() => {
    const tickNumber = EngineInfo.getOrNull(engine.RootEntity)?.tickNumber ?? 0
    if (tickNumber > 100) {
      return true
    } else {
      return false
    }
  })
  customAddEntity.clean()
  const textEntity = customAddEntity.addEntity()
  Transform.create(textEntity, {
    position: Vector3.create(8, 1, 8)
  })
  TextShape.createOrReplace(textEntity, { text: 'Default text' })

  yield* waitTicks(15)

  const params: TakeAndCompareSnapshotRequest = {
    id: 'text shape 1',
    cameraPosition: Vector3.create(2, 2, 2),
    cameraTarget: Vector3.create(8, 1, 8),
    snapshotFrameSize: Vector3.create(1024, 1024),
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

test('text-shape colorized: if exist a reference snapshot should match with it', function* (context) {
  customAddEntity.clean()
  const textEntity = customAddEntity.addEntity()
  Transform.create(textEntity, {
    position: Vector3.create(8, 1, 8)
  })
  TextShape.createOrReplace(textEntity, {
    text: 'Red text',
    fontSize: 3,
    textColor: Color4.Red()
  })

  yield* waitTicks(15)

  const params: TakeAndCompareSnapshotRequest = {
    id: 'text shape 2',
    cameraPosition: Vector3.create(2, 2, 2),
    cameraTarget: Vector3.create(8, 1, 8),
    snapshotFrameSize: Vector3.create(1024, 1024),
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

test('text-shape outlined: if exist a reference snapshot should match with it', function* (context) {
  customAddEntity.clean()
  const textEntity = customAddEntity.addEntity()
  Transform.create(textEntity, {
    position: Vector3.create(8, 1, 8)
  })
  /* The text outline works correctly, but the default value of the property is lost (each iteration is affected by the value set here)  */
  TextShape.createOrReplace(textEntity, {
    text: 'Text with\nred outline',
    fontSize: 2,
    outlineColor: Color4.Red(),
    outlineWidth: 0.1
  })
  yield* waitTicks(15)

  const params: TakeAndCompareSnapshotRequest = {
    id: 'text shape 3',
    cameraPosition: Vector3.create(2, 2, 2),
    cameraTarget: Vector3.create(8, 1, 8),
    snapshotFrameSize: Vector3.create(1024, 1024),
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

test('text-shape changed font: if exist a reference snapshot should match with it', function* (context) {
  customAddEntity.clean()
  const textEntity = customAddEntity.addEntity()
  Transform.create(textEntity, {
    position: Vector3.create(8, 1, 8)
  })
  /* Text font don't change  */
  TextShape.createOrReplace(textEntity, {
    text: 'Monospace',
    fontSize: 2,
    font: Font.F_MONOSPACE
  })
  yield* waitTicks(15)

  const params: TakeAndCompareSnapshotRequest = {
    id: 'text shape 4',
    cameraPosition: Vector3.create(2, 2, 2),
    cameraTarget: Vector3.create(8, 1, 8),
    snapshotFrameSize: Vector3.create(1024, 1024),
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

test('text-shape align 1: if exist a reference snapshot should match with it', function* (context) {
  customAddEntity.clean()
  const textEntity = customAddEntity.addEntity()
  Transform.create(textEntity, {
    position: Vector3.create(8, 1, 8)
  })
  /* Text alignment has inverse behavior  */
  TextShape.createOrReplace(textEntity, {
    text: 'Bottom Center',
    fontSize: 2,
    textAlign: TextAlignMode.TAM_BOTTOM_CENTER
  })
  yield* waitTicks(15)

  const params: TakeAndCompareSnapshotRequest = {
    id: 'text shape 5',
    cameraPosition: Vector3.create(2, 2, 2),
    cameraTarget: Vector3.create(8, 1, 8),
    snapshotFrameSize: Vector3.create(1024, 1024),
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

test('text-shape align 2: if exist a reference snapshot should match with it', function* (context) {
  customAddEntity.clean()
  const textEntity = customAddEntity.addEntity()
  Transform.create(textEntity, {
    position: Vector3.create(8, 1, 8)
  })
  /* Text alignment has inverse behavior  */
  TextShape.createOrReplace(textEntity, {
    text: 'Middle Right',
    fontSize: 2,
    textAlign: TextAlignMode.TAM_MIDDLE_RIGHT
  })
  yield* waitTicks(15)

  const params: TakeAndCompareSnapshotRequest = {
    id: 'text shape 5',
    cameraPosition: Vector3.create(2, 2, 2),
    cameraTarget: Vector3.create(8, 1, 8),
    snapshotFrameSize: Vector3.create(1024, 1024),
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
