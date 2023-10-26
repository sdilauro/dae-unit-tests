export * from '@dcl/sdk'
import { ReactEcsRenderer } from '@dcl/sdk/react-ecs'
import { ui } from './ui'
import './index.test'

ReactEcsRenderer.setUiRenderer(ui)

