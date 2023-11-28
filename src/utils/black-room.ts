import {
  CameraModeArea,
  Material,
  MeshRenderer,
  Transform,
  engine
} from '@dcl/sdk/ecs'
import type { Entity } from '@dcl/sdk/ecs'
import { Color4, Quaternion, Vector3 } from '@dcl/sdk/math'

function createWall(position: Vector3, rotation: Quaternion): Entity {
  const wall: Entity = engine.addEntity()
  Transform.create(wall, {
    position,
    rotation,
    scale: Vector3.create(15.5, 0.1, 15.5)
  })
  MeshRenderer.create(wall, {
    mesh: {
      $case: 'box',
      box: { uvs: [] }
    }
  })

  Material.setPbrMaterial(wall, {
    albedoColor: Color4.Black(),
    metallic: 1,
    roughness: 1
  })

  return wall
}

export function createBlackRoom(): void {
  const cameraArea = engine.addEntity()
  Transform.create(cameraArea, { position: Vector3.create(8, 0, 8) })
  CameraModeArea.create(cameraArea, {
    area: Vector3.create(15, 6, 15),
    mode: 0
  })

  createWall(
    Vector3.create(8, 0.1, 8),
    Quaternion.fromAngleAxis(0, Vector3.Up())
  )
  createWall(
    Vector3.create(8, 15, 8),
    Quaternion.fromAngleAxis(0, Vector3.Up())
  )
  createWall(
    Vector3.create(8, 7.5, 15.5),
    Quaternion.fromAngleAxis(90, Vector3.Left())
  )
  createWall(
    Vector3.create(8, 7.5, 15.5),
    Quaternion.fromAngleAxis(90, Vector3.Left())
  )
  createWall(
    Vector3.create(8, 7.5, 0.5),
    Quaternion.fromAngleAxis(90, Vector3.Left())
  )
  createWall(
    Vector3.create(15.5, 7.5, 8),
    Quaternion.fromAngleAxis(90, Vector3.Forward())
  )
  createWall(
    Vector3.create(0.5, 7.5, 8),
    Quaternion.fromAngleAxis(90, Vector3.Forward())
  )
}
