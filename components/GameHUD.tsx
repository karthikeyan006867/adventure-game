'use client';

import React, { useEffect, useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import { generateRandomPet } from '@/store/gameData';

export default function GameHUD() {
  const {
    playerLevel,
    playerXP,
    playerXPToNext,
    playerStats,
    gold,
    pets,
    activePet,
    currentZone,
    quests,
    isMoving,
    currentAnimation,
    gainXP,
    addPet,
    setActivePet,
    discoverZone,
  } = useGameStore();

  const [showPetMenu, setShowPetMenu] = useState(false);
  const [showQuestLog, setShowQuestLog] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Auto XP gain when moving (exploration)
  useEffect(() => {
    const interval = setInterval(() => {
      if (isMoving) {
        gainXP(1);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isMoving, gainXP]);

  // Show notification
  const showNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  // Add starter pet if none
  useEffect(() => {
    if (pets.length === 0) {
      const starterPet = generateRandomPet();
      addPet(starterPet);
      setActivePet(starterPet.id);
      showNotification(`${starterPet.name} joined your adventure!`);
    }
  }, []);

  const xpPercentage = (playerXP / playerXPToNext) * 100;
  const healthPercentage = (playerStats.health / playerStats.maxHealth) * 100;
  const manaPercentage = (playerStats.mana / playerStats.maxMana) * 100;
  const staminaPercentage = (playerStats.stamina / playerStats.maxStamina) * 100;

  return (
    <div style={{ 
      position: 'absolute', 
      top: 0, 
      left: 0, 
      width: '100%', 
      height: '100%', 
      pointerEvents: 'none',
      fontFamily: 'Arial, sans-serif',
    }}>
      {/* Top Left - Player Stats */}
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        background: 'rgba(0, 0, 0, 0.7)',
        padding: '15px',
        borderRadius: '10px',
        color: 'white',
        minWidth: '250px',
        pointerEvents: 'auto',
      }}>
        <h2 style={{ margin: '0 0 10px 0', fontSize: '24px', color: '#ffd700' }}>
          Level {playerLevel} Adventurer
        </h2>
        
        {/* Health Bar */}
        <div style={{ marginBottom: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '3px' }}>
            <span>❤️ Health</span>
            <span>{playerStats.health}/{playerStats.maxHealth}</span>
          </div>
          <div style={{ width: '100%', height: '20px', background: '#333', borderRadius: '5px', overflow: 'hidden' }}>
            <div style={{ 
              width: `${healthPercentage}%`, 
              height: '100%', 
              background: 'linear-gradient(90deg, #ff4444, #ff6666)',
              transition: 'width 0.3s',
            }} />
          </div>
        </div>

        {/* Mana Bar */}
        <div style={{ marginBottom: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '3px' }}>
            <span>💙 Mana</span>
            <span>{playerStats.mana}/{playerStats.maxMana}</span>
          </div>
          <div style={{ width: '100%', height: '20px', background: '#333', borderRadius: '5px', overflow: 'hidden' }}>
            <div style={{ 
              width: `${manaPercentage}%`, 
              height: '100%', 
              background: 'linear-gradient(90deg, #4444ff, #6666ff)',
              transition: 'width 0.3s',
            }} />
          </div>
        </div>

        {/* Stamina Bar */}
        <div style={{ marginBottom: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '3px' }}>
            <span>⚡ Stamina</span>
            <span>{playerStats.stamina}/{playerStats.maxStamina}</span>
          </div>
          <div style={{ width: '100%', height: '20px', background: '#333', borderRadius: '5px', overflow: 'hidden' }}>
            <div style={{ 
              width: `${staminaPercentage}%`, 
              height: '100%', 
              background: 'linear-gradient(90deg, #44ff44, #66ff66)',
              transition: 'width 0.3s',
            }} />
          </div>
        </div>

        {/* XP Bar */}
        <div style={{ marginBottom: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '3px' }}>
            <span>✨ Experience</span>
            <span>{playerXP}/{playerXPToNext}</span>
          </div>
          <div style={{ width: '100%', height: '20px', background: '#333', borderRadius: '5px', overflow: 'hidden' }}>
            <div style={{ 
              width: `${xpPercentage}%`, 
              height: '100%', 
              background: 'linear-gradient(90deg, #ffd700, #ffed4e)',
              transition: 'width 0.3s',
            }} />
          </div>
        </div>

        {/* Gold */}
        <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#ffd700', marginTop: '10px' }}>
          💰 Gold: {gold}
        </div>

        {/* Stats */}
        <div style={{ marginTop: '10px', fontSize: '12px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px' }}>
          <div>⚔️ ATK: {playerStats.attack}</div>
          <div>🛡️ DEF: {playerStats.defense}</div>
          <div>🏃 SPD: {playerStats.speed}</div>
          <div>🔮 MAG: {playerStats.magic}</div>
          <div>🍀 LCK: {playerStats.luck}</div>
        </div>
      </div>

      {/* Top Right - Zone Info */}
      <div style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        background: 'rgba(0, 0, 0, 0.7)',
        padding: '15px',
        borderRadius: '10px',
        color: 'white',
        textAlign: 'right',
        pointerEvents: 'auto',
      }}>
        <h3 style={{ margin: '0 0 5px 0', fontSize: '18px', color: '#87CEEB' }}>
          📍 {currentZone}
        </h3>
        <div style={{ fontSize: '12px', opacity: 0.8 }}>
          Animation: {currentAnimation}
        </div>
      </div>

      {/* Bottom Left - Active Pet */}
      {activePet && (
        <div style={{
          position: 'absolute',
          bottom: '20px',
          left: '20px',
          background: 'rgba(0, 0, 0, 0.7)',
          padding: '15px',
          borderRadius: '10px',
          color: 'white',
          minWidth: '200px',
          pointerEvents: 'auto',
        }}>
          <h3 style={{ margin: '0 0 10px 0', fontSize: '16px' }}>🐾 Active Pet</h3>
          <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#ffaa00', marginBottom: '5px' }}>
            {activePet.name} (Lv.{activePet.level})
          </div>
          <div style={{ fontSize: '11px', marginBottom: '3px' }}>
            Type: {activePet.type} | {activePet.rarity}
          </div>
          <div style={{ fontSize: '10px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3px' }}>
            <div>ATK: {activePet.stats.attack}</div>
            <div>DEF: {activePet.stats.defense}</div>
            <div>SPD: {activePet.stats.speed}</div>
            <div>MAG: {activePet.stats.magic}</div>
          </div>
        </div>
      )}

      {/* Bottom Right - Controls */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        right: '20px',
        background: 'rgba(0, 0, 0, 0.7)',
        padding: '15px',
        borderRadius: '10px',
        color: 'white',
        pointerEvents: 'auto',
      }}>
        <h3 style={{ margin: '0 0 10px 0', fontSize: '16px' }}>🎮 Controls</h3>
        <div style={{ fontSize: '12px', lineHeight: '1.6' }}>
          <div>WASD / Arrows - Move</div>
          <div>Space - Jump</div>
          <div>Mouse - Look Around</div>
        </div>
        <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
          <button
            onClick={() => setShowPetMenu(!showPetMenu)}
            style={{
              padding: '8px 15px',
              background: '#4CAF50',
              border: 'none',
              borderRadius: '5px',
              color: 'white',
              cursor: 'pointer',
              fontSize: '12px',
            }}
          >
            🐾 Pets ({pets.length})
          </button>
          <button
            onClick={() => setShowQuestLog(!showQuestLog)}
            style={{
              padding: '8px 15px',
              background: '#2196F3',
              border: 'none',
              borderRadius: '5px',
              color: 'white',
              cursor: 'pointer',
              fontSize: '12px',
            }}
          >
            📜 Quests
          </button>
        </div>
      </div>

      {/* Pet Menu Modal */}
      {showPetMenu && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'rgba(0, 0, 0, 0.95)',
          padding: '30px',
          borderRadius: '15px',
          color: 'white',
          maxWidth: '600px',
          maxHeight: '70vh',
          overflow: 'auto',
          pointerEvents: 'auto',
        }}>
          <h2 style={{ margin: '0 0 20px 0' }}>🐾 Your Pet Collection</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            {pets.map(pet => (
              <div
                key={pet.id}
                onClick={() => {
                  setActivePet(pet.id);
                  showNotification(`${pet.name} is now active!`);
                }}
                style={{
                  padding: '15px',
                  background: pet.active ? '#4CAF50' : '#333',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  border: pet.active ? '2px solid #ffaa00' : '2px solid transparent',
                }}
              >
                <h3 style={{ margin: '0 0 5px 0', fontSize: '16px' }}>{pet.name}</h3>
                <div style={{ fontSize: '12px', color: '#ffaa00' }}>Lv.{pet.level} {pet.type}</div>
                <div style={{ fontSize: '11px', marginTop: '5px', opacity: 0.8 }}>
                  {pet.rarity}
                </div>
                <div style={{ fontSize: '10px', marginTop: '8px' }}>
                  {pet.abilities.slice(0, 2).map(ability => (
                    <div key={ability}>• {ability}</div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={() => {
              const newPet = generateRandomPet();
              addPet(newPet);
              showNotification(`New pet discovered: ${newPet.name}!`);
            }}
            style={{
              marginTop: '20px',
              padding: '10px 20px',
              background: '#FF9800',
              border: 'none',
              borderRadius: '5px',
              color: 'white',
              cursor: 'pointer',
              width: '100%',
              fontSize: '14px',
            }}
          >
            🎲 Discover New Pet (Cost: 100 Gold)
          </button>
          <button
            onClick={() => setShowPetMenu(false)}
            style={{
              marginTop: '10px',
              padding: '10px 20px',
              background: '#f44336',
              border: 'none',
              borderRadius: '5px',
              color: 'white',
              cursor: 'pointer',
              width: '100%',
            }}
          >
            Close
          </button>
        </div>
      )}

      {/* Quest Log Modal */}
      {showQuestLog && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'rgba(0, 0, 0, 0.95)',
          padding: '30px',
          borderRadius: '15px',
          color: 'white',
          maxWidth: '600px',
          maxHeight: '70vh',
          overflow: 'auto',
          pointerEvents: 'auto',
        }}>
          <h2 style={{ margin: '0 0 20px 0' }}>📜 Quest Log</h2>
          {quests.length === 0 ? (
            <p style={{ opacity: 0.7 }}>No active quests. Explore to discover new adventures!</p>
          ) : (
            quests.map(quest => (
              <div
                key={quest.id}
                style={{
                  padding: '15px',
                  background: quest.completed ? '#2e7d32' : '#1a237e',
                  borderRadius: '10px',
                  marginBottom: '10px',
                }}
              >
                <h3 style={{ margin: '0 0 5px 0' }}>{quest.title}</h3>
                <p style={{ fontSize: '12px', margin: '5px 0', opacity: 0.9 }}>
                  {quest.description}
                </p>
                <div style={{ fontSize: '11px', marginTop: '10px' }}>
                  Progress: {quest.progress}/{quest.maxProgress}
                  <div style={{ 
                    width: '100%', 
                    height: '8px', 
                    background: '#333', 
                    borderRadius: '4px', 
                    marginTop: '5px',
                    overflow: 'hidden' 
                  }}>
                    <div style={{ 
                      width: `${(quest.progress / quest.maxProgress) * 100}%`, 
                      height: '100%', 
                      background: '#4CAF50' 
                    }} />
                  </div>
                </div>
                <div style={{ fontSize: '11px', marginTop: '8px', color: '#ffd700' }}>
                  Rewards: {quest.rewards.xp} XP, {quest.rewards.gold} Gold
                </div>
              </div>
            ))
          )}
          <button
            onClick={() => setShowQuestLog(false)}
            style={{
              marginTop: '20px',
              padding: '10px 20px',
              background: '#f44336',
              border: 'none',
              borderRadius: '5px',
              color: 'white',
              cursor: 'pointer',
              width: '100%',
            }}
          >
            Close
          </button>
        </div>
      )}

      {/* Notification Toast */}
      {notification && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'rgba(0, 0, 0, 0.9)',
          padding: '20px 40px',
          borderRadius: '10px',
          color: 'white',
          fontSize: '18px',
          fontWeight: 'bold',
          boxShadow: '0 0 20px rgba(255, 215, 0, 0.5)',
          border: '2px solid #ffd700',
          animation: 'fadeIn 0.3s',
        }}>
          {notification}
        </div>
      )}
    </div>
  );
}
