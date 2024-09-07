// components/Wheel.js
import React, { forwardRef } from 'react'
import { useBox } from '@react-three/cannon'

const Wheel = forwardRef(({ radius, position, isFront = false }, ref) => {
  // Adjust the box dimensions to simulate a cylinder
  const [wheelRef] = useBox(() => ({
    mass: 1,
    args: [radius, 0.5, radius], // Width, Height, Depth
    position,
  }))

  return (
    <mesh ref={wheelRef}>
      <boxGeometry args={[radius, 0.5, radius]} />
      <meshStandardMaterial color="black" />
    </mesh>
  )
})

export default Wheel
