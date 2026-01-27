import { create } from 'zustand';

export type PlayerClass = 
  | 'swordsman' 
  | 'fire-mage' 
  | 'water-mage' 
  | 'light-mage' 
  | 'dark-mage' 
  | 'earth-mage' 
  | 'archer' 
  | 'healer'
  | 'summoner';

export interface Skill {
  id: string;
  name: string;
  description: string;
  manaCost: number;
  cooldown: number;
  currentCooldown: number;
  damage?: number;
  healing?: number;
  effect?: string;
  auraColor: string;
}

export interface Pet {
  id: string;
  name: string;
  type: 'dragon' | 'wolf' | 'phoenix' | 'tiger' | 'unicorn' | 'griffin' | 'fox' | 'owl' | 'slime' | 'fairy';
  level: number;
  xp: number;
  stats: {
    attack: number;
    defense: number;
    speed: number;
    magic: number;
  };
  abilities: string[];
  rarity: 'common' | 'rare' | 'epic' | 'legendary' | 'mythic';
  active: boolean;
}

export interface PlayerStats {
  health: number;
  maxHealth: number;
  mana: number;
  maxMana: number;
  stamina: number;
  maxStamina: number;
  attack: number;
  defense: number;
  speed: number;
  magic: number;
  luck: number;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  type: 'main' | 'side' | 'daily' | 'epic';
  rewards: {
    xp: number;
    gold: number;
    items: string[];
  };
  completed: boolean;
  progress: number;
  maxProgress: number;
}

export interface Enemy {
  id: string;
  name: string;
  level: number;
  health: number;
  maxHealth: number;
  attack: number;
  defense: number;
  xpReward: number;
  goldReward: number;
  position: [number, number, number];
  type: string;
  aggressive: boolean;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  requirement: number;
  progress: number;
  unlocked: boolean;
  reward: { xp: number; gold: number };
}

interface GameState {
  // Player
  playerName: string;
  playerClass: PlayerClass;
  playerLevel: number;
  playerXP: number;
  playerXPToNext: number;
  playerStats: PlayerStats;
  playerPosition: [number, number, number];
  playerRotation: number;
  isMoving: boolean;
  currentAnimation: string;
  isekaiStoryProgress: number;
  
  // Inventory
  gold: number;
  inventory: string[];
  
  // Skills & Magic
  skills: Skill[];
  activeSkills: string[];
  auraActive: boolean;
  auraColor: string;
  
  // Pets
  pets: Pet[];
  activePet: Pet | null;
  
  // World
  currentZone: string;
  discoveredZones: string[];
  
  // Quests
  quests: Quest[];
  
  // Combat & Enemies
  enemies: Enemy[];
  inCombat: boolean;
  targetEnemy: Enemy | null;
  enemiesDefeated: number;
  
  // Achievements
  achievements: Achievement[];
  
  // Tutorial
  tutorialStep: number;
  tutorialCompleted: boolean;
  
  // Stats tracking
  questsCompleted: number;
  dungeonsCleared: number;
  totalPlayTime: number;
  
  // Actions
  setPlayerClass: (playerClass: PlayerClass) => void;
  setPlayerName: (name: string) => void;
  gainXP: (amount: number) => void;
  levelUp: () => void;
  updatePlayerPosition: (position: [number, number, number]) => void;
  updatePlayerRotation: (rotation: number) => void;
  setMoving: (moving: boolean) => void;
  setAnimation: (animation: string) => void;
  useSkill: (skillId: string) => void;
  toggleAura: () => void;
  updateSkillCooldowns: (delta: number) => void;
  addPet: (pet: Pet) => void;
  setActivePet: (petId: string) => void;
  addGold: (amount: number) => void;
  addItem: (item: string) => void;
  discoverZone: (zone: string) => void;
  addQuest: (quest: Quest) => void;
  updateQuestProgress: (questId: string, progress: number) => void;
  completeQuest: (questId: string) => void;
  healPlayer: (amount: number) => void;
  takeDamage: (amount: number) => void;
  attackEnemy: (enemyId: string) => void;
  spawnEnemies: (count: number) => void;
  defeatEnemy: (enemyId: string) => void;
  checkAchievements: () => void;
  nextTutorialStep: () => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  // Initial Player State
  playerName: 'Traveler',
  playerClass: 'swordsman',
  playerLevel: 1,
  playerXP: 0,
  playerXPToNext: 100,
  playerStats: {
    health: 100,
    maxHealth: 100,
    mana: 100,
    maxMana: 100,
    stamina: 100,
    maxStamina: 100,
    attack: 10,
    defense: 5,
    speed: 5,
    magic: 5,
    luck: 5,
  },
  playerPosition: [0, 0, 0],
  playerRotation: 0,
  isMoving: false,
  currentAnimation: 'idle',
  isekaiStoryProgress: 0,
  
  // Initial Inventory
  gold: 100,
  inventory: ['Health Potion', 'Mana Potion'],
  
  // Initial Skills
  skills: [],
  activeSkills: [],
  auraActive: false,
  auraColor: '#ffffff',
  
  // Initial Pets
  pets: [],
  activePet: null,
  
  // Initial 
  
  // Initial Combat
  enemies: [],
  inCombat: false,
  targetEnemy: null,
  enemiesDefeated: 0,
  
  // Initial Achievements
  achievements: [],
  
  // Initial Tutorial
  tutorialStep: 0,
  tutorialCompleted: false,
  
  // Initial Stats
  questsCompleted: 0,
  dungeonsCleared: 0,
  totalPlayTime: 0,
  currentZone: 'Starter Plains',
  discoveredZones: ['Starter Plains'],
  
  // Initial Quests
  quests: [],
  
  // Actions
  setPlayerClass: (playerClass: PlayerClass) => {
    set({ playerClass });
  },
  
  setPlayerName: (name: string) => {
    set({ playerName: name });
  },
  
  gainXP: (amount: number) => {
    const state = get();
    const newXP = state.playerXP + amount;
    
    if (newXP >= state.playerXPToNext) {
      const overflow = newXP - state.playerXPToNext;
      state.levelUp();
      if (overflow > 0) {
        set({ playerXP: overflow });
      }
    } else {
      set({ playerXP: newXP });
    }
  },
  
  levelUp: () => {
    const state = get();
    const newLevel = state.playerLevel + 1;
    const newXPToNext = Math.floor(state.playerXPToNext * 1.5);
    
    // Increase stats
    const newStats = {
      ...state.playerStats,
      maxHealth: state.playerStats.maxHealth + 20,
      health: state.playerStats.maxHealth + 20,
      maxMana: state.playerStats.maxMana + 10,
      mana: state.playerStats.maxMana + 10,
      maxStamina: state.playerStats.maxStamina + 15,
      stamina: state.playerStats.maxStamina + 15,
      attack: state.playerStats.attack + 3,
      defense: state.playerStats.defense + 2,
      speed: state.playerStats.speed + 1,
      magic: state.playerStats.magic + 2,
      luck: state.playerStats.luck + 1,
    };
    
    set({
      playerLevel: newLevel,
      playerXP: 0,
      playerXPToNext: newXPToNext,
      playerStats: newStats,
    });
  },
  
  updatePlayerPosition: (position: [number, number, number]) => {
    set({ playerPosition: position });
  },
  
  updatePlayerRotation: (rotation: number) => {
    set({ playerRotation: rotation });
  },
  
  setMoving: (moving: boolean) => {
    set({ isMoving: moving });
  },
  
  setAnimation: (animation: string) => {
    set({ currentAnimation: animation });
  },
  
  addPet: (pet: Pet) => {
    const state = get();
    set({ pets: [...state.pets, pet] });
  },
  
  setActivePet: (petId: string) => {
    const state = get();
    const pet = state.pets.find(p => p.id === petId);
    if (pet) {
      // Deactivate all pets
      const updatedPets = state.pets.map(p => ({ ...p, active: false }));
      // Activate selected pet
      const activatedPets = updatedPets.map(p => 
        p.id === petId ? { ...p, active: true } : p
      );
      set({ pets: activatedPets, activePet: pet });
    }
  },
  
  addGold: (amount: number) => {
    const state = get();
    set({ gold: state.gold + amount });
  },
  
  addItem: (item: string) => {
    const state = get();
    set({ inventory: [...state.inventory, item] });
  },
  
  discoverZone: (zone: string) => {
    const state = get();
    if (!state.discoveredZones.includes(zone)) {
      set({ 
        discoveredZones: [...state.discoveredZones, zone],
        currentZone: zone,
      });
    } else {
      set({ currentZone: zone });
    }
  },
  
  addQuest: (quest: Quest) => {
    const state = get();
    set({ quests: [...state.quests, quest] });
  },
  
  updateQuestProgress: (questId: string, progress: number) => {
    const state = get();
    const updatedQuests = state.quests.map(quest => {
      if (quest.id === questId) {
        const newProgress = Math.min(quest.maxProgress, progress);
        const completed = newProgress >= quest.maxProgress;
        return { ...quest, progress: newProgress, completed };
      }
      return quest;
    });
    
    const newlyCompleted = updatedQuests.find(q => q.id === questId && q.completed && !state.quests.find(oq => oq.id === questId)?.completed);
    
    if (newlyCompleted) {
      set({
        quests: updatedQuests,
        questsCompleted: state.questsCompleted + 1,
      });
      
      state.checkAchievements();
    } else {
      set({ quests: updatedQuests });
    }
  },
  
  completeQuest: (questId: string) => {
    const state = get();
    const quest = state.quests.find(q => q.id === questId);
    
    if (quest && !quest.completed) {
      const updatedQuests = state.quests.map(q =>
        q.id === questId ? { ...q, completed: true, progress: q.maxProgress } : q
      );
      
      set({
        quests: updatedQuests,
        questsCompleted: state.questsCompleted + 1,
        playerXP: state.playerXP + quest.rewards.xp,
        gold: state.gold + quest.rewards.gold,
      });
      
      state.checkAchievements();
    }
  },
  
  healPlayer: (amount: number) => {
    const state = get();
    const newHealth = Math.min(state.playerStats.maxHealth, state.playerStats.health + amount);
    set({
      playerStats: { ...state.playerStats, health: newHealth }
    });
  },
  
  takeDamage: (amount: number) => {
    const state = get();
    const actualDamage = Math.max(1, amount - state.playerStats.defense);
    const newHealth = Math.max(0, state.playerStats.health - actualDamage);
    set({
      playerStats: { ...state.playerStats, health: newHealth }
    });
    
    // Auto heal if health is 0
    if (newHealth === 0) {
      setTimeout(() => {
        state.healPlayer(state.playerStats.maxHealth);
        set({ playerPosition: [0, 2, 0] }); // Respawn at start
      }, 2000);
    }
  },
  
  attackEnemy: (enemyId: string) => {
    const state = get();
    const enemy = state.enemies.find(e => e.id === enemyId);
    if (enemy) {
      const damage = state.playerStats.attack;
      const newHealth = Math.max(0, enemy.health - damage);
      
      if (newHealth === 0) {
        state.defeatEnemy(enemyId);
      } else {
        const updatedEnemies = state.enemies.map(e =>
          e.id === enemyId ? { ...e, health: newHealth } : e
        );
        set({ enemies: updatedEnemies });
        
        // Enemy counterattack
        setTimeout(() => {
          state.takeDamage(enemy.attack);
        }, 500);
      }
    }
  },
  
  spawnEnemies: (count: number) => {
    const state = get();
    const { spawnEnemy } = require('./contentGeneration');
    const newEnemies = [];
    
    for (let i = 0; i < count; i++) {
      newEnemies.push(spawnEnemy(state.currentZone, state.playerLevel));
    }
    
    set({ enemies: [...state.enemies, ...newEnemies] });
  },
  
  defeatEnemy: (enemyId: string) => {
    const state = get();
    const enemy = state.enemies.find(e => e.id === enemyId);
    
    if (enemy) {
      state.gainXP(enemy.xpReward);
      state.addGold(enemy.goldReward);
      
      const updatedEnemies = state.enemies.filter(e => e.id !== enemyId);
      set({ 
        enemies: updatedEnemies,
        enemiesDefeated: state.enemiesDefeated + 1,
      });
      
      state.checkAchievements();
    }
  },
  
  checkAchievements: () => {
    const state = get();
    const updatedAchievements = state.achievements.map(achievement => {
      if (achievement.unlocked) return achievement;
      
      let progress = 0;
      
      // Check different achievement types
      if (achievement.id.includes('level')) {
        progress = state.playerLevel;
      } else if (achievement.id.includes('pet')) {
        progress = state.pets.length;
      } else if (achievement.id.includes('quest')) {
        progress = state.questsCompleted;
      } else if (achievement.id.includes('dungeon')) {
        progress = state.dungeonsCleared;
      } else if (achievement.id.includes('monster')) {
        progress = state.enemiesDefeated;
      } else if (achievement.id.includes('wealthy')) {
        progress = state.gold;
      }
      
      const unlocked = progress >= achievement.requirement;
      
      if (unlocked && !achievement.unlocked) {
        // Grant achievement rewards
        state.gainXP(achievement.reward.xp);
        state.addGold(achievement.reward.gold);
      }
      
      return { ...achievement, progress, unlocked };
    });
    
    set({ achievements: updatedAchievements });
  },
  
  nextTutorialStep: () => {
    const state = get();
    const { TutorialSteps } = require('./contentGeneration');
    
    if (state.tutorialStep < TutorialSteps.length - 1) {
      set({ tutorialStep: state.tutorialStep + 1 });
    } else {
      set({ tutorialCompleted: true });
    }
  },
  
  useSkill: (skillId: string) => {
    const state = get();
    const skill = state.skills.find(s => s.id === skillId);
    
    if (skill && skill.currentCooldown === 0 && state.playerStats.mana >= skill.manaCost) {
      // Use skill
      const newMana = state.playerStats.mana - skill.manaCost;
      const updatedSkills = state.skills.map(s => 
        s.id === skillId ? { ...s, currentCooldown: s.cooldown } : s
      );
      
      // Apply skill effects
      if (skill.healing) {
        state.healPlayer(skill.healing);
      }
      
      // Damage nearby enemies if skill has damage
      if (skill.damage) {
        const playerPos = state.playerPosition;
        state.enemies.forEach(enemy => {
          const distance = Math.sqrt(
            Math.pow(enemy.position[0] - playerPos[0], 2) +
            Math.pow(enemy.position[2] - playerPos[2], 2)
          );
          
          if (distance < 10) {
            const newHealth = Math.max(0, enemy.health - skill.damage!);
            if (newHealth === 0) {
              state.defeatEnemy(enemy.id);
            } else {
              const updatedEnemies = state.enemies.map(e =>
                e.id === enemy.id ? { ...e, health: newHealth } : e
              );
              set({ enemies: updatedEnemies });
            }
          }
        });
      }
      
      set({
        playerStats: { ...state.playerStats, mana: newMana },
        skills: updatedSkills,
        auraActive: true,
        auraColor: skill.auraColor,
      });
      
      // Deactivate aura after 1 second
      setTimeout(() => set({ auraActive: false }), 1000);
    }
  },
  
  toggleAura: () => {
    const state = get();
    set({ auraActive: !state.auraActive });
  },
  
  updateSkillCooldowns: (delta: number) => {
    const state = get();
    const updatedSkills = state.skills.map(skill => ({
      ...skill,
      currentCooldown: Math.max(0, skill.currentCooldown - delta),
    }));
    
    // Also regenerate mana
    const newMana = Math.min(
      state.playerStats.maxMana,
      state.playerStats.mana + delta * 2
    );
    
    set({ 
      skills: updatedSkills,
      playerStats: { ...state.playerStats, mana: newMana },
      totalPlayTime: state.totalPlayTime + delta,
    });
  },
}));
