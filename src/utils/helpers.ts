import type { Vector3 } from '@dcl/sdk/math'
import { movePlayerTo } from '~system/RestrictedActions'
import { assert } from './../testing/assert'

export function* assertMovePlayerTo(
  newRelativePosition: Vector3,
  cameraTarget: Vector3
): Generator<void> {
  let wasResolved: boolean = false
  movePlayerTo({
    newRelativePosition,
    cameraTarget
  })
    .then(() => {
      wasResolved = true
    })
    .catch((error) => {
      throw error
    })
  yield
  assert(wasResolved, 'Move player to was not resolved')
}
