'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Sky, Stars, Cloud, Environment } from '@react-three/drei';
import { Physics, RigidBody, CuboidCollider } from '@react-three/rapier';
import * as THREE from 'three';
import { useGameStore } from '@/store/gameStore';

// Enemy Component
function EnemyMesh({ enemy }: { enemy: any }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { playerPosition, attackEnemy } = useGameStore();
  
  useFrame(() => {
    if (!meshRef.current || enemy.health <= 0) return;
    
    // Face player if aggressive
    if (enemy.aggressive) {
      const dx = playerPosition[0] - enemy.position[0];
      const dz = playerPosition[2] - enemy.position[2];
      const angle = Math.atan2(dx, dz);
      meshRef.current.rotation.y = angle;
    }
    
    // Bobbing animation
    meshRef.current.position.y = enemy.position[1] + Math.sin(Date.now() * 0.003) * 0.1;
  });
  
  const healthPercent = (enemy.health / enemy.maxHealth) * 100;
  const enemyColor = enemy.aggressive ? '#ff4444' : '#ffaa00';
  
  return (
    <group position={enemy.position}>
      <mesh
        ref={meshRef}
        onClick={() => attackEnemy(enemy.id)}
        castShadow
      >
        <boxGeometry args={[1, 1.5, 1]} />
        <meshStandardMaterial color={enemyColor} />
        
        {/* Enemy name tag */}
        <mesh position={[0, 1.2, 0]}>
          <planeGeometry args={[2, 0.3]} />
          <meshBasicMaterial color="#000000" opacity={0.7} transparent />
        </mesh>
      </mesh>
      
      {/* Health bar */}
      <mesh position={[0, 2, 0]}>
        <planeGeometry args={[1, 0.1]} />
        <meshBasicMaterial color="#ff0000" />
      </mesh>
      <mesh position={[0, 2, 0.01]}>
        <planeGeometry args={[healthPercent / 100, 0.1]} />
        <meshBasicMaterial color="#00ff00" />
      </mesh>
      
      {/* Level indicator */}
      <pointLight color={enemyColor} intensity={0.5} distance={5} />
    </group>
  );
}

// Player Character Component
function Player() {
  const meshRef = useRef<THREE.Mesh>(null);
  const bodyRef = useRef<any>(null);
  const auraRef = useRef<THREE.Mesh>(null);
  const { camera } = useThree();
  
  const {
    playerClass,
    updatePlayerPosition,
    updatePlayerRotation,
    setMoving,
    setAnimation,
    currentAnimation,
    auraActive,
    auraColor,
  } = useGameStore();

  const [movement, setMovement] = useState({
    forward: false,
    backward: false,
    left: false,
    right: false,
    jump: false,
  });

  const speed = 5;
  const jumpForce = 5;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key.toLowerCase()) {
        case 'w':
        case 'arrowup':
          setMovement(m => ({ ...m, forward: true }));
          break;
        case 's':
        case 'arrowdown':
          setMovement(m => ({ ...m, backward: true }));
          break;
        case 'a':
        case 'arrowleft':
          setMovement(m => ({ ...m, left: true }));
          break;
        case 'd':
        case 'arrowright':
          setMovement(m => ({ ...m, right: true }));
          break;
        case ' ':
          setMovement(m => ({ ...m, jump: true }));
          break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.key.toLowerCase()) {
        case 'w':
        case 'arrowup':
          setMovement(m => ({ ...m, forward: false }));
          break;
        case 's':
        case 'arrowdown':
          setMovement(m => ({ ...m, backward: false }));
          break;
        case 'a':
        case 'arrowleft':
          setMovement(m => ({ ...m, left: false }));
          break;
        case 'd':
        case 'arrowright':
          setMovement(m => ({ ...m, right: false }));
          break;
        case ' ':
          setMovement(m => ({ ...m, jump: false }));
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useFrame((state, delta) => {
    if (!bodyRef.current || !meshRef.current) return;

    const velocity = bodyRef.current.linvel();
    const position = bodyRef.current.translation();
    
    let velocityX = velocity.x;
    let velocityZ = velocity.z;
    let isMoving = false;

    // Movement
    if (movement.forward) {
      velocityZ = -speed;
      isMoving = true;
    }
    if (movement.backward) {
      velocityZ = speed;
      isMoving = true;
    }
    if (movement.left) {
      velocityX = -speed;
      isMoving = true;
    }
    if (movement.right) {
      velocityX = speed;
      isMoving = true;
    }

    // Normalize diagonal movement
    if ((movement.forward || movement.backward) && (movement.left || movement.right)) {
      velocityX *= 0.707;
      velocityZ *= 0.707;
    }

    bodyRef.current.setLinvel({ x: velocityX, y: velocity.y, z: velocityZ }, true);

    // Jump
    if (movement.jump && Math.abs(velocity.y) < 0.1) {
      bodyRef.current.setLinvel({ x: velocityX, y: jumpForce, z: velocityZ }, true);
      setAnimation('jump');
    }

    // Update animation
    if (isMoving && currentAnimation !== 'jump') {
      setAnimation('run');
    } else if (!isMoving && currentAnimation !== 'jump') {
      setAnimation('idle');
    }

    setMoving(isMoving);

    // Rotation based on movement
    if (velocityX !== 0 || velocityZ !== 0) {
      const angle = Math.atan2(velocityX, velocityZ);
      meshRef.current.rotation.y = angle;
      updatePlayerRotation(angle);
    }
    
    // Animate aura
    if (auraRef.current) {
      auraRef.current.rotation.y += delta * 2;
      auraRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 3) * 0.1);
    }

    // Update camera to follow player
    camera.position.lerp(
      new THREE.Vector3(position.x, position.y + 10, position.z + 15),
      0.1
    );
    camera.lookAt(position.x, position.y + 2, position.z);

    updatePlayerPosition([position.x, position.y, position.z]);
  });

  const getClassColor = () => {
    const colors: Record<string, string> = {
      'swordsman': '#ff4444',
      'fire-mage': '#ff6600',
      'water-mage': '#00aaff',
      'light-mage': '#ffff00',
      'dark-mage': '#9900ff',
      'earth-mage': '#885522',
      'archer': '#00ff00',
      'healer': '#ff88ff',
      'summoner': '#00ffff',
    };
    return colors[playerClass] || '#4080ff';
  };

  return (
    <RigidBody ref={bodyRef} position={[0, 2, 0]} colliders={false}>
      <CuboidCollider args={[0.5, 1, 0.5]} />
      <mesh ref={meshRef} castShadow>
        {/* Body */}
        <boxGeometry args={[1, 2, 0.8]} />
        <meshStandardMaterial color={getClassColor()} />
        
        {/* Head */}
        <mesh position={[0, 1.3, 0]} castShadow>
          <sphereGeometry args={[0.4, 16, 16]} />
          <meshStandardMaterial color="#ffcc80" />
        </mesh>
        
        {/* Arms */}
        <mesh position={[-0.7, 0.3, 0]} castShadow>
          <boxGeometry args={[0.3, 1, 0.3]} />
          <meshStandardMaterial color={getClassColor()} />
        </mesh>
        <mesh position={[0.7, 0.3, 0]} castShadow>
          <boxGeometry args={[0.3, 1, 0.3]} />
          <meshStandardMaterial color={getClassColor()} />
        </mesh>
        
        {/* Legs */}
        <mesh position={[-0.3, -1.3, 0]} castShadow>
          <boxGeometry args={[0.3, 1.2, 0.3]} />
          <meshStandardMaterial color="#303060" />
        </mesh>
        <mesh position={[0.3, -1.3, 0]} castShadow>
          <boxGeometry args={[0.3, 1.2, 0.3]} />
          <meshStandardMaterial color="#303060" />
        </mesh>
        
        {/* Mana Aura Effect */}
        {auraActive && (
          <mesh ref={auraRef} position={[0, 0, 0]}>
            <torusGeometry args={[1.5, 0.1, 16, 100]} />
            <meshStandardMaterial
              color={auraColor}
              emissive={auraColor}
              emissiveIntensity={2}
              transparent
              opacity={0.6}
            />
          </mesh>
        )}
      </mesh>
      
      {/* Class-specific glow */}
      <pointLight color={getClassColor()} intensity={auraActive ? 3 : 1} distance={10} />
    </RigidBody>
  );
}

// Pet Companion
function PetCompanion() {
  const meshRef = useRef<THREE.Mesh>(null);
  const { activePet, playerPosition } = useGameStore();
  
  useFrame((state) => {
    if (!meshRef.current || !activePet) return;
    
    // Follow player with offset
    const targetX = playerPosition[0] + Math.sin(state.clock.elapsedTime) * 2;
    const targetZ = playerPosition[2] + Math.cos(state.clock.elapsedTime) * 2;
    
    meshRef.current.position.lerp(
      new THREE.Vector3(targetX, playerPosition[1] + 0.5, targetZ),
      0.05
    );
    
    // Bobbing animation
    meshRef.current.position.y += Math.sin(state.clock.elapsedTime * 3) * 0.05;
    meshRef.current.rotation.y += 0.02;
  });

  if (!activePet) return null;

  const getPetColor = () => {
    switch (activePet.type) {
      case 'dragon': return '#ff4444';
      case 'wolf': return '#888888';
      case 'phoenix': return '#ffaa00';
      case 'tiger': return '#ff8800';
      case 'unicorn': return '#ffffff';
      case 'griffin': return '#8866ff';
      case 'fox': return '#ff6600';
      case 'owl': return '#8B4513';
      default: return '#ffffff';
    }
  };

  return (
    <mesh ref={meshRef} castShadow position={[2, 1, 2]}>
      <sphereGeometry args={[0.6, 16, 16]} />
      <meshStandardMaterial color={getPetColor()} emissive={getPetColor()} emissiveIntensity={0.3} />
      
      {/* Pet glow effect */}
      <pointLight color={getPetColor()} intensity={1} distance={5} />
    </mesh>
  );
}

// Procedural Terrain
function Terrain() {
  const { currentZone } = useGameStore();
  
  return (
    <>
      {/* Ground */}
      <RigidBody type="fixed" colliders="cuboid">
        <mesh receiveShadow position={[0, -0.5, 0]}>
          <boxGeometry args={[200, 1, 200]} />
          <meshStandardMaterial color="#3a8a3a" />
        </mesh>
      </RigidBody>
      
      {/* Procedural obstacles and collectibles */}
      {Array.from({ length: 100 }).map((_, i) => {
        const x = (Math.random() - 0.5) * 180;
        const z = (Math.random() - 0.5) * 180;
        const type = Math.random();
        
        if (type < 0.3) {
          // Trees
          return (
            <group key={`tree-${i}`} position={[x, 0, z]}>
              <RigidBody type="fixed" colliders="cuboid">
                <mesh castShadow position={[0, 2, 0]}>
                  <cylinderGeometry args={[0.3, 0.4, 4]} />
                  <meshStandardMaterial color="#654321" />
                </mesh>
                <mesh castShadow position={[0, 5, 0]}>
                  <coneGeometry args={[2, 4, 8]} />
                  <meshStandardMaterial color="#228B22" />
                </mesh>
              </RigidBody>
            </group>
          );
        } else if (type < 0.5) {
          // Rocks
          return (
            <RigidBody key={`rock-${i}`} type="fixed" position={[x, 0.5, z]}>
              <mesh castShadow>
                <dodecahedronGeometry args={[0.8]} />
                <meshStandardMaterial color="#808080" />
              </mesh>
            </RigidBody>
          );
        } else if (type < 0.7) {
          // Collectible crystals
          return (
            <mesh key={`crystal-${i}`} position={[x, 1, z]}>
              <octahedronGeometry args={[0.5]} />
              <meshStandardMaterial 
                color="#00ffff" 
                emissive="#00ffff" 
                emissiveIntensity={0.5}
                transparent
                opacity={0.8}
              />
            </mesh>
          );
        }
        return null;
      })}
    </>
  );
}

// Floating particles and effects
function EnvironmentEffects() {
  const particlesRef = useRef<THREE.Points>(null);
  
  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y += 0.0005;
    }
  });
  
  const particleCount = 1000;
  const positions = new Float32Array(particleCount * 3);
  
  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 100;
    positions[i * 3 + 1] = Math.random() * 50;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 100;
  }
  
  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.1} color="#ffffff" transparent opacity={0.6} />
    </points>
  );
}

export default function Game3D() {
  const { enemies, spawnEnemies } = useGameStore();
  
  // Spawn initial enemies
  useEffect(() => {
    if (enemies.length === 0) {
      spawnEnemies(20);
    }
  }, []);
  
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas shadows camera={{ position: [0, 10, 15], fov: 60 }}>
        <Sky sunPosition={[100, 20, 100]} />
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        <ambientLight intensity={0.4} />
        <directionalLight
          position={[10, 10, 5]}
          intensity={1}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <fog attach="fog" args={['#87CEEB', 30, 100]} />
        
        <Physics gravity={[0, -9.81, 0]}>
          <Player />
          <PetCompanion />
          <Terrain />
          
          {/* Render all enemies */}
          {enemies.map(enemy => (
            <EnemyMesh key={enemy.id} enemy={enemy} />
          ))}
        </Physics>
        
        <EnvironmentEffects />
        <Environment preset="sunset" />
      </Canvas>
    </div>
  );
}
