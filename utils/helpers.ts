import { CameraMode, CameraType, Entity, Transform, engine } from "@dcl/sdk/ecs"
import { Vector3 } from "@dcl/sdk/math"
import { assert } from "@dcl/sdk/testing/assert"
import { movePlayerTo } from "~system/RestrictedActions"

export function* waitTriggerTest(entity: Entity) {
    Transform.create(entity, { position: Vector3.One() })
    while (true) {
        if (Transform.getOrNull(entity) !== null) {
            yield
        } else {
            return
        }
    }
}

//this function is only for wait n ticks
export function* waitTicks(n: number) {
    for (let i: number = 0; i < n; i++) {
        yield
    }
}

export function* assertMovePlayerTo(newRelativePosition: Vector3, cameraTarget: Vector3) {
    let wasResolved: boolean = false
    movePlayerTo({
        newRelativePosition,
        cameraTarget
    }).then(() => {
        wasResolved = true
    }).catch((error) => { throw error })
    yield
    assert(wasResolved, 'Move player to was not resolved')
}


export function lazyCreateEntity() {
    let myEntity = engine.RootEntity

    function addSystem() {
        myEntity = engine.addEntity()
        engine.removeSystem(addSystem)
    }

    engine.addSystem(addSystem)

    return {
        get() {
            return myEntity
        }
    }
}



function createAddEntityFunction() {
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

