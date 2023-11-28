import { createBlackRoom } from './utils/black-room'
import './tests/material/index.test'
import './tests/gltf-container/index.test'
import './tests/transform/index.test'
import './tests/camera-mode/index.test'
import './tests/raycast/index.test'
import './tests/pointer-lock/index.test'

export function main(): void {
  createBlackRoom()
}
