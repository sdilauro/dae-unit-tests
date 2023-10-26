import ReactEcs, { Button } from "@dcl/sdk/react-ecs"

export const ui = () => {
  return (
    <Button
        value="Start Test"
        variant="primary"
        uiTransform={{ width: 80, height: 20, margin:{left:300, top:15} }}
        onMouseDown={() => { console.log('Testing 1, 2, 3, 4') }}
  />
  )
}