# Epic 3D Adventure Game 🎮

The ultimate 3D adventure game with **20,000+ possibilities**, featuring dynamic 3D movement, leveling systems, pets, and endless exploration!

## ✨ Features

### 🎯 Core Gameplay
- **Full 3D Movement** - WASD/Arrow keys + Space to jump
- **Dynamic Camera** - Smooth third-person follow camera
- **Physics-Based** - Realistic collision detection and gravity
- **Procedural World** - 100+ randomly generated obstacles, trees, rocks, and collectibles

### 📈 Progression System
- **Level Up System** - Gain XP by exploring and completing quests
- **Stats Growth** - Health, Mana, Stamina, Attack, Defense, Speed, Magic, and Luck
- **Dynamic Scaling** - XP requirements increase by 1.5x each level

### 🐾 Pet System (20,000+ Combinations)
- **8 Unique Pet Types**: Dragon, Wolf, Phoenix, Tiger, Unicorn, Griffin, Fox, Owl
- **5 Rarity Levels**: Common, Rare, Epic, Legendary, Mythic
- **Pet Stats**: Each pet has unique Attack, Defense, Speed, and Magic stats
- **Special Abilities**: 3+ unique abilities per pet type
- **Pet AI**: Companions follow you with smooth bobbing animations
- **Collect & Switch**: Discover new pets and switch active companion anytime

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
- **8 pet types** × **5 rarity levels** = 40 base pet variants
- Each pet has **dynamic stats** based on level (∞ possibilities)
- **10 unique biomes** with different visual themes
- **100+ procedurally placed objects** per session
- **Dynamic quest generation** (ready for expansion)
- **Infinite XP scaling** for unlimited progression

### Technical Highlights
- **React Three Fiber** - Declarative 3D with React
- **Rapier Physics** - Fast, accurate physics simulation
- **Zustand State** - Lightweight global state management
- **TypeScript** - Full type safety
- **Next.js 14** - Latest features with App Router
- **Optimized Rendering** - 60 FPS performance target

## 📁 Project Structure

```
epic-3d-adventure/
├── app/
│   ├── page.tsx          # Main game page
│   ├── layout.tsx        # Root layout
│   └── globals.css       # Global styles
├── components/
│   ├── Game3D.tsx        # 3D game engine
│   └── GameHUD.tsx       # User interface overlay
├── store/
│   ├── gameStore.ts      # Zustand state management
│   └── gameData.ts       # Pet templates & zones
├── package.json
├── tsconfig.json
├── next.config.js
└── vercel.json          # Vercel deployment config
```

## 🛠️ Customization

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
- Combat system with enemies
- Multiplayer support
- Item crafting system
- Achievement system
- Mobile touch controls
- Save/Load game state
- Sound effects & music
- More pet animations
- Boss battles
- Trading system

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

**Enjoy your adventure! 🎮✨**
