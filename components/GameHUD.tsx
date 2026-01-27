'use client';

import React, { useEffect, useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import { generateRandomPet } from '@/store/gameData';

export default function GameHUD() {
  const {
    playerName,
    playerClass,
    playerLevel,
    playerXP,
    playerXPToNext,
    playerStats,
    gold,
    pets,
    activePet,
    currentZone,
    quests,
    skills,
    isMoving,
    currentAnimation,
    enemies,
    enemiesDefeated,
    achievements,
    tutorialStep,
    tutorialCompleted,
    questsCompleted,
    totalPlayTime,
    gainXP,
    addPet,
    setActivePet,
    discoverZone,
    useSkill,
    updateSkillCooldowns,
    addQuest,
    spawnEnemies,
    checkAchievements,
    nextTutorialStep,
  } = useGameStore();

  const [showPetMenu, setShowPetMenu] = useState(false);
  const [showQuestLog, setShowQuestLog] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  
  // Show notification helper
  const showNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };
  
  // Load achievements and tutorial on mount
  useEffect(() => {
    const { Achievements } = require('@/store/contentGeneration');
    if (achievements.length === 0) {
      useGameStore.setState({ achievements: Achievements });
    }
  }, []);

  // Auto XP gain when moving, quest generation, and enemy spawning
  useEffect(() => {
    const interval = setInterval(() => {
      if (isMoving) {
        gainXP(2);
      }
      // Update skill cooldowns and mana regen
      updateSkillCooldowns(1);
      
      // Generate quests periodically
      if (quests.length < 10 && Math.random() > 0.95) {
        const { generateQuest } = require('@/store/contentGeneration');
        const newQuest = generateQuest(playerLevel, quests.length + 1);
        addQuest(newQuest);
        showNotification(`New Quest: ${newQuest.title}`);
      }
      
      // Spawn more enemies if needed
      if (enemies.length < 15 && Math.random() > 0.9) {
        spawnEnemies(5);
      }
      
      // Check achievements
      checkAchievements();
    }, 1000);

    return () => clearInterval(interval);
  }, [isMoving, quests.length, enemies.length, playerLevel]);
  
  // Skill hotkeys
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      const key = e.key;
      if (key >= '1' && key <= '4') {
        const index = parseInt(key) - 1;
        if (skills[index]) {
          const skill = skills[index];
          if (skill.currentCooldown === 0 && playerStats.mana >= skill.manaCost) {
            useSkill(skill.id);
            showNotification(`✨ ${skill.name}!`);
          }
        }
      }
    };
    
    window.addEventListener('keypress', handleKeyPress);
    return () => window.removeEventListener('keypress', handleKeyPress);
  }, [skills, playerStats.mana, useSkill]);

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
        background: 'rgba(0, 0, 0, 0.85)',
        padding: '15px',
        borderRadius: '10px',
        color: 'white',
        minWidth: '280px',
        pointerEvents: 'auto',
        border: '2px solid rgba(255, 215, 0, 0.3)',
      }}>
        <h2 style={{ margin: '0 0 5px 0', fontSize: '20px', color: '#ffd700' }}>
          {playerName}
        </h2>
        <div style={{ fontSize: '14px', color: '#ffaa00', marginBottom: '10px' }}>
          Lv.{playerLevel} {playerClass.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
        </div>
        
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

        {/* Stats Display */}
        <div style={{ fontSize: '10px', marginTop: '8px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3px' }}>
          <div>⚔️ ATK: {playerStats.attack}</div>
          <div>🛡️ DEF: {playerStats.defense}</div>
          <div>🏃 SPD: {playerStats.speed}</div>
          <div>🔮 MAG: {playerStats.magic}</div>
          <div>🍀 LCK: {playerStats.luck}</div>
        </div>
        
        {/* Play Stats */}
        <div style={{ fontSize: '10px', marginTop: '10px', paddingTop: '10px', borderTop: '1px solid rgba(255,215,0,0.3)' }}>
          <div>🗡️ Enemies: {enemiesDefeated}</div>
          <div>✅ Quests: {questsCompleted}</div>
          <div>⏱️ Time: {Math.floor(totalPlayTime / 60)}m</div>
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
          background: 'rgba(0, 0, 0, 0.85)',
          padding: '15px',
          borderRadius: '10px',
          color: 'white',
          minWidth: '200px',
          pointerEvents: 'auto',
          border: '2px solid rgba(255, 170, 0, 0.3)',
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

      {/* Bottom Center - Skill Bar */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        background: 'rgba(0, 0, 0, 0.85)',
        padding: '15px',
        borderRadius: '10px',
        pointerEvents: 'auto',
        border: '2px solid rgba(0, 170, 255, 0.3)',
      }}>
        <h3 style={{ margin: '0 0 10px 0', fontSize: '14px', textAlign: 'center' }}>⚡ Skills</h3>
        <div style={{ display: 'flex', gap: '10px' }}>
          {skills.slice(0, 4).map((skill, index) => {
            const onCooldown = skill.currentCooldown > 0;
            const canUse = playerStats.mana >= skill.manaCost && !onCooldown;
            
            return (
              <div
                key={skill.id}
                onClick={() => canUse && useSkill(skill.id)}
                style={{
                  width: '70px',
                  height: '70px',
                  background: canUse ? `linear-gradient(135deg, ${skill.auraColor}40, ${skill.auraColor}20)` : '#333',
                  border: `2px solid ${canUse ? skill.auraColor : '#666'}`,
                  borderRadius: '10px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: canUse ? 'pointer' : 'not-allowed',
                  position: 'relative',
                  opacity: canUse ? 1 : 0.5,
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  if (canUse) {
                    e.currentTarget.style.transform = 'scale(1.1)';
                    e.currentTarget.style.boxShadow = `0 0 15px ${skill.auraColor}`;
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{ fontSize: '10px', fontWeight: 'bold', textAlign: 'center', marginBottom: '3px' }}>
                  {skill.name}
                </div>
                <div style={{ fontSize: '9px', color: '#00ddff' }}>
                  {skill.manaCost} MP
                </div>
                <div style={{ fontSize: '8px', marginTop: '2px' }}>
                  [{index + 1}]
                </div>
                
                {/* Cooldown overlay */}
                {onCooldown && (
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0, 0, 0, 0.7)',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '16px',
                    fontWeight: 'bold',
                  }}>
                    {Math.ceil(skill.currentCooldown)}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <div style={{ fontSize: '10px', textAlign: 'center', marginTop: '8px', opacity: 0.7 }}>
          Press [1-4] to use skills
        </div>
      </div>

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
        <div style={{ marginTop: '10px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setShowPetMenu(!showPetMenu)}
            style={{
              padding: '8px 15px',
              background: '#4CAF50',
              border: 'none',
              borderRadius: '5px',
              color: 'white',
              cursor: 'pointer',
              fontSize: '11px',
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
              fontSize: '11px',
            }}
          >
            📜 Quests ({quests.filter(q => !q.completed).length})
          </button>
          <button
            onClick={() => setShowAchievements(!showAchievements)}
            style={{
              padding: '8px 15px',
              background: '#FF9800',
              border: 'none',
              borderRadius: '5px',
              color: 'white',
              cursor: 'pointer',
              fontSize: '11px',
            }}
          >
            🏆 Achievements
          </button>
          <button
            onClick={() => setShowStats(!showStats)}
            style={{
              padding: '8px 15px',
              background: '#9C27B0',
              border: 'none',
              borderRadius: '5px',
              color: 'white',
              cursor: 'pointer',
              fontSize: '11px',
            }}
          >
            📊 Stats
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
          maxWidth: '700px',
          maxHeight: '70vh',
          overflow: 'auto',
          pointerEvents: 'auto',
          border: '2px solid #2196F3',
        }}>
          <h2 style={{ margin: '0 0 20px 0' }}>📜 Quest Log ({quests.length} Total)</h2>
          {quests.length === 0 ? (
            <p style={{ opacity: 0.7 }}>Quests will appear automatically as you explore!</p>
          ) : (
            quests.map(quest => (
              <div
                key={quest.id}
                style={{
                  padding: '15px',
                  background: quest.completed ? '#2e7d32' : '#1a237e',
                  borderRadius: '10px',
                  marginBottom: '10px',
                  border: quest.type === 'epic' ? '2px solid gold' : '1px solid rgba(255,255,255,0.2)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ margin: '0 0 5px 0' }}>{quest.title}</h3>
                  <span style={{ 
                    fontSize: '10px', 
                    padding: '2px 8px', 
                    background: quest.type === 'epic' ? '#ff6600' : quest.type === 'main' ? '#2196F3' : '#4CAF50',
                    borderRadius: '10px',
                  }}>
                    {quest.type.toUpperCase()}
                  </span>
                </div>
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
                      background: quest.completed ? '#4CAF50' : '#ffd700',
                      transition: 'width 0.3s',
                    }} />
                  </div>
                </div>
                <div style={{ fontSize: '11px', marginTop: '8px', color: '#ffd700' }}>
                  Rewards: {quest.rewards.xp} XP, {quest.rewards.gold} Gold
                  {quest.rewards.items.length > 0 && `, +${quest.rewards.items.length} items`}
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

      {/* Achievements Modal */}
      {showAchievements && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'rgba(0, 0, 0, 0.95)',
          padding: '30px',
          borderRadius: '15px',
          color: 'white',
          maxWidth: '700px',
          maxHeight: '70vh',
          overflow: 'auto',
          pointerEvents: 'auto',
          border: '2px solid #FF9800',
        }}>
          <h2 style={{ margin: '0 0 20px 0' }}>🏆 Achievements ({achievements.filter(a => a.unlocked).length}/{achievements.length})</h2>
          <div style={{ display: 'grid', gap: '10px' }}>
            {achievements.map(achievement => (
              <div
                key={achievement.id}
                style={{
                  padding: '15px',
                  background: achievement.unlocked ? '#2e7d32' : '#424242',
                  borderRadius: '10px',
                  opacity: achievement.unlocked ? 1 : 0.6,
                  border: achievement.unlocked ? '2px solid gold' : '1px solid #666',
                }}
              >
                <h3 style={{ margin: '0 0 5px 0', fontSize: '16px' }}>
                  {achievement.unlocked ? '✅' : '🔒'} {achievement.name}
                </h3>
                <p style={{ fontSize: '12px', margin: '5px 0', opacity: 0.9 }}>
                  {achievement.description}
                </p>
                <div style={{ fontSize: '11px', marginTop: '8px' }}>
                  Progress: {achievement.progress}/{achievement.requirement}
                  <div style={{ 
                    width: '100%', 
                    height: '6px', 
                    background: '#333', 
                    borderRadius: '3px', 
                    marginTop: '5px',
                    overflow: 'hidden' 
                  }}>
                    <div style={{ 
                      width: `${Math.min(100, (achievement.progress / achievement.requirement) * 100)}%`, 
                      height: '100%', 
                      background: achievement.unlocked ? '#4CAF50' : '#FF9800',
                    }} />
                  </div>
                </div>
                {achievement.unlocked && (
                  <div style={{ fontSize: '10px', marginTop: '5px', color: '#ffd700' }}>
                    Reward: {achievement.reward.xp} XP, {achievement.reward.gold} Gold
                  </div>
                )}
              </div>
            ))}
          </div>
          <button
            onClick={() => setShowAchievements(false)}
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

      {/* Stats Modal */}
      {showStats && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'rgba(0, 0, 0, 0.95)',
          padding: '30px',
          borderRadius: '15px',
          color: 'white',
          maxWidth: '500px',
          pointerEvents: 'auto',
          border: '2px solid #9C27B0',
        }}>
          <h2 style={{ margin: '0 0 20px 0' }}>📊 Player Statistics</h2>
          <div style={{ fontSize: '14px', lineHeight: '2' }}>
            <div><strong>Total Play Time:</strong> {Math.floor(totalPlayTime / 60)} minutes</div>
            <div><strong>Current Level:</strong> {playerLevel}</div>
            <div><strong>Total XP Earned:</strong> {playerXP + (playerLevel * playerXPToNext)}</div>
            <div><strong>Enemies Defeated:</strong> {enemiesDefeated}</div>
            <div><strong>Quests Completed:</strong> {questsCompleted}</div>
            <div><strong>Active Quests:</strong> {quests.filter(q => !q.completed).length}</div>
            <div><strong>Total Gold:</strong> {gold}</div>
            <div><strong>Pets Collected:</strong> {pets.length}</div>
            <div><strong>Current Zone:</strong> {currentZone}</div>
            <div><strong>Class:</strong> {playerClass}</div>
          </div>
          <button
            onClick={() => setShowStats(false)}
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

      {/* Tutorial Overlay */}
      {!tutorialCompleted && tutorialStep < 8 && (
        <div style={{
          position: 'absolute',
          bottom: '120px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(0, 0, 0, 0.9)',
          padding: '20px 30px',
          borderRadius: '10px',
          color: 'white',
          maxWidth: '500px',
          pointerEvents: 'auto',
          border: '2px solid #4CAF50',
        }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#4CAF50' }}>
            📚 Tutorial Step {tutorialStep + 1}/8
          </h3>
          <p style={{ fontSize: '14px', margin: '0 0 15px 0' }}>
            {(() => {
              const { TutorialSteps } = require('@/store/contentGeneration');
              return TutorialSteps[tutorialStep]?.description || 'Explore and discover!';
            })()}
          </p>
          <button
            onClick={() => nextTutorialStep()}
            style={{
              padding: '8px 20px',
              background: '#4CAF50',
              border: 'none',
              borderRadius: '5px',
              color: 'white',
              cursor: 'pointer',
              width: '100%',
            }}
          >
            Next
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
