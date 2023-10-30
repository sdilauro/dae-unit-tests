import ReactEcs, { Button } from "@dcl/sdk/react-ecs"
import './index.test'

export const ui = () => {
  return (
    <Button
        value="Start Test"
        variant="primary"
        uiTransform={{ width: 80, height: 20, margin:{left:300, top:15} }}
        onMouseDown={() => { handleButton() }}
  />
    )
    function handleButton() {
      console.log('Testing 1, 2, 3, 4')
    }
}