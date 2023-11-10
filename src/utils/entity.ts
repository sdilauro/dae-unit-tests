import type { Entity } from '@dcl/sdk/ecs'
import { engine } from '@dcl/sdk/ecs'

export function lazyCreateEntity(): {
  get: () => Entity
} {
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

function createAddEntityFunction(): {
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
