// hooks/useCursor.js
import { useEffect, useState } from 'react';

export function useCursor() {
  const [cursorPos, setCursorPos] = useState([0, 0]);

  useEffect(() => {
    function handleMouseMove(event) {
      setCursorPos([event.clientX, event.clientY]);
    }

    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return cursorPos;
}
