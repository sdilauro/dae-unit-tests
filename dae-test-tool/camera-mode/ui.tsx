import { Transform, engine } from "@dcl/sdk/ecs"
import { Color4, Vector3 } from "@dcl/sdk/math"
import ReactEcs, { Button, Label, UiEntity } from "@dcl/sdk/react-ecs"
import { movePlayerTo } from "~system/RestrictedActions"
import './index.test'

export const firstPersonEntity = engine.addEntity()
export const thirdPersonEntity = engine.addEntity()
export const scaledEntity = engine.addEntity()
export const rotatedEntity = engine.addEntity()

var testStage:number = 1

export const ui = () => {
  return (
    <UiEntity
      uiBackground={{ color: Color4.Black() }}
      uiTransform={{
        width: 285,
        height: 130,
        margin: { top: '10px', left: '190px' },
        display: 'flex',
        flexDirection: 'column',
      }}
      
    >
      <UiEntity uiTransform={{
        margin: { bottom: '10px'},
       
      }}>
        <Button
          value="First Person"
          variant="primary"
          uiTransform={{ width: 120, height: 30, margin: { left: 15, top: 10 } }}
          onMouseDown={() => { handleFirstPerson() }}
          disabled={testStage==1?false:true}
        />

        <Button
          value="Third Person"
          uiTransform={{ width: 120, height: 30, margin: { left: 15, top: 10 } }}
          onMouseDown={() => { handleThirdPerson() }}
          disabled={testStage==2?false:true}

        />
        
      </UiEntity>
      <UiEntity uiTransform={{
        margin: { bottom: '10px'},
      }}>
        <Button
          value="Scale Area"
          variant="primary"
          uiTransform={{ width: 120, height: 30, margin: { left: 15, top: 10 } }}
          onMouseDown={() => { handleScale() }}
          disabled={testStage==3?false:true}
        />
        <Button
          value="Rotate Area"
          variant="primary"
          uiTransform={{ width: 120, height: 30, margin: { left: 15, top: 10 } }}
          onMouseDown={() => { handleRotate() }}
          disabled={testStage==4?false:true}
        />
        
      </UiEntity>
      <Label
        value="Press buttons to test."
        fontSize={12}
        font="serif"
        textAlign="middle-center"
      />
      </UiEntity>
  )
  
  function handleFirstPerson() {
   
    Transform.deleteFrom(firstPersonEntity)
    testStage++
  }

  function handleThirdPerson() {
    
    Transform.deleteFrom(thirdPersonEntity)
    testStage++

  }

  function handleScale() {
   
    Transform.deleteFrom(scaledEntity)
    testStage++

  }

  function handleRotate() {

    Transform.deleteFrom(rotatedEntity)
    testStage++
 
  }
}