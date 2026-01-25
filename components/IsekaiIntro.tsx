'use client';

import React, { useState } from 'react';
import { useGameStore, PlayerClass } from '@/store/gameStore';
import { CLASS_DATA, initializeClassSkills } from '@/store/classData';
import { generateRandomPet } from '@/store/gameData';

export default function IsekaiIntro() {
  const [step, setStep] = useState<'intro' | 'naming' | 'class-select'>('intro');
  const [tempName, setTempName] = useState('');
  const { setPlayerName, setPlayerClass, addPet, setActivePet } = useGameStore();

  const startAdventure = (selectedClass: PlayerClass) => {
    setPlayerClass(selectedClass);
    
    // Initialize class skills
    const skills = initializeClassSkills(selectedClass);
    useGameStore.setState({ 
      skills,
      activeSkills: skills.slice(0, 4).map(s => s.id),
      auraColor: CLASS_DATA[selectedClass].color,
    });
    
    // Apply class starting stats
    const classStats = CLASS_DATA[selectedClass].startingStats;
    useGameStore.setState((state) => ({
      playerStats: {
        ...state.playerStats,
        attack: state.playerStats.attack + classStats.attack,
        defense: state.playerStats.defense + classStats.defense,
        speed: state.playerStats.speed + classStats.speed,
        magic: state.playerStats.magic + classStats.magic,
      }
    }));
    
    // Give starter pet
    const starterPet = generateRandomPet();
    addPet(starterPet);
    setActivePet(starterPet.id);
  };

  if (step === 'intro') {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'linear-gradient(135deg, #1a0033 0%, #000033 50%, #001a33 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        zIndex: 9999,
        padding: '20px',
        textAlign: 'center',
      }}>
        <h1 style={{
          fontSize: '72px',
          fontWeight: 'bold',
          marginBottom: '20px',
          background: 'linear-gradient(45deg, #ffd700, #ff69b4, #00ffff)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textShadow: '0 0 50px rgba(255, 215, 0, 0.5)',
          animation: 'glow 2s infinite',
        }}>
          異世界転生
        </h1>
        <h2 style={{ fontSize: '36px', marginBottom: '40px', color: '#ffaa00' }}>
          Isekai Adventure
        </h2>
        
        <div style={{
          maxWidth: '700px',
          fontSize: '18px',
          lineHeight: '1.8',
          marginBottom: '40px',
          background: 'rgba(0, 0, 0, 0.6)',
          padding: '30px',
          borderRadius: '15px',
          border: '2px solid rgba(255, 215, 0, 0.3)',
        }}>
          <p style={{ marginBottom: '20px' }}>
            In a world where magic flows like rivers and legendary beasts roam free...
          </p>
          <p style={{ marginBottom: '20px' }}>
            You have been given a second chance at life - reborn in a fantasy realm
            filled with adventure, danger, and endless possibilities.
          </p>
          <p style={{ marginBottom: '20px' }}>
            Choose your path. Master powerful abilities. Tame mythical companions.
          </p>
          <p style={{ fontWeight: 'bold', color: '#ffd700', fontSize: '20px' }}>
            Your isekai adventure begins now!
          </p>
        </div>

        <button
          onClick={() => setStep('naming')}
          style={{
            padding: '20px 60px',
            fontSize: '24px',
            background: 'linear-gradient(45deg, #ff6600, #ff0066)',
            border: 'none',
            borderRadius: '50px',
            color: 'white',
            cursor: 'pointer',
            fontWeight: 'bold',
            boxShadow: '0 0 30px rgba(255, 102, 0, 0.6)',
            transition: 'all 0.3s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.1)';
            e.currentTarget.style.boxShadow = '0 0 50px rgba(255, 102, 0, 1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 0 30px rgba(255, 102, 0, 0.6)';
          }}
        >
          Begin Your Journey
        </button>

        <style jsx>{`
          @keyframes glow {
            0%, 100% { filter: brightness(1); }
            50% { filter: brightness(1.3); }
          }
        `}</style>
      </div>
    );
  }

  if (step === 'naming') {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'linear-gradient(135deg, #1a0033 0%, #000033 50%, #001a33 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        zIndex: 9999,
        padding: '20px',
      }}>
        <h2 style={{ fontSize: '42px', marginBottom: '30px', color: '#ffd700' }}>
          What is your name, traveler?
        </h2>
        
        <input
          type="text"
          value={tempName}
          onChange={(e) => setTempName(e.target.value)}
          placeholder="Enter your name..."
          maxLength={20}
          style={{
            padding: '15px 30px',
            fontSize: '24px',
            width: '400px',
            maxWidth: '90%',
            textAlign: 'center',
            borderRadius: '10px',
            border: '2px solid #ffd700',
            background: 'rgba(0, 0, 0, 0.7)',
            color: 'white',
            marginBottom: '30px',
          }}
          onKeyPress={(e) => {
            if (e.key === 'Enter' && tempName.trim()) {
              setPlayerName(tempName.trim());
              setStep('class-select');
            }
          }}
          autoFocus
        />

        <button
          onClick={() => {
            if (tempName.trim()) {
              setPlayerName(tempName.trim());
              setStep('class-select');
            }
          }}
          disabled={!tempName.trim()}
          style={{
            padding: '15px 50px',
            fontSize: '20px',
            background: tempName.trim() ? 'linear-gradient(45deg, #4CAF50, #45a049)' : '#666',
            border: 'none',
            borderRadius: '30px',
            color: 'white',
            cursor: tempName.trim() ? 'pointer' : 'not-allowed',
            fontWeight: 'bold',
            boxShadow: tempName.trim() ? '0 0 20px rgba(76, 175, 80, 0.5)' : 'none',
          }}
        >
          Continue
        </button>
      </div>
    );
  }

  if (step === 'class-select') {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'linear-gradient(135deg, #1a0033 0%, #000033 50%, #001a33 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '40px 20px',
        color: 'white',
        zIndex: 9999,
        overflowY: 'auto',
      }}>
        <h2 style={{ fontSize: '48px', marginBottom: '15px', color: '#ffd700' }}>
          Choose Your Class
        </h2>
        <p style={{ fontSize: '18px', marginBottom: '40px', opacity: 0.9 }}>
          Select your path and discover your true power
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '25px',
          maxWidth: '1400px',
          width: '100%',
        }}>
          {(Object.keys(CLASS_DATA) as PlayerClass[]).map((classKey) => {
            const classInfo = CLASS_DATA[classKey];
            return (
              <div
                key={classKey}
                onClick={() => startAdventure(classKey)}
                style={{
                  background: `linear-gradient(135deg, ${classInfo.color}22 0%, ${classInfo.color}11 100%)`,
                  border: `3px solid ${classInfo.color}`,
                  borderRadius: '15px',
                  padding: '25px',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  position: 'relative',
                  overflow: 'hidden',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px) scale(1.02)';
                  e.currentTarget.style.boxShadow = `0 10px 40px ${classInfo.color}80`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  width: '100px',
                  height: '100px',
                  background: `radial-gradient(circle, ${classInfo.color}40, transparent)`,
                  borderRadius: '50%',
                  filter: 'blur(20px)',
                }} />
                
                <h3 style={{
                  fontSize: '28px',
                  marginBottom: '10px',
                  color: classInfo.color,
                  fontWeight: 'bold',
                }}>
                  {classInfo.name}
                </h3>
                
                <p style={{
                  fontSize: '14px',
                  marginBottom: '15px',
                  opacity: 0.9,
                  minHeight: '40px',
                }}>
                  {classInfo.description}
                </p>

                <div style={{
                  marginBottom: '15px',
                  paddingBottom: '15px',
                  borderBottom: `1px solid ${classInfo.color}40`,
                }}>
                  <div style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '8px', color: classInfo.color }}>
                    PRIMARY: {classInfo.primaryStat}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px', fontSize: '12px' }}>
                    <div>⚔️ ATK: {classInfo.startingStats.attack}</div>
                    <div>🛡️ DEF: {classInfo.startingStats.defense}</div>
                    <div>🏃 SPD: {classInfo.startingStats.speed}</div>
                    <div>🔮 MAG: {classInfo.startingStats.magic}</div>
                  </div>
                </div>

                <div style={{ fontSize: '11px' }}>
                  <div style={{ fontWeight: 'bold', marginBottom: '6px', color: classInfo.color }}>
                    SKILLS:
                  </div>
                  {classInfo.skills.slice(0, 3).map((skill, i) => (
                    <div key={i} style={{ marginBottom: '3px', opacity: 0.9 }}>
                      • {skill.name}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return null;
}
