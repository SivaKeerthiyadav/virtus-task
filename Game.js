import React, { useState, useEffect, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { Physics } from '@react-three/cannon'
import { OrbitControls, PerspectiveCamera, Text } from '@react-three/drei'
import Vehicle from './Vehicle'
import Ground from './Ground'
import FallingShape from './FallingShape'
import { supabase } from '../lib/supabase'

function Game() {
  const [gameState, setGameState] = useState('start') // 'start', 'playing', 'over'
  const [score, setScore] = useState(0)
  const [playerName, setPlayerName] = useState('')
  const vehicleRef = useRef()
  const [wPressed, setWPressed] = useState(false)
  const [sPressed, setSPressed] = useState(false)
  const [shapes, setShapes] = useState([])
  const scoreRef = useRef(0)
  const [dbConnected, setDbConnected] = useState(false)
  const [dbError, setDbError] = useState(null)
  const [scoreSaved, setScoreSaved] = useState(false) // To track if the score is saved

  useEffect(() => {
    checkDatabaseConnection()
  }, [])

  const checkDatabaseConnection = async () => {
    try {
      const { data, error } = await supabase.from('scores').select('count', { count: 'exact' })
      if (error) {
        setDbConnected(false)
        setDbError(error.message)
      } else {
        setDbConnected(true)
        setDbError(null)
      }
    } catch (error) {
      setDbConnected(false)
      setDbError(error.message)
    }
  }

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'w') setWPressed(true)
      if (e.key === 's') setSPressed(true)
    }
    const handleKeyUp = (e) => {
      if (e.key === 'w') setWPressed(false)
      if (e.key === 's') setSPressed(false)
    }
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  useEffect(() => {
    let scoreInterval
    let shapeInterval

    if (gameState === 'playing') {
      scoreInterval = setInterval(() => {
        scoreRef.current += 1
        setScore(scoreRef.current)
      }, 1000)

      shapeInterval = setInterval(() => {
        setShapes((prev) => [...prev, { id: Date.now() }])
      }, 2000)
    }

    return () => {
      clearInterval(scoreInterval)
      clearInterval(shapeInterval)
    }
  }, [gameState])

  const handleStartGame = () => {
    if (playerName.trim() === '') {
      alert('Please enter your name before starting the game.')
      return
    }
    setGameState('playing')
    setScore(0)
    scoreRef.current = 0
    setShapes([])
    setScoreSaved(false) // Reset scoreSaved when starting a new game
  }

  const handleGameOver = async () => {
    if (gameState !== 'over') {
      setGameState('over')
      
      if (!scoreSaved && dbConnected) {
        // Ask for confirmation before saving the score
        const userConfirmed = window.confirm(`Game Over! Your score is ${scoreRef.current}. Do you want to save it?`)
        
        if (userConfirmed) {
          try {
            const { data, error } = await supabase
              .from('scores')
              .insert({
                player_name: JSON.stringify({ name: playerName }),
                score: scoreRef.current
              })
  
            if (error) {
              console.error('Error saving score:', error)
            } else {
              console.log('Score saved successfully:', data)
              alert(`Score saved successfully: ${scoreRef.current}`) // Show success message
            }
  
            setScoreSaved(true) // Mark the score as saved
          } catch (error) {
            console.error('Error saving score:', error)
          }
        } else {
          console.log('Score was not saved.')
        }
      } else if (!dbConnected) {
        console.error('Unable to save score: Database not connected')
      }
    }
  }
  

  const handleShapeRemoval = (id) => {
    setShapes((prev) => prev.filter((shape) => shape.id !== id))
  }

  return (
    <div className="w-screen h-screen">
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 5, 10]} />
        <OrbitControls />
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 15, 10]} angle={0.3} />
        <Physics>
          {gameState === 'playing' && (
            <>
              <Vehicle ref={vehicleRef} position={[0, 3, 0]} wPressed={wPressed} sPressed={sPressed} />
              {shapes.map((shape) => (
                <FallingShape key={shape.id} onCollision={handleGameOver} onRemove={() => handleShapeRemoval(shape.id)} />
              ))}
            </>
          )}
          <Ground />
        </Physics>
        {gameState === 'start' && (
          <Text position={[0, 2, 0]} fontSize={1} color="white">
            Enter your name and press Start
          </Text>
        )}
        {gameState === 'over' && (
          <Text position={[0, 2, 0]} fontSize={1} color="white">
            Game Over! Score: {scoreRef.current}
            {'\n'}Press Start to Play Again
          </Text>
        )}
      </Canvas>
      <div className="absolute top-0 left-0 p-4 text-white text-2xl">
        {gameState === 'playing' && `Score: ${score}`}
      </div>
      <div className="absolute bottom-0 left-0 p-4 text-white text-xl">
        Controls: W (forward), S (backward), Mouse (turn)
      </div>
      {gameState !== 'playing' && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-black bg-opacity-50 p-8 rounded-lg">
            {dbConnected === false && (
              <p className="text-red-500 mb-4">
                Database not connected. Error: {dbError}
              </p>
            )}
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Enter your name"
              className="mb-4 p-2 w-full text-black"
            />
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
              onClick={handleStartGame}
            >
              {gameState === 'start' ? 'Start Game' : 'Play Again'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Game
