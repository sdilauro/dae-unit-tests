import { GltfContainer, GltfContainerLoadingState, LoadingState, Transform } from '@dcl/sdk/ecs'
import { Vector3 } from '@dcl/sdk/math'
import { customAddEntity } from '../../utils/entity'
import { assertSnapshot } from '../../utils/snapshot-test'
import { test } from './../../testing'
import { assert } from '../../testing/assert'

test('gltfContainer: avocado model loads correctly', async function (context) {
  customAddEntity.clean()
  const avocado = customAddEntity.addEntity()
  Transform.create(avocado, {
    position: Vector3.create(8, 1, 8)
  })
  GltfContainer.create(avocado, {
    src: 'src/models/avocado.glb'
  })

  assert(
    await context.helpers.waitTicksUntil(() => {
      return (
        GltfContainerLoadingState.getOrNull(avocado) !== null &&
        GltfContainerLoadingState.get(avocado).currentState !== LoadingState.LOADING
      )
    }, 10000),
    'timeout waiting loading avocado'
  )

  assert(GltfContainerLoadingState.get(avocado).currentState === LoadingState.FINISHED)
  
  // TODO: sometimes in godot the gltf is not added immediately it's loaded
  await context.helpers.waitNTicks(1) 

  await assertSnapshot('screenshot/$explorer_gltfcontaing_avocado.png', Vector3.create(1, 1, 1), Vector3.create(8, 1, 8))
})

// test('gltfContainer: H.E.V Mark IV model loads correctly', function* (context) {
//   customAddEntity.clean()
//   const hev = customAddEntity.addEntity()
//   Transform.create(hev, {
//     position: Vector3.create(8, 0, 8),
//     scale: Vector3.create(0.03, 0.03, 0.03)
//   })
//   GltfContainer.create(hev, {
//     src: 'src/models/hevmarkiv.glb'
//   })

//   const params: TakeAndCompareSnapshotRequest = {
//     id: 'gltfcontainer hev',
//     cameraPosition: Vector3.create(1, 1, 1),
//     cameraTarget: Vector3.create(8, 1, 8),
//     snapshotFrameSize: Vector3.create(1024, 1024),
//     tolerance: 0.8
//   }

//   const result: TakeAndCompareSnapshotResponse = (
//     Testing as any
//   ).takeAndCompareSnapshot(params)
//   if (!result.wasExist) {
//     Error(
//       'This is the first time the tool is run. The test took the reference snapshots for future testing.'
//     )
//   }

//   assertEquals(result.isMatch, true, `snapshot doesn't match with reference`)
// })
