import Phaser from 'phaser';
import { FONT_FAMILY, SCENE_KEYS } from '../config';
import { UIText } from '@utils/UIText';
import { UIPrimaryButton } from '@utils/UIPrimaryButton';
import { Save } from '../Storage';
import { LevelManager } from '@game/LevelManager';

export class GameOverScene extends Phaser.Scene {
    constructor() { super(SCENE_KEYS.GAME_OVER); }

    async create(data: { score: number; found: number; total: number; levelId: string; win: boolean }) {
        const { width, height } = this.scale;

        // Get saved data for high score display
        const saveData = await Save.get();
        const isNewHighScore = data.score > 0 && data.score === saveData.highScore && data.score > (saveData.highScore - data.score);

        // Title
        new UIText(this, width / 2, 250, data.win ? 'LEVEL COMPLETE!' : 'TIME UP!', '60px', data.win ? '#c7ffd9' : '#ffb3b3', '#000', 5, FONT_FAMILY).setOrigin(0.5);

        // Level number
        const level = LevelManager.getLevel(this, data.levelId);
        new UIText(this, width / 2, 380, `Level ${Number(data.levelId.replace('level', ''))} - ${level?.name}`, '32px', '#9cb6ff', '#000', 3, FONT_FAMILY).setOrigin(0.5);

        // Score
        new UIText(this, width / 2, 450, `Score: ${data.score}`, '40px', '#e7f0ff', '#000', 4, FONT_FAMILY).setOrigin(0.5);

        // High score indicator
        if (isNewHighScore) {
            new UIText(this, width / 2, 500, '🏆 NEW HIGH SCORE! 🏆', '32px', '#ffd700', '#000', 4, FONT_FAMILY).setOrigin(0.5);
        } else {
            new UIText(this, width / 2, 500, `High Score: ${saveData.highScore}`, '30px', '#9cb6ff', '#000', 3, FONT_FAMILY).setOrigin(0.5);
        }

        // Words found
        new UIText(this, width / 2, 550, `Words Found: ${data.found}/${data.total}`, '26px', '#9cb6ff', '#000', 3, FONT_FAMILY).setOrigin(0.5);

        // Buttons
        const btnY1 = height / 2 + 220;
        const btnY2 = btnY1 + 120;
        const btnY3 = btnY2 + 120;

        new UIPrimaryButton(this, width / 2, btnY1, 'RESTART LEVEL', () => {
            this.scene.start(SCENE_KEYS.GAME, { levelId: data.levelId });
        }, 450, 90);

        new UIPrimaryButton(this, width / 2, btnY2, 'LEVEL SELECT', () => {
            this.scene.start(SCENE_KEYS.LEVEL_SELECT);
        }, 450, 90);

        new UIPrimaryButton(this, width / 2, btnY3, 'MAIN MENU', () => {
            this.scene.start(SCENE_KEYS.MENU);
        }, 450, 90);
    }
}
