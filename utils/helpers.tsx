import { Entity, Transform } from "@dcl/sdk/ecs"
import { Vector3 } from "@dcl/sdk/math"

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