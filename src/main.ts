import Phaser from 'phaser';
import { LoadingScene } from '@scenes/LoadingScene';
import { MenuScene } from '@scenes/MenuScene';
import { LevelSelectScene } from '@scenes/LevelSelectScene';
import { GameScene } from '@scenes/GameScene';
import { GameOverScene } from '@scenes/GameOverScene';
import { GAME_WIDTH, GAME_HEIGHT } from './config';
import { AnimatedBackground } from '@scenes/AnimatedBackground';

const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    parent: 'app',
    backgroundColor: '#0e0f17',
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: GAME_WIDTH,
        height: GAME_HEIGHT
    },
    scene: [LoadingScene, AnimatedBackground, MenuScene, LevelSelectScene, GameScene, GameOverScene]
};

new Phaser.Game(config);
