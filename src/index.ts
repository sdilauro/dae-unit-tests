export * from '@dcl/sdk'
import { ReactEcsRenderer } from '@dcl/sdk/react-ecs'
import { ui } from '../dae-test-tool/camera-mode/ui'
import '../dae-test-tool/camera-mode/index.test'

ReactEcsRenderer.setUiRenderer(ui)