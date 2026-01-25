'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import GameHUD from '@/components/GameHUD';
import IsekaiIntro from '@/components/IsekaiIntro';
import { useGameStore } from '@/store/gameStore';

// Dynamically import Game3D to avoid SSR issues with Three.js
const Game3D = dynamic(() => import('@/components/Game3D'), { ssr: false });

export default function Home() {
  const { playerClass } = useGameStore();
  const [showGame, setShowGame] = useState(false);
  
  // Show intro until class is selected
  if (!showGame && !playerClass) {
    return <IsekaiIntro />;
  }
  
  // Auto-start game once class is selected
  if (!showGame && playerClass) {
    setTimeout(() => setShowGame(true), 100);
  }

  return (
    <main style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <Game3D />
      <GameHUD />
      
      {/* Welcome Message */}
      {showGame && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
          color: 'white',
          zIndex: 1000,
          pointerEvents: 'none',
          animation: 'fadeOut 4s forwards',
        }}>
          <h1 style={{
            fontSize: '56px',
            fontWeight: 'bold',
            margin: 0,
            textShadow: '0 0 20px rgba(0, 0, 0, 0.8), 0 0 40px rgba(255, 215, 0, 0.5)',
            background: 'linear-gradient(45deg, #ffd700, #ffed4e, #ffd700)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            Welcome to Another World
          </h1>
          <p style={{
            fontSize: '20px',
            opacity: 0.9,
            marginTop: '10px',
            textShadow: '0 0 10px rgba(0, 0, 0, 0.8)',
          }}>
            Your isekai adventure begins now!
          </p>
        </div>
      )}

      <style jsx global>{`
        @keyframes fadeOut {
          0% {
            opacity: 1;
          }
          70% {
            opacity: 1;
          }
          100% {
            opacity: 0;
          }
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.05);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.8);
          }
          to {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
        }

        body {
          margin: 0;
          padding: 0;
          overflow: hidden;
          background: #000;
        }

        * {
          box-sizing: border-box;
        }

        ::-webkit-scrollbar {
          width: 8px;
        }

        ::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.3);
        }

        ::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.3);
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.5);
        }
      `}</style>
    </main>
  );
}
