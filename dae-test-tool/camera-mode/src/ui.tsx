import ReactEcs, { Button, Label, UiEntity } from "@dcl/sdk/react-ecs"

export const ui = () => {
  function testing(){
    console.log("testing")
  }
  return (
    <UiEntity >
      <Button
        value="start test"
        variant="primary"
        uiTransform={{ width: 80, height: 30, margin: "16px 0 8px 270px" }}
        onMouseDown={testing}
      />
    </UiEntity>
  )
}