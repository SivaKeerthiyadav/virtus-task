import React, { useEffect } from 'react'
import { useBox } from '@react-three/cannon'

const FallingShape = ({ onCollision, onRemove }) => {
  const [ref, api] = useBox(() => ({
    mass: 1,
    position: [Math.random() * 10 - 5, 15, Math.random() * 10 - 5],
    args: [1, 1, 1],
    onCollide: (e) => {
      if (e.body.name === 'ground') {
        onRemove()
      } else if (e.body.name === 'vehicle') {
        onCollision()
      }
    },
  }))

  useEffect(() => {
    return () => {
      api.position.set(0, 20, 0)
      api.velocity.set(0, 0, 0)
    }
  }, [api])

  return (
    <mesh ref={ref}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="red" />
    </mesh>
  )
}

export default FallingShape