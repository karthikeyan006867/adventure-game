import { Pet } from './gameStore';

export const PET_TEMPLATES: Omit<Pet, 'id' | 'level' | 'xp' | 'active'>[] = [
  {
    name: 'Fire Dragon',
    type: 'dragon',
    stats: { attack: 25, defense: 15, speed: 10, magic: 30 },
    abilities: ['Fire Breath', 'Wing Buffet', 'Intimidate'],
    rarity: 'legendary',
  },
  {
    name: 'Shadow Wolf',
    type: 'wolf',
    stats: { attack: 20, defense: 10, speed: 25, magic: 5 },
    abilities: ['Shadow Strike', 'Pack Howl', 'Stealth'],
    rarity: 'rare',
  },
  {
    name: 'Celestial Phoenix',
    type: 'phoenix',
    stats: { attack: 15, defense: 20, speed: 20, magic: 35 },
    abilities: ['Rebirth', 'Heal Aura', 'Flame Shield'],
    rarity: 'mythic',
  },
  {
    name: 'Thunder Tiger',
    type: 'tiger',
    stats: { attack: 30, defense: 12, speed: 22, magic: 8 },
    abilities: ['Lightning Pounce', 'Roar', 'Claw Fury'],
    rarity: 'epic',
  },
  {
    name: 'Mystic Unicorn',
    type: 'unicorn',
    stats: { attack: 12, defense: 18, speed: 18, magic: 32 },
    abilities: ['Healing Horn', 'Purify', 'Mana Surge'],
    rarity: 'epic',
  },
  {
    name: 'Storm Griffin',
    type: 'griffin',
    stats: { attack: 22, defense: 16, speed: 24, magic: 15 },
    abilities: ['Dive Attack', 'Wind Gust', 'Eagle Eye'],
    rarity: 'rare',
  },
  {
    name: 'Spirit Fox',
    type: 'fox',
    stats: { attack: 15, defense: 8, speed: 30, magic: 20 },
    abilities: ['Illusion', 'Quick Dash', 'Charm'],
    rarity: 'rare',
  },
  {
    name: 'Wise Owl',
    type: 'owl',
    stats: { attack: 10, defense: 12, speed: 15, magic: 28 },
    abilities: ['Wisdom Boost', 'Silent Strike', 'Night Vision'],
    rarity: 'common',
  },
  {
    name: 'Companion Slime',
    type: 'slime',
    stats: { attack: 8, defense: 15, speed: 12, magic: 15 },
    abilities: ['Bounce Attack', 'Split', 'Absorb'],
    rarity: 'common',
  },
  {
    name: 'Forest Fairy',
    type: 'fairy',
    stats: { attack: 10, defense: 8, speed: 28, magic: 35 },
    abilities: ['Nature Magic', 'Fairy Dust', 'Enchant'],
    rarity: 'epic',
  },
];

export function generateRandomPet(): Pet {
  const template = PET_TEMPLATES[Math.floor(Math.random() * PET_TEMPLATES.length)];
  return {
    ...template,
    id: `pet-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    level: 1,
    xp: 0,
    active: false,
  };
}

export interface Zone {
  name: string;
  description: string;
  biome: 'plains' | 'forest' | 'mountains' | 'desert' | 'ice' | 'volcano' | 'ocean' | 'sky' | 'crystal' | 'shadow';
  difficulty: number;
  enemies: string[];
  resources: string[];
  color: string;
}

export const ZONES: Zone[] = [
  {
    name: 'Starter Plains',
    description: 'Peaceful grasslands perfect for beginners',
    biome: 'plains',
    difficulty: 1,
    enemies: ['Slime', 'Rabbit', 'Bush Monster'],
    resources: ['Grass', 'Flowers', 'Berries'],
    color: '#90EE90',
  },
  {
    name: 'Mystic Forest',
    description: 'Ancient trees hide magical secrets',
    biome: 'forest',
    difficulty: 3,
    enemies: ['Treant', 'Forest Spirit', 'Wild Boar'],
    resources: ['Wood', 'Mushrooms', 'Herbs'],
    color: '#228B22',
  },
  {
    name: 'Crystal Peaks',
    description: 'Towering mountains with glowing crystals',
    biome: 'mountains',
    difficulty: 5,
    enemies: ['Stone Golem', 'Mountain Drake', 'Ice Troll'],
    resources: ['Crystal', 'Iron Ore', 'Gold Vein'],
    color: '#4682B4',
  },
  {
    name: 'Scorching Dunes',
    description: 'Endless desert with hidden oases',
    biome: 'desert',
    difficulty: 4,
    enemies: ['Sand Worm', 'Mummy', 'Desert Bandit'],
    resources: ['Sand Crystal', 'Ancient Relic', 'Cactus Fruit'],
    color: '#DEB887',
  },
  {
    name: 'Frozen Wasteland',
    description: 'Eternal winter realm of ice and snow',
    biome: 'ice',
    difficulty: 6,
    enemies: ['Ice Elemental', 'Frost Giant', 'Snow Yeti'],
    resources: ['Ice Shard', 'Frozen Core', 'Aurora Essence'],
    color: '#B0E0E6',
  },
  {
    name: 'Inferno Caldera',
    description: 'Volcanic realm of fire and molten rock',
    biome: 'volcano',
    difficulty: 7,
    enemies: ['Lava Serpent', 'Fire Elemental', 'Magma Titan'],
    resources: ['Obsidian', 'Flame Crystal', 'Molten Core'],
    color: '#FF4500',
  },
  {
    name: 'Azure Depths',
    description: 'Underwater kingdom of coral and mystery',
    biome: 'ocean',
    difficulty: 5,
    enemies: ['Sea Serpent', 'Kraken', 'Siren'],
    resources: ['Pearl', 'Coral', 'Trident Fragment'],
    color: '#1E90FF',
  },
  {
    name: 'Celestial Isles',
    description: 'Floating islands among the clouds',
    biome: 'sky',
    difficulty: 8,
    enemies: ['Sky Pirate', 'Cloud Dragon', 'Thunder Bird'],
    resources: ['Star Fragment', 'Cloud Essence', 'Wind Crystal'],
    color: '#87CEEB',
  },
  {
    name: 'Prismatic Caverns',
    description: 'Underground caves filled with rainbow crystals',
    biome: 'crystal',
    difficulty: 6,
    enemies: ['Crystal Golem', 'Gem Spider', 'Prism Wraith'],
    resources: ['Rainbow Crystal', 'Diamond', 'Mana Stone'],
    color: '#FF69B4',
  },
  {
    name: 'Void Realm',
    description: 'Dark dimension where reality bends',
    biome: 'shadow',
    difficulty: 10,
    enemies: ['Shadow Demon', 'Void Walker', 'Dark Lord'],
    resources: ['Dark Matter', 'Void Crystal', 'Shadow Essence'],
    color: '#2F4F4F',
  },
];

export function getRandomZone(): Zone {
  return ZONES[Math.floor(Math.random() * ZONES.length)];
}
