'use client';

import React, { useRef, useEffect } from 'react';

interface MobileControlsProps {
  onMove: (x: number, y: number) => void;
  onJump: () => void;
  onTouch: (touching: boolean) => void;
}

export default function MobileControls({ onMove, onJump, onTouch }: MobileControlsProps) {
  const joystickRef = useRef<HTMLDivElement>(null);
  const stickRef = useRef<HTMLDivElement>(null);
  const touchIdRef = useRef<number | null>(null);

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      if (!joystickRef.current || !stickRef.current) return;
      
      const touch = e.touches[0];
      const rect = joystickRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      touchIdRef.current = touch.identifier;
      onTouch(true);
      handleTouchMove(e);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!joystickRef.current || !stickRef.current || touchIdRef.current === null) return;
      
      const touch = Array.from(e.touches).find(t => t.identifier === touchIdRef.current);
      if (!touch) return;
      
      const rect = joystickRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      let deltaX = touch.clientX - centerX;
      let deltaY = touch.clientY - centerY;
      
      const maxDistance = rect.width / 2;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      
      if (distance > maxDistance) {
        deltaX = (deltaX / distance) * maxDistance;
        deltaY = (deltaY / distance) * maxDistance;
      }
      
      stickRef.current.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
      
      // Normalize to -1 to 1 range
      const normalizedX = deltaX / maxDistance;
      const normalizedY = deltaY / maxDistance;
      
      onMove(normalizedX, normalizedY);
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!stickRef.current) return;
      
      const endedTouch = Array.from(e.changedTouches).find(t => t.identifier === touchIdRef.current);
      if (!endedTouch) return;
      
      touchIdRef.current = null;
      stickRef.current.style.transform = 'translate(0, 0)';
      onMove(0, 0);
      onTouch(false);
    };

    const joystick = joystickRef.current;
    if (joystick) {
      joystick.addEventListener('touchstart', handleTouchStart);
      joystick.addEventListener('touchmove', handleTouchMove);
      joystick.addEventListener('touchend', handleTouchEnd);
      joystick.addEventListener('touchcancel', handleTouchEnd);
    }

    return () => {
      if (joystick) {
        joystick.removeEventListener('touchstart', handleTouchStart);
        joystick.removeEventListener('touchmove', handleTouchMove);
        joystick.removeEventListener('touchend', handleTouchEnd);
        joystick.removeEventListener('touchcancel', handleTouchEnd);
      }
    };
  }, [onMove, onTouch]);

  // Check if mobile device
  const isMobile = typeof window !== 'undefined' && 
    ('ontouchstart' in window || navigator.maxTouchPoints > 0);

  if (!isMobile) return null;

  return (
    <>
      {/* Virtual Joystick */}
      <div
        ref={joystickRef}
        style={{
          position: 'fixed',
          bottom: '80px',
          left: '80px',
          width: '120px',
          height: '120px',
          borderRadius: '50%',
          background: 'rgba(0, 0, 0, 0.3)',
          border: '3px solid rgba(255, 255, 255, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          touchAction: 'none',
          userSelect: 'none',
          zIndex: 1000,
        }}
      >
        <div
          ref={stickRef}
          style={{
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.8)',
            border: '2px solid #4CAF50',
            transition: 'transform 0.1s',
            pointerEvents: 'none',
          }}
        />
      </div>

      {/* Jump Button */}
      <button
        onTouchStart={(e) => {
          e.preventDefault();
          onJump();
        }}
        style={{
          position: 'fixed',
          bottom: '80px',
          right: '80px',
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          background: 'rgba(255, 100, 100, 0.8)',
          border: '3px solid rgba(255, 255, 255, 0.8)',
          color: 'white',
          fontSize: '28px',
          fontWeight: 'bold',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          touchAction: 'none',
          userSelect: 'none',
          zIndex: 1000,
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)',
        }}
      >
        ⬆️
      </button>

      {/* Mobile Instructions */}
      <div style={{
        position: 'fixed',
        top: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        background: 'rgba(0, 0, 0, 0.7)',
        padding: '10px 20px',
        borderRadius: '10px',
        color: 'white',
        fontSize: '14px',
        zIndex: 1000,
        textAlign: 'center',
      }}>
        📱 Mobile Controls Active<br/>
        <small>Left: Move | Right: Jump</small>
      </div>
    </>
  );
}
