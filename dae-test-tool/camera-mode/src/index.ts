export * from '@dcl/sdk'
import { ReactEcsRenderer } from '@dcl/sdk/react-ecs'
import { ui } from './ui'
import './camera-mode.test'

ReactEcsRenderer.setUiRenderer(ui)

