import { create } from 'zustand';

export interface Pet {
  id: string;
  name: string;
  type: 'dragon' | 'wolf' | 'phoenix' | 'tiger' | 'unicorn' | 'griffin' | 'fox' | 'owl';
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

interface GameState {
  // Player
  playerLevel: number;
  playerXP: number;
  playerXPToNext: number;
  playerStats: PlayerStats;
  playerPosition: [number, number, number];
  playerRotation: number;
  isMoving: boolean;
  currentAnimation: string;
  
  // Inventory
  gold: number;
  inventory: string[];
  
  // Pets
  pets: Pet[];
  activePet: Pet | null;
  
  // World
  currentZone: string;
  discoveredZones: string[];
  
  // Quests
  quests: Quest[];
  
  // Actions
  gainXP: (amount: number) => void;
  levelUp: () => void;
  updatePlayerPosition: (position: [number, number, number]) => void;
  updatePlayerRotation: (rotation: number) => void;
  setMoving: (moving: boolean) => void;
  setAnimation: (animation: string) => void;
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
}

export const useGameStore = create<GameState>((set, get) => ({
  // Initial Player State
  playerLevel: 1,
  playerXP: 0,
  playerXPToNext: 100,
  playerStats: {
    health: 100,
    maxHealth: 100,
    mana: 50,
    maxMana: 50,
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
  
  // Initial Inventory
  gold: 0,
  inventory: [],
  
  // Initial Pets
  pets: [],
  activePet: null,
  
  // Initial World
  currentZone: 'Starter Plains',
  discoveredZones: ['Starter Plains'],
  
  // Initial Quests
  quests: [],
  
  // Actions
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
    const updatedQuests = state.quests.map(q => {
      if (q.id === questId) {
        const newProgress = Math.min(q.maxProgress, progress);
        const completed = newProgress >= q.maxProgress;
        return { ...q, progress: newProgress, completed };
      }
      return q;
    });
    set({ quests: updatedQuests });
  },
  
  completeQuest: (questId: string) => {
    const state = get();
    const quest = state.quests.find(q => q.id === questId);
    if (quest && !quest.completed) {
      state.gainXP(quest.rewards.xp);
      state.addGold(quest.rewards.gold);
      quest.rewards.items.forEach(item => state.addItem(item));
      
      const updatedQuests = state.quests.map(q =>
        q.id === questId ? { ...q, completed: true, progress: q.maxProgress } : q
      );
      set({ quests: updatedQuests });
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
  },
}));
