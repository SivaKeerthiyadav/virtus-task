import React from 'react'

function GameOver({ score }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75">
      <div className="bg-white p-8 rounded-lg text-center">
        <h2 className="text-3xl font-bold mb-4">Game Over</h2>
        <p className="text-xl mb-4">Your score: {score}</p>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => window.location.reload()}
        >
          Play Again
        </button>
      </div>
    </div>
  )
}

export default GameOver