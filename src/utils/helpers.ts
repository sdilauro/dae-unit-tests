import {
  Transform,
  engine,
  type Entity,
  type TransformTypeWithOptionals
} from '@dcl/sdk/ecs'
import type { Vector3 } from '@dcl/sdk/math'
import { movePlayerTo } from '~system/RestrictedActions'
import { assert } from './../testing/assert'
import { type TestFunctionContext } from '../testing/types'
import { customAddEntity } from './entity'

export async function assertMovePlayerTo(
  ctx: TestFunctionContext,
  newRelativePosition: Vector3,
  cameraTarget: Vector3
): Promise<void> {
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
  await ctx.helpers.waitNTicks(1)

  assert(wasResolved, 'Move player to was not resolved')
}

export function createChainedEntities(
  transforms: Array<Omit<TransformTypeWithOptionals, 'parent'>>,
  parent: Entity = engine.RootEntity
): Entity {
  return transforms.reduce((parent, transform) => {
    const entity = customAddEntity.addEntity()
    Transform.create(entity, { ...transform, parent })
    return entity
  }, parent)
}
