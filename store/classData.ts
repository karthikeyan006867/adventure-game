import { Skill, PlayerClass } from './gameStore';

export interface ClassInfo {
  name: string;
  description: string;
  primaryStat: string;
  color: string;
  startingStats: {
    attack: number;
    defense: number;
    speed: number;
    magic: number;
  };
  skills: Omit<Skill, 'id' | 'currentCooldown'>[];
}

export const CLASS_DATA: Record<PlayerClass, ClassInfo> = {
  'swordsman': {
    name: 'Swordsman',
    description: 'Master of blade and steel. High attack and defense.',
    primaryStat: 'Attack',
    color: '#ff4444',
    startingStats: { attack: 20, defense: 15, speed: 10, magic: 5 },
    skills: [
      {
        name: 'Blade Rush',
        description: 'Dash forward with a powerful slash',
        manaCost: 10,
        cooldown: 3,
        damage: 50,
        auraColor: '#ff4444',
      },
      {
        name: 'Steel Fortress',
        description: 'Increase defense temporarily',
        manaCost: 15,
        cooldown: 8,
        effect: 'defense_boost',
        auraColor: '#888888',
      },
      {
        name: 'Ultimate Strike',
        description: 'Devastating sword technique',
        manaCost: 30,
        cooldown: 15,
        damage: 150,
        auraColor: '#ffaa00',
      },
    ],
  },
  
  'fire-mage': {
    name: 'Fire Mage',
    description: 'Wields destructive flames. Master of fire magic.',
    primaryStat: 'Magic',
    color: '#ff6600',
    startingStats: { attack: 8, defense: 8, speed: 12, magic: 25 },
    skills: [
      {
        name: 'Fireball',
        description: 'Launch a blazing fireball',
        manaCost: 15,
        cooldown: 2,
        damage: 60,
        auraColor: '#ff4400',
      },
      {
        name: 'Flame Aura',
        description: 'Surround yourself with fire',
        manaCost: 20,
        cooldown: 10,
        effect: 'fire_aura',
        auraColor: '#ff8800',
      },
      {
        name: 'Meteor Strike',
        description: 'Rain fire from the heavens',
        manaCost: 40,
        cooldown: 20,
        damage: 200,
        auraColor: '#ff0000',
      },
    ],
  },
  
  'water-mage': {
    name: 'Water Mage',
    description: 'Controls water and ice. Balanced offense and support.',
    primaryStat: 'Magic',
    color: '#00aaff',
    startingStats: { attack: 10, defense: 10, speed: 10, magic: 22 },
    skills: [
      {
        name: 'Ice Shard',
        description: 'Launch sharp ice projectiles',
        manaCost: 12,
        cooldown: 2.5,
        damage: 45,
        auraColor: '#00ddff',
      },
      {
        name: 'Healing Water',
        description: 'Restore health with magical water',
        manaCost: 18,
        cooldown: 8,
        healing: 50,
        auraColor: '#00ffdd',
      },
      {
        name: 'Tsunami',
        description: 'Massive wave of destruction',
        manaCost: 35,
        cooldown: 18,
        damage: 180,
        auraColor: '#0088ff',
      },
    ],
  },
  
  'light-mage': {
    name: 'Light Mage',
    description: 'Channel holy light. Excellent healer and support.',
    primaryStat: 'Magic',
    color: '#ffff00',
    startingStats: { attack: 6, defense: 12, speed: 10, magic: 24 },
    skills: [
      {
        name: 'Holy Ray',
        description: 'Beam of purifying light',
        manaCost: 14,
        cooldown: 3,
        damage: 40,
        auraColor: '#ffffff',
      },
      {
        name: 'Divine Blessing',
        description: 'Heal yourself and allies',
        manaCost: 20,
        cooldown: 6,
        healing: 80,
        auraColor: '#ffffaa',
      },
      {
        name: 'Judgment',
        description: 'Ultimate holy punishment',
        manaCost: 45,
        cooldown: 22,
        damage: 220,
        auraColor: '#ffff00',
      },
    ],
  },
  
  'dark-mage': {
    name: 'Dark Mage',
    description: 'Harness shadow magic. High damage and debuffs.',
    primaryStat: 'Magic',
    color: '#9900ff',
    startingStats: { attack: 12, defense: 8, speed: 14, magic: 26 },
    skills: [
      {
        name: 'Shadow Bolt',
        description: 'Dark energy projectile',
        manaCost: 16,
        cooldown: 2,
        damage: 55,
        auraColor: '#6600aa',
      },
      {
        name: 'Life Drain',
        description: 'Steal enemy life force',
        manaCost: 22,
        cooldown: 9,
        damage: 40,
        healing: 40,
        auraColor: '#aa00ff',
      },
      {
        name: 'Dark Eclipse',
        description: 'Engulf enemies in darkness',
        manaCost: 50,
        cooldown: 25,
        damage: 250,
        auraColor: '#330066',
      },
    ],
  },
  
  'earth-mage': {
    name: 'Earth Mage',
    description: 'Command stone and nature. Tank mage with high defense.',
    primaryStat: 'Defense',
    color: '#885522',
    startingStats: { attack: 10, defense: 18, speed: 6, magic: 20 },
    skills: [
      {
        name: 'Rock Throw',
        description: 'Hurl a boulder at enemies',
        manaCost: 10,
        cooldown: 3,
        damage: 50,
        auraColor: '#aa8855',
      },
      {
        name: 'Stone Skin',
        description: 'Turn your skin to stone',
        manaCost: 15,
        cooldown: 12,
        effect: 'stone_skin',
        auraColor: '#666666',
      },
      {
        name: 'Earthquake',
        description: 'Shake the earth itself',
        manaCost: 38,
        cooldown: 20,
        damage: 160,
        auraColor: '#885522',
      },
    ],
  },
  
  'archer': {
    name: 'Archer',
    description: 'Swift ranged attacker. High speed and precision.',
    primaryStat: 'Speed',
    color: '#00ff00',
    startingStats: { attack: 16, defense: 10, speed: 20, magic: 8 },
    skills: [
      {
        name: 'Quick Shot',
        description: 'Rapid arrow attack',
        manaCost: 8,
        cooldown: 1.5,
        damage: 35,
        auraColor: '#00ff88',
      },
      {
        name: 'Multi-Shot',
        description: 'Fire multiple arrows',
        manaCost: 18,
        cooldown: 7,
        damage: 80,
        auraColor: '#00ff00',
      },
      {
        name: 'Arrow Rain',
        description: 'Shower of deadly arrows',
        manaCost: 32,
        cooldown: 16,
        damage: 170,
        auraColor: '#44ff00',
      },
    ],
  },
  
  'healer': {
    name: 'Healer',
    description: 'Support specialist. Keeps allies alive.',
    primaryStat: 'Magic',
    color: '#ff88ff',
    startingStats: { attack: 5, defense: 10, speed: 12, magic: 28 },
    skills: [
      {
        name: 'Heal',
        description: 'Restore health',
        manaCost: 12,
        cooldown: 3,
        healing: 60,
        auraColor: '#ffaaff',
      },
      {
        name: 'Regeneration',
        description: 'Heal over time',
        manaCost: 20,
        cooldown: 10,
        healing: 100,
        effect: 'regen',
        auraColor: '#ff66ff',
      },
      {
        name: 'Mass Resurrection',
        description: 'Ultimate healing power',
        manaCost: 50,
        cooldown: 30,
        healing: 200,
        auraColor: '#ff00ff',
      },
    ],
  },
  
  'summoner': {
    name: 'Summoner',
    description: 'Calls forth magical creatures. Pet specialist.',
    primaryStat: 'Magic',
    color: '#00ffff',
    startingStats: { attack: 8, defense: 10, speed: 10, magic: 24 },
    skills: [
      {
        name: 'Summon Familiar',
        description: 'Call a magical companion',
        manaCost: 15,
        cooldown: 5,
        effect: 'summon',
        auraColor: '#00ffff',
      },
      {
        name: 'Pet Power',
        description: 'Boost pet abilities',
        manaCost: 20,
        cooldown: 12,
        effect: 'pet_boost',
        auraColor: '#00dddd',
      },
      {
        name: 'Ultimate Summon',
        description: 'Summon a legendary beast',
        manaCost: 45,
        cooldown: 25,
        damage: 190,
        auraColor: '#00aaaa',
      },
    ],
  },
};

export function initializeClassSkills(playerClass: PlayerClass): Skill[] {
  const classInfo = CLASS_DATA[playerClass];
  return classInfo.skills.map((skill, index) => ({
    ...skill,
    id: `skill-${playerClass}-${index}`,
    currentCooldown: 0,
  }));
}

export function getClassColor(playerClass: PlayerClass): string {
  return CLASS_DATA[playerClass].color;
}

export function getClassStats(playerClass: PlayerClass) {
  return CLASS_DATA[playerClass].startingStats;
}
