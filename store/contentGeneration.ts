import { Quest } from './gameStore';

// Enemy types with stats and behaviors
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

// Procedural quest generation
export function generateQuest(playerLevel: number, questNumber: number): Quest {
  const questTypes = ['kill', 'collect', 'explore', 'escort', 'boss', 'puzzle', 'dungeon'];
  const randomType = questTypes[Math.floor(Math.random() * questTypes.length)];
  
  const questTemplates = {
    kill: [
      { title: 'Pest Control', desc: 'Defeat {count} {enemy} in the {zone}', max: 10 },
      { title: 'Monster Hunter', desc: 'Hunt down {count} dangerous {enemy}', max: 15 },
      { title: 'Clear the Path', desc: 'Eliminate {count} {enemy} blocking the road', max: 8 },
      { title: 'Bounty Hunt', desc: 'Collect bounty by defeating {count} {enemy}', max: 12 },
    ],
    collect: [
      { title: 'Resource Gathering', desc: 'Collect {count} {item} from {zone}', max: 20 },
      { title: 'Rare Materials', desc: 'Find {count} rare {item}', max: 15 },
      { title: 'Herb Collection', desc: 'Gather {count} medicinal {item}', max: 25 },
    ],
    explore: [
      { title: 'Uncharted Territory', desc: 'Discover the hidden {zone}', max: 1 },
      { title: 'Exploration Mission', desc: 'Visit {count} different zones', max: 5 },
      { title: 'Ancient Ruins', desc: 'Explore the forgotten {zone}', max: 1 },
    ],
    boss: [
      { title: 'Dragon Slayer', desc: 'Defeat the legendary {enemy}', max: 1 },
      { title: 'Ultimate Challenge', desc: 'Conquer the {enemy} of {zone}', max: 1 },
    ],
  };
  
  const enemies = ['Slime', 'Goblin', 'Wolf', 'Orc', 'Dragon', 'Demon', 'Skeleton', 'Zombie', 'Golem', 'Wraith'];
  const items = ['Herbs', 'Crystals', 'Ore', 'Essence', 'Fragments', 'Scrolls'];
  const zones = ['Forest', 'Mountains', 'Desert', 'Tundra', 'Volcano', 'Ocean', 'Sky Realm', 'Underworld'];
  
  const templates = questTemplates[randomType as keyof typeof questTemplates] || questTemplates.kill;
  const template = templates[Math.floor(Math.random() * templates.length)];
  
  const count = Math.ceil(template.max * (1 + playerLevel * 0.2));
  const title = template.title;
  const desc = template.desc
    .replace('{count}', count.toString())
    .replace('{enemy}', enemies[Math.floor(Math.random() * enemies.length)])
    .replace('{item}', items[Math.floor(Math.random() * items.length)])
    .replace('{zone}', zones[Math.floor(Math.random() * zones.length)]);
  
  const baseXP = 50 + playerLevel * 25;
  const baseGold = 20 + playerLevel * 10;
  
  return {
    id: `quest-${questNumber}-${Date.now()}`,
    title,
    description: desc,
    type: randomType === 'boss' ? 'epic' : randomType === 'explore' ? 'main' : Math.random() > 0.5 ? 'side' : 'daily',
    rewards: {
      xp: Math.floor(baseXP * (1 + Math.random())),
      gold: Math.floor(baseGold * (1 + Math.random())),
      items: generateRewardItems(playerLevel),
    },
    completed: false,
    progress: 0,
    maxProgress: count,
  };
}

function generateRewardItems(playerLevel: number): string[] {
  const itemPool = [
    'Health Potion', 'Mana Potion', 'Elixir', 'Ether',
    'Iron Sword', 'Steel Armor', 'Mythril Shield', 'Dragon Scale',
    'Magic Ring', 'Amulet of Power', 'Lucky Charm', 'Ancient Scroll',
    'Crystal Shard', 'Gemstone', 'Rare Ore', 'Enchanted Essence',
  ];
  
  const itemCount = 1 + Math.floor(Math.random() * 3);
  const items: string[] = [];
  
  for (let i = 0; i < itemCount; i++) {
    items.push(itemPool[Math.floor(Math.random() * itemPool.length)]);
  }
  
  return items;
}

// Generate enemies in the world
export function spawnEnemy(zone: string, playerLevel: number): Enemy {
  const enemyTypes = [
    { name: 'Slime', attack: 5, defense: 2, hp: 30 },
    { name: 'Goblin', attack: 8, defense: 4, hp: 50 },
    { name: 'Wolf', attack: 12, defense: 5, hp: 60 },
    { name: 'Orc Warrior', attack: 15, defense: 10, hp: 100 },
    { name: 'Dark Mage', attack: 20, defense: 8, hp: 80 },
    { name: 'Stone Golem', attack: 18, defense: 20, hp: 150 },
    { name: 'Dragon Whelp', attack: 25, defense: 15, hp: 120 },
    { name: 'Demon Scout', attack: 30, defense: 12, hp: 100 },
    { name: 'Ice Elemental', attack: 22, defense: 10, hp: 90 },
    { name: 'Fire Imp', attack: 24, defense: 8, hp: 70 },
  ];
  
  const type = enemyTypes[Math.min(Math.floor(playerLevel / 5), enemyTypes.length - 1)];
  const levelVariance = Math.floor(Math.random() * 3) - 1;
  const level = Math.max(1, playerLevel + levelVariance);
  
  const x = (Math.random() - 0.5) * 180;
  const z = (Math.random() - 0.5) * 180;
  
  return {
    id: `enemy-${Date.now()}-${Math.random()}`,
    name: type.name,
    level,
    health: type.hp * level,
    maxHealth: type.hp * level,
    attack: type.attack + level * 2,
    defense: type.defense + level,
    xpReward: 10 + level * 5,
    goldReward: 5 + level * 2,
    position: [x, 1, z],
    type: type.name,
    aggressive: Math.random() > 0.3,
  };
}

// Dungeon generation
export interface Dungeon {
  id: string;
  name: string;
  difficulty: number;
  floors: number;
  boss: string;
  rewards: string[];
  requiredLevel: number;
}

export function generateDungeon(index: number): Dungeon {
  const dungeonNames = [
    'Cursed Catacombs', 'Tower of Eternity', 'Abyssal Depths',
    'Crystal Caverns', 'Demon\'s Lair', 'Dragon\'s Nest',
    'Frozen Fortress', 'Volcanic Crater', 'Shadow Realm',
    'Ancient Temple', 'Sky Citadel', 'Underwater Palace',
  ];
  
  const bosses = [
    'Ancient Lich', 'Crimson Dragon', 'Void Demon',
    'Ice Queen', 'Fire Lord', 'Storm King',
    'Shadow Assassin', 'Corrupted Guardian', 'Mad Scientist',
  ];
  
  const name = dungeonNames[index % dungeonNames.length];
  const difficulty = 1 + Math.floor(index / 3);
  const floors = 3 + difficulty * 2;
  
  return {
    id: `dungeon-${index}`,
    name,
    difficulty,
    floors,
    boss: bosses[index % bosses.length],
    rewards: generateRewardItems(difficulty * 10),
    requiredLevel: difficulty * 10,
  };
}

// NPC dialogue system
export interface NPC {
  id: string;
  name: string;
  role: 'merchant' | 'quest-giver' | 'trainer' | 'blacksmith' | 'elder';
  dialogue: string[];
  position: [number, number, number];
}

export const NPCs: NPC[] = [
  {
    id: 'npc-elder',
    name: 'Village Elder',
    role: 'quest-giver',
    dialogue: [
      'Welcome, brave adventurer!',
      'Our village needs your help.',
      'Monsters have been causing trouble lately...',
      'Will you aid us in our time of need?',
    ],
    position: [10, 0, 10],
  },
  {
    id: 'npc-merchant',
    name: 'Traveling Merchant',
    role: 'merchant',
    dialogue: [
      'Care to browse my wares?',
      'I have potions, equipment, and more!',
      'Special discount for heroes like you!',
    ],
    position: [15, 0, 5],
  },
  {
    id: 'npc-blacksmith',
    name: 'Master Blacksmith',
    role: 'blacksmith',
    dialogue: [
      'Need your equipment upgraded?',
      'I can forge the finest weapons!',
      'Bring me materials and I\'ll craft something amazing.',
    ],
    position: [-10, 0, 15],
  },
  {
    id: 'npc-trainer',
    name: 'Skill Trainer',
    role: 'trainer',
    dialogue: [
      'Want to learn new abilities?',
      'I can teach you powerful techniques!',
      'Mastery comes with practice, young one.',
    ],
    position: [-15, 0, -10],
  },
];

// Crafting recipes
export interface Recipe {
  id: string;
  name: string;
  materials: { name: string; count: number }[];
  result: string;
  category: 'weapon' | 'armor' | 'potion' | 'accessory';
}

export const CraftingRecipes: Recipe[] = [
  {
    id: 'iron-sword',
    name: 'Iron Sword',
    materials: [{ name: 'Iron Ore', count: 5 }, { name: 'Wood', count: 2 }],
    result: 'Iron Sword',
    category: 'weapon',
  },
  {
    id: 'steel-armor',
    name: 'Steel Armor',
    materials: [{ name: 'Steel Ingot', count: 8 }, { name: 'Leather', count: 4 }],
    result: 'Steel Armor',
    category: 'armor',
  },
  {
    id: 'health-potion',
    name: 'Health Potion',
    materials: [{ name: 'Herbs', count: 3 }, { name: 'Crystal', count: 1 }],
    result: 'Health Potion',
    category: 'potion',
  },
  {
    id: 'mana-potion',
    name: 'Mana Potion',
    materials: [{ name: 'Mana Essence', count: 2 }, { name: 'Crystal', count: 1 }],
    result: 'Mana Potion',
    category: 'potion',
  },
];

// Achievement system
export interface Achievement {
  id: string;
  name: string;
  description: string;
  requirement: number;
  progress: number;
  unlocked: boolean;
  reward: { xp: number; gold: number };
}

export const Achievements: Achievement[] = [
  { id: 'first-steps', name: 'First Steps', description: 'Reach level 5', requirement: 5, progress: 0, unlocked: false, reward: { xp: 100, gold: 50 } },
  { id: 'apprentice', name: 'Apprentice', description: 'Reach level 10', requirement: 10, progress: 0, unlocked: false, reward: { xp: 500, gold: 200 } },
  { id: 'veteran', name: 'Veteran', description: 'Reach level 25', requirement: 25, progress: 0, unlocked: false, reward: { xp: 2000, gold: 1000 } },
  { id: 'master', name: 'Master', description: 'Reach level 50', requirement: 50, progress: 0, unlocked: false, reward: { xp: 10000, gold: 5000 } },
  { id: 'legend', name: 'Legend', description: 'Reach level 100', requirement: 100, progress: 0, unlocked: false, reward: { xp: 50000, gold: 25000 } },
  { id: 'pet-collector', name: 'Pet Collector', description: 'Collect 10 pets', requirement: 10, progress: 0, unlocked: false, reward: { xp: 1000, gold: 500 } },
  { id: 'quest-master', name: 'Quest Master', description: 'Complete 100 quests', requirement: 100, progress: 0, unlocked: false, reward: { xp: 5000, gold: 2500 } },
  { id: 'dungeon-delver', name: 'Dungeon Delver', description: 'Clear 10 dungeons', requirement: 10, progress: 0, unlocked: false, reward: { xp: 3000, gold: 1500 } },
  { id: 'monster-slayer', name: 'Monster Slayer', description: 'Defeat 1000 enemies', requirement: 1000, progress: 0, unlocked: false, reward: { xp: 10000, gold: 5000 } },
  { id: 'wealthy', name: 'Wealthy', description: 'Accumulate 100,000 gold', requirement: 100000, progress: 0, unlocked: false, reward: { xp: 5000, gold: 10000 } },
];

// Tutorial steps
export const TutorialSteps = [
  { id: 'movement', title: 'Movement', description: 'Use WASD or Arrow keys to move your character around the world.' },
  { id: 'jump', title: 'Jumping', description: 'Press SPACE to jump over obstacles and explore vertical spaces.' },
  { id: 'skills', title: 'Using Skills', description: 'Press keys 1-4 to use your class abilities. Watch your mana!' },
  { id: 'combat', title: 'Combat Basics', description: 'Approach enemies to engage in combat. Use skills strategically!' },
  { id: 'quests', title: 'Quests', description: 'Talk to NPCs to receive quests. Complete them for rewards!' },
  { id: 'pets', title: 'Pet System', description: 'Collect and summon pets to fight alongside you!' },
  { id: 'crafting', title: 'Crafting', description: 'Gather materials and visit the blacksmith to craft items.' },
  { id: 'dungeons', title: 'Dungeons', description: 'Challenge dungeons for epic loot and face powerful bosses!' },
];
