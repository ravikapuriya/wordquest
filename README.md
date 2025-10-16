# Word Quest Game

A modern, interactive word search puzzle game built with Phaser 3 and TypeScript. Find hidden words in the grid by dragging your finger/mouse across letters!

## 🎮 Features

- **Multiple Levels**: Progressive difficulty with locked levels
- **Interactive Gameplay**: Drag to select words with visual feedback
- **Visual Effects**: Confetti animations, particle trails, and smooth transitions
- **Progress Tracking**: Score system with high score persistence
- **Modern UI**: Clean, responsive interface with animated buttons
- **Timer System**: Visual progress bar with bonus time rewards
- **Word Validation**: Horizontal and vertical word placement only
- **Local Storage**: Persistent game data and progress

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd phaser-word-search
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run start
```

4. Open your browser and navigate to `http://localhost:5173`

## 🎯 How to Play

1. **Start Game**: Click "START GAME" from the main menu
2. **Select Level**: Choose from available levels (locked levels require completion of previous levels)
3. **Find Words**: Drag your finger/mouse across letters to form words
4. **Score Points**: Earn points for each word found (10 points per letter + time bonus)
5. **Beat the Timer**: Complete all words before time runs out!

### Controls
- **Mouse/Touch**: Drag to select letters
- **Release**: Complete word selection
- **Visual Feedback**: Selected letters highlight with particle trails


## 🎨 Assets

The game uses a custom atlas system for UI elements:
- **game-ui.png/json**: Button backgrounds, level tiles, and UI elements
- **confetti.png/json**: Particle effects for word completion
- **Level JSON files**: Word lists and level configurations

## 🔧 Configuration

### Game Settings (`src/config.ts`)

- **Grid Size**: 12x12 tiles by default
- **Tile Size**: 80px tiles
- **Timer**: 120 seconds per level (configurable per level)
- **Scoring**: 10 points per letter + time bonus

### Level Configuration

Levels are defined in JSON files under `public/levels/`:

```json
{
  "id": "level1",
  "name": "Animals",
  "words": ["CAT", "DOG", "BIRD", "FISH"],
  "time": 120
}
```

## 🎮 Game Mechanics

### Word Placement Algorithm
- **Backtracking Algorithm**: Guarantees all words are placed
- **No Overlaps**: Each letter occupies a unique grid position
- **Random Distribution**: Words are scattered randomly across the grid
- **Direction Constraints**: Only horizontal and vertical placement

### Scoring System
- **Base Score**: 10 points per letter
- **Time Bonus**: Up to 3 seconds added per word found
- **High Score**: Persistent across sessions

### Level Progression
- **Unlock System**: Complete previous level to unlock next
- **Progress Tracking**: Completion status saved locally
- **Visual Indicators**: Checkmarks for completed levels

## 🛠️ Development

### Available Scripts

```bash
npm run start          # Start development server
npm run build          # Build for production
```

### Code Style

- **TypeScript**: Strict type checking enabled
- **ESLint + Prettier**: Code formatting and linting
- **Path Aliases**: Clean imports using `@game/*`, `@utils/*`, etc.

### Key Design Patterns

- **Component Architecture**: Reusable UI components
- **Scene Management**: Phaser scene-based architecture
- **Event-Driven**: Decoupled communication between systems
- **Factory Pattern**: Entity creation utilities

## 🎨 Customization

### Adding New Levels

1. Create a new JSON file in `public/levels/`
2. Add level configuration to `public/levels/manifest.json`
3. Ensure words fit within the 12x12 grid constraint

### Modifying UI

- **Colors**: Update color constants in `config.ts`
- **Fonts**: Modify `FONT_FAMILY` constant
- **Layout**: Adjust positioning in scene files

### Game Mechanics

- **Grid Size**: Modify `GRID_SIZE` in `config.ts`
- **Scoring**: Update scoring logic in `GameScene.ts`
- **Timer**: Adjust `DEFAULT_TIMER_SECONDS`

## 🐛 Troubleshooting

### Common Issues

1. **Words Not Appearing**: Check level JSON format and word length
2. **Performance Issues**: Reduce particle count or disable effects
3. **Storage Issues**: Clear browser localStorage if save data corrupts


## 📱 Browser Support

- **Modern Browsers**: Chrome, Firefox, Safari, Edge
- **Mobile**: iOS Safari, Android Chrome
- **WebGL**: Required for particle effects

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Phaser 3**: Game framework
- **Vite**: Build tool and dev server
- **TypeScript**: Type safety and developer experience

## Made with ❤️ by Ravi Kapuriya

---

**Enjoy playing Word Search!** 🎉
