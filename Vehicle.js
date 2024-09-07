import React, { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { useBox } from '@react-three/cannon'
import * as THREE from 'three'

const Vehicle = React.forwardRef(({ position, wPressed, sPressed }, ref) => {
  const [vehicleRef, api] = useBox(() => ({
    mass: 500,
    position,
    args: [2, 1, 4], // Adjust size as needed
    type: 'Dynamic',
  }))

  const texture = useRef()
  const speed = 5 // Adjust this value to change the speed of the vehicle

  useEffect(() => {
    const loader = new THREE.TextureLoader()
    loader.load('/car-texture.jpg', (loadedTexture) => {
      texture.current = loadedTexture
    })
  }, [])

  useFrame((state) => {
    if (!vehicleRef.current) return

    const { rotation } = vehicleRef.current
    let velocity = [0, 0, 0]

    if (wPressed) {
      velocity = [
        Math.sin(rotation.y) * speed,
        0,
        Math.cos(rotation.y) * speed
      ]
    } else if (sPressed) {
      velocity = [
        -Math.sin(rotation.y) * speed,
        0,
        -Math.cos(rotation.y) * speed
      ]
    }

    api.velocity.set(...velocity)

    // Update rotation based on mouse position
    const { viewport, mouse } = state
    const x = (mouse.x * viewport.width) / 2
    const y = (mouse.y * viewport.height) / 2
    const targetRotation = Math.atan2(x, y)
    api.rotation.set(0, targetRotation, 0)
  })

  React.useImperativeHandle(ref, () => ({
    position: vehicleRef.current.position,
    rotation: vehicleRef.current.rotation,
  }))

  return (
    <mesh ref={vehicleRef} name="vehicle">
      <boxGeometry args={[2, 1, 4]} />
      {texture.current ? (
        <meshStandardMaterial map={texture.current} />
      ) : (
        <meshStandardMaterial color="blue" />
      )}
    </mesh>
  )
})

export default Vehicle