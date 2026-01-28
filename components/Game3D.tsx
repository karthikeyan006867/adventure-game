'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Sky, Stars, Cloud, Environment } from '@react-three/drei';
import { Physics, RigidBody, CuboidCollider } from '@react-three/rapier';
import * as THREE from 'three';
import { useGameStore } from '@/store/gameStore';
import MobileControls from './MobileControls';

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
        <meshToonMaterial color={enemyColor} />
        
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
function Player({ mobileMove, mobileJump }: { mobileMove?: { x: number; y: number }, mobileJump?: boolean }) {
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

  const speed = 6;
  const jumpForce = 7;

  // Handle mobile jump
  useEffect(() => {
    if (mobileJump) {
      setMovement(m => ({ ...m, jump: true }));
    }
  }, [mobileJump]);

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
    
    // Check if on ground (important for jumping)
    const onGround = position.y < 3 && Math.abs(velocity.y) < 1;
    
    let moveX = 0;
    let moveZ = 0;
    let isMoving = false;

    // Keyboard movement
    if (movement.forward) {
      moveZ -= 1;
      isMoving = true;
    }
    if (movement.backward) {
      moveZ += 1;
      isMoving = true;
    }
    if (movement.left) {
      moveX -= 1;
      isMoving = true;
    }
    if (movement.right) {
      moveX += 1;
      isMoving = true;
    }

    // Mobile touch movement
    if (mobileMove && (Math.abs(mobileMove.x) > 0.1 || Math.abs(mobileMove.y) > 0.1)) {
      moveX += mobileMove.x;
      moveZ += mobileMove.y;
      isMoving = true;
    }

    // Normalize diagonal movement
    if (moveX !== 0 || moveZ !== 0) {
      const length = Math.sqrt(moveX * moveX + moveZ * moveZ);
      moveX /= length;
      moveZ /= length;
    }

    // Apply movement speed
    const targetVelocityX = moveX * speed;
    const targetVelocityZ = moveZ * speed;

    // Smooth velocity change
    const newVelocityX = THREE.MathUtils.lerp(velocity.x, targetVelocityX, 0.3);
    const newVelocityZ = THREE.MathUtils.lerp(velocity.z, targetVelocityZ, 0.3);

    // Set velocity (preserve Y for gravity, clamp to prevent ground penetration)
    const clampedY = Math.max(velocity.y, position.y < 1.5 ? 0 : velocity.y);
    bodyRef.current.setLinvel({ x: newVelocityX, y: clampedY, z: newVelocityZ }, true);

    // Keep player above ground
    if (position.y < 1.5) {
      bodyRef.current.setTranslation({ x: position.x, y: 2, z: position.z }, true);
    }

    // Jump only when on ground
    if (movement.jump && onGround) {
      bodyRef.current.setLinvel({ x: newVelocityX, y: jumpForce, z: newVelocityZ }, true);
      setAnimation('jump');
      setMovement(m => ({ ...m, jump: false })); // Prevent continuous jumping
    }

    // Update animation based on state
    if (isMoving && onGround) {
      setAnimation('run');
    } else if (onGround) {
      setAnimation('idle');
    }

    setMoving(isMoving);

    // Rotation based on movement
    if (newVelocityX !== 0 || newVelocityZ !== 0) {
      const angle = Math.atan2(newVelocityX, newVelocityZ);
      meshRef.current.rotation.y = angle;
      updatePlayerRotation(angle);
    }
    
    // Animate aura
    if (auraRef.current) {
      auraRef.current.rotation.y += delta * 2;
      auraRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 3) * 0.1);
    }

    // MMORPG-style third-person camera
    const cameraOffset = new THREE.Vector3(0, 8, 12);
    const targetCameraPosition = new THREE.Vector3(
      position.x + cameraOffset.x,
      position.y + cameraOffset.y,
      position.z + cameraOffset.z
    );
    
    camera.position.lerp(targetCameraPosition, 0.15);
    
    const lookAtTarget = new THREE.Vector3(position.x, position.y + 1, position.z);
    camera.lookAt(lookAtTarget);

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
    <RigidBody 
      ref={bodyRef} 
      position={[0, 5, 0]} 
      colliders={false} 
      lockRotations
      mass={1}
      friction={0.5}
      restitution={0}
      linearDamping={2}
      angularDamping={1}
      enabledRotations={[false, true, false]}
      ccd
    >
      <CuboidCollider args={[0.4, 0.9, 0.4]} position={[0, 0, 0]} />
      <mesh ref={meshRef} castShadow>
        {/* Anime-style Body */}
        <boxGeometry args={[0.8, 1.8, 0.6]} />
        <meshToonMaterial color={getClassColor()} />
        
        {/* Anime-style Head */}
        <mesh position={[0, 1.3, 0]} castShadow>
          <sphereGeometry args={[0.5, 16, 16]} />
          <meshToonMaterial color="#ffcc80" />
          
          {/* Anime Eyes */}
          <mesh position={[-0.15, 0.1, 0.4]}>
            <circleGeometry args={[0.08, 16]} />
            <meshBasicMaterial color="#000000" />
          </mesh>
          <mesh position={[0.15, 0.1, 0.4]}>
            <circleGeometry args={[0.08, 16]} />
            <meshBasicMaterial color="#000000" />
          </mesh>
          
          {/* Anime Highlights in eyes */}
          <mesh position={[-0.15, 0.12, 0.41]}>
            <circleGeometry args={[0.03, 8]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
          <mesh position={[0.15, 0.12, 0.41]}>
            <circleGeometry args={[0.03, 8]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
          
          {/* Anime Mouth */}
          <mesh position={[0, -0.05, 0.4]} rotation={[0, 0, Math.PI]}>
            <ringGeometry args={[0.05, 0.08, 16, 1, 0, Math.PI]} />
            <meshBasicMaterial color="#000000" />
          </mesh>
        </mesh>
        
        {/* Anime Arms */}
        <mesh position={[-0.6, 0.3, 0]} castShadow>
          <boxGeometry args={[0.25, 0.9, 0.25]} />
          <meshToonMaterial color={getClassColor()} />
        </mesh>
        <mesh position={[0.6, 0.3, 0]} castShadow>
          <boxGeometry args={[0.25, 0.9, 0.25]} />
          <meshToonMaterial color={getClassColor()} />
        </mesh>
        
        {/* Anime Legs */}
        <mesh position={[-0.25, -1.3, 0]} castShadow>
          <boxGeometry args={[0.25, 1.2, 0.25]} />
          <meshToonMaterial color="#303060" />
        </mesh>
        <mesh position={[0.25, -1.3, 0]} castShadow>
          <boxGeometry args={[0.25, 1.2, 0.25]} />
          <meshToonMaterial color="#303060" />
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
      {/* Solid Ground Platform */}
      <RigidBody 
        type="fixed" 
        colliders="cuboid"
        friction={1.5}
        restitution={0}
      >
        <mesh receiveShadow position={[0, 0.5, 0]}>
          <boxGeometry args={[500, 1, 500]} />
          <meshToonMaterial color="#32CD32" />
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
                  <meshToonMaterial color="#654321" />
                </mesh>
                <mesh castShadow position={[0, 5, 0]}>
                  <coneGeometry args={[2, 4, 8]} />
                  <meshToonMaterial color="#228B22" />
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
                <meshToonMaterial color="#808080" />
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
  const [mobileMove, setMobileMove] = useState({ x: 0, y: 0 });
  const [mobileJump, setMobileJump] = useState(false);
  
  // Spawn initial enemies
  useEffect(() => {
    if (enemies.length === 0) {
      spawnEnemies(20);
    }
  }, []);
  
  const handleJump = () => {
    setMobileJump(true);
    setTimeout(() => setMobileJump(false), 100);
  };
  
  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <Canvas shadows camera={{ position: [0, 8, 12], fov: 75 }}>
        <Sky sunPosition={[100, 20, 100]} />
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        <ambientLight intensity={0.6} />
        <directionalLight
          position={[50, 50, 25]}
          intensity={1.5}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-far={100}
          shadow-camera-left={-50}
          shadow-camera-right={50}
          shadow-camera-top={50}
          shadow-camera-bottom={-50}
        />
        <hemisphereLight intensity={0.3} color="#87CEEB" groundColor="#4CAF50" />
        <fog attach="fog" args={['#87CEEB', 50, 150]} />
        
        <Physics gravity={[0, -20, 0]} timeStep={1/60}>
          <Player mobileMove={mobileMove} mobileJump={mobileJump} />
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
      
      {/* Mobile Controls - Outside Canvas */}
      <MobileControls
        onMove={(x, y) => setMobileMove({ x, y })}
        onJump={handleJump}
        onTouch={() => {}}
      />
    </div>
  );
}
