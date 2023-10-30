import ReactEcs, { Button } from "@dcl/sdk/react-ecs"
import './index.test'
import { Transform, engine } from "@dcl/sdk/ecs"

export const testEntityStartTest = engine.addEntity()

export const ui = () => {
  return (
    <Button
      value="Start Test"
      variant="primary"
      uiTransform={{ width: 80, height: 20, margin: { left: 300, top: 15 } }}
      onMouseDown={() => { handleButton() }}
    />
  )
  function handleButton() {
    Transform.deleteFrom(testEntityStartTest)
  }
}