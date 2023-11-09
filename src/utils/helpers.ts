import type { Entity, CameraType } from '@dcl/sdk/ecs'
import type { Color4 } from '@dcl/sdk/math'
import { CameraModeArea, Material, MeshRenderer, TextShape, Transform, engine } from '@dcl/sdk/ecs'
import { Quaternion, Vector3 } from '@dcl/sdk/math'
import { assert } from './../testing/assert'
import { movePlayerTo } from '~system/RestrictedActions'

export function* waitTicksUntil(fn: () => boolean): Generator<void> {
  while (true) {
    if (!fn()) {
      yield
    } else {
      return
    }
  }
}

export function* waitTriggerTest(entity: Entity): Generator<void> {
  Transform.create(entity, { position: Vector3.One() })
  yield* waitTicksUntil(() => Transform.getOrNull(entity) !== null)
}

// this function is only for wait n ticks
export function* waitTicks(n: number): Generator<void> {
  for (let i: number = 0; i < n; i++) {
    yield
  }
}

export function* assertMovePlayerTo(newRelativePosition: Vector3, cameraTarget: Vector3): Generator<void> {
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

export function lazyCreateEntity() : {
  get: () => Entity
 }{
  let myEntity = engine.RootEntity

  function addSystem(): void {
    myEntity = customAddEntity.addEntity()
    engine.removeSystem(addSystem)
  }

  engine.addSystem(addSystem)

  return {
    get() {
      return myEntity
    }
  }
}

function createAddEntityFunction() : {
  addEntity: () => Entity
  clean: () => void
 } {
  let arr: Entity[] = []

  return {
    addEntity() {
      const newEntity = engine.addEntity()
      arr.push(newEntity)
      return newEntity
    },
    clean() {
      for (const entity of arr) {
        engine.removeEntity(entity)
      }
      arr = []
    }
  }
}

export const customAddEntity = createAddEntityFunction()

export function createAreaMode(
  position: Vector3,
  rotationDegrees: number,
  areaRotationDegrees: number,
  text: string,
  subname: string,
  mode: CameraType,
  floorColor: Color4,
  areaColor: Color4,
  areaScale: Vector3
): Record<string, Entity> {
  const obj: Record<string, Entity> = {}
  // create center to manipulate entities
  obj['center' + subname] = customAddEntity.addEntity()
  Transform.create(obj['center' + subname], {
    position,
    rotation: Quaternion.fromAngleAxis(rotationDegrees, Vector3.Up())
  })

  obj['child' + subname] = customAddEntity.addEntity()
  Transform.create(obj['child' + subname], {
    parent: obj['center' + subname],
    rotation: Quaternion.fromAngleAxis(-90, Vector3.Left())
  })

  obj['floor' + subname] = customAddEntity.addEntity()
  MeshRenderer.setPlane(obj['floor' + subname])
  Material.setPbrMaterial(obj['floor' + subname], { albedoColor: floorColor })
  Transform.create(obj['floor' + subname], { parent: obj['child' + subname], scale: Vector3.create(6, 2, 1) })

  obj['text' + subname] = customAddEntity.addEntity()
  Transform.create(obj['text' + subname], { parent: obj['child' + subname], position: Vector3.create(0, 0, -0.01) })
  TextShape.create(obj['text' + subname], { text, fontSize: 8 })

  // These entities declare and show the real area mode
  obj['cameraMode' + subname] = customAddEntity.addEntity()
  Transform.create(obj['cameraMode' + subname], {
    parent: obj['center' + subname],
    position: Vector3.create(0, 2, 0),
    rotation: Quaternion.fromAngleAxis(areaRotationDegrees, Vector3.Up()),
    scale: areaScale
  })
  CameraModeArea.create(obj['cameraMode' + subname], { area: Vector3.create(6, 4, 2), mode })

  obj['area' + subname] = customAddEntity.addEntity()
  Transform.create(obj['area' + subname], { parent: obj['cameraMode' + subname], scale: Vector3.create(6, 4, 2) })
  MeshRenderer.setBox(obj['area' + subname])
  Material.setPbrMaterial(obj['area' + subname], { albedoColor: areaColor })

  return obj
}
