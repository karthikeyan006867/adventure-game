# 異世界転生 - Isekai Adventure Game 🎮✨

**Experience a second life in another world!** The ultimate anime-style 3D isekai adventure with **9 unique classes**, **magic systems**, **pets**, and **20,000+ possibilities**!

## 🌟 Isekai Features

### 🎭 Choose Your Destiny - 9 Unique Classes
- **Full 3D Movement** - WASD/Arrow keys + Space to jump
- **Dynamic Camera** - Smooth third-person follow camera
- **Physics-Based** - Realistic collision detection and gravity
- **Procedural World** - 100+ randomly generated obstacles, trees, rocks, and collectibles

### 📈 Progression System
- **Level Up System** - Gain XP by exploring and completing quests
- **Stats Growth** - Health, Mana, Stamina, Attack, Defense, Speed, Magic, and Luck
- **Dynamic Scaling** - XP requirements increase by 1.5x each level

### 🐾 Pet System (20,000+ Combinations)
- **10 Unique Pet Types**: Dragon, Wolf, Phoenix, Tiger, Unicorn, Griffin, Fox, Owl, Slime, Fairy
- **5 Rarity Levels**: Common, Rare, Epic, Legendary, Mythic
- **Pet Stats**: Each pet has unique Attack, Defense, Speed, and Magic stats
- **Special Abilities**: 3+ unique abilities per pet type
- **Pet AI**: Companions follow you with smooth bobbing animations
- **Collect & Switch**: Discover new pets and switch active companion anytime
- **Summoner Synergy**: Summoner class gets special pet bonuses!

### 🗺️ World Exploration
- **10 Diverse Biomes**:
  - 🌱 Starter Plains
  - 🌲 Mystic Forest
  - ⛰️ Crystal Peaks
  - 🏜️ Scorching Dunes
  - ❄️ Frozen Wasteland
  - 🌋 Inferno Caldera
  - 🌊 Azure Depths
  - ☁️ Celestial Isles
  - 💎 Prismatic Caverns
  - 🌑 Void Realm

### 🎨 Visual Effects
- **Dynamic Sky** - Beautiful skybox with sun positioning
- **Star Field** - 5,000 twinkling stars
- **Particle System** - 1,000 floating ambient particles
- **Fog & Lighting** - Atmospheric depth with directional shadows
- **Pet Glow Effects** - Each pet type has unique colored auras

### 📊 Game Interface
- **Real-time HUD** - Health, Mana, Stamina, and XP bars
- **Stats Display** - Live tracking of all player attributes
- **Pet Menu** - View and manage your pet collection
- **Quest Log** - Track active quests and progress
- **Zone Indicator** - Current location display
- **Gold & Inventory** - Resource management

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone or download the project**

2. **Install dependencies**
```bash
npm install
```

3. **Run development server**
```bash
npm run dev
```

4. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000)

## 🎮 Controls

| Key | Action |
|-----|--------|
| W / ↑ | Move Forward |
| S / ↓ | Move Backward |
| A / ← | Move Left |
| D / → | Move Right |
| Space | Jump |
| Mouse | Look Around (when OrbitControls active) |

## 🌐 Deploy to Vercel

### One-Click Deploy

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Vercel auto-detects Next.js - just click "Deploy"!

### Manual Deploy via CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Environment Setup
No environment variables needed! The game works out of the box.

## 🎯 Game Features Breakdown

### 20,000+ Possibilities
The game achieves massive variety through:
- **9 unique classes** × **3 skills each** = 27 unique abilities
- **10 pet types** × **5 rarity levels** = 50 base pet variants
- Each pet has **dynamic stats** based on level (∞ possibilities)
- **10 unique biomes** with different visual themes
- **100+ procedurally placed objects** per session
- **Dynamic quest generation** (ready for expansion)
- **Infinite XP scaling** for unlimited progression
- **Class-specific builds** and playstyles

### Anime/Isekai Elements
- **Japanese aesthetics** - "異世界転生" title screen
- **Reincarnation story** - "Second life in another world" theme
- **Class archetypes** - Classic anime RPG roles
- **Mana system** - Like your favorite isekai anime
- **Pet companions** - Faithful familiars on your journey
- **Level progression** - Satisfying power growth
- **Skill system** - Flashy abilities with cooldowns
- **Adventure zones** - Explore diverse fantasy realms

### Technical Highlights
- **React Three Fiber** - Declarative 3D with React
- **Rapier Physics** - Fast, accurate physics simulation
- **Zustand State** - Lightweight global state management
- **TypeScript** - Full type safety
- **Next.js 14** - Latest features with App Router
- **Optimized Rendering** - 60 FPS performance target

## 📁 Project Structure

```
epic-isekai-adventure/
├── app/
│   ├── page.tsx          # Main game page with intro
│   ├── layout.tsx        # Root layout
│   └── globals.css       # Global styles
├── components/
│   ├── Game3D.tsx        # 3D game engine with auras
│   ├── GameHUD.tsx       # User interface with skill bars
│   └── IsekaiIntro.tsx   # Story intro & class selection
├── store/
│   ├── gameStore.ts      # Zustand state management
│   ├── gameData.ts       # Pet templates & zones
│   └── classData.ts      # Class definitions & skills
├── package.json
├── tsconfig.json
├── next.config.js
└── vercel.json          # Vercel deployment config
```

## 🛠️ Customization

### Add New Classes
Edit `store/classData.ts` and add to `CLASS_DATA`:

```typescript
'custom-class': {
  name: 'Your Class',
  description: 'Amazing class description',
  primaryStat: 'Attack',
  color: '#ff00ff',
  startingStats: { attack: 20, defense: 15, speed: 10, magic: 15 },
  skills: [
    {
      name: 'Super Skill',
      description: 'Does awesome things',
      manaCost: 20,
      cooldown: 5,
      damage: 100,
      auraColor: '#ff00ff',
    },
  ],
}
```

### Add New Skills
Add skills to any class in `CLASS_DATA[className].skills`:

```typescript
{
  name: 'Ultimate Move',
  description: 'Your signature technique',
  manaCost: 50,
  cooldown: 15,
  damage: 300,
  healing: 50,  // Optional
  effect: 'custom_effect',  // Optional
  auraColor: '#gold',
}
```

### Add New Pet Types
Edit `store/gameData.ts` and add to `PET_TEMPLATES`:

```typescript
{
  name: 'Your Pet',
  type: 'custom',
  stats: { attack: 20, defense: 15, speed: 20, magic: 25 },
  abilities: ['Ability 1', 'Ability 2', 'Ability 3'],
  rarity: 'epic',
}
```

### Add New Zones
Add to `ZONES` array in `store/gameData.ts`:

```typescript
{
  name: 'Your Zone',
  description: 'Amazing place',
  biome: 'custom',
  difficulty: 5,
  enemies: ['Enemy1', 'Enemy2'],
  resources: ['Resource1', 'Resource2'],
  color: '#hexcolor',
}
```

### Modify Player Stats
Edit initial values in `store/gameStore.ts` under `playerStats`

## 🎨 Future Enhancements
- **Combat system** with enemy AI
- **Multiplayer** co-op adventures
- **Guild system** for teams
- **Crafting & Forging** weapons and armor
- **Dungeon raids** with bosses
- **PvP Arena** for competitive play
- **Achievement system** with rewards
- **Mobile controls** for touch devices
- **Save/Load** game state to cloud
- **Voice acting** for story
- **Anime cutscenes** for epic moments
- **More classes** (Ninja, Samurai, Monk, etc.)
- **Romance system** for NPCs
- **Housing** and customization
- **Seasonal events** and limited items

## 📄 License
Open source - feel free to use and modify!

## 🤝 Contributing
Contributions welcome! Feel free to fork and submit PRs.

## 🌟 Credits
Built with ❤️ using:
- [Next.js](https://nextjs.org/)
- [Three.js](https://threejs.org/)
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber)
- [Rapier Physics](https://rapier.rs/)
- [Zustand](https://zustand-demo.pmnd.rs/)

---

**Your isekai adventure awaits! Begin your second life now! 🎮✨異世界へようこそ!**
