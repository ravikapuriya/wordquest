import Phaser from 'phaser';
import { ASSET_KEYS, FONT_FAMILY, SCENE_KEYS } from '../config';
import { UIText } from '@utils/UIText';
import { UIPrimaryButton } from '@utils/UIPrimaryButton';
import { Save } from '../Storage';

export class MenuScene extends Phaser.Scene {
    constructor() { super(SCENE_KEYS.MENU); }

    async create() {
        const { width, height } = this.scale;

        // Get save data for high score display
        const saveData = await Save.get();

        // Logo
        const logo = this.add.image(width / 2 + 20, 450, ASSET_KEYS.LOGO).setScale(1.2);
        logo.setOrigin(0.5);

        // High Score
        if (saveData.highScore > 0) {
            new UIText(this, width / 2, logo.y + logo.height / 2 + 100, `High Score: ${saveData.highScore}`, '35px', '#ffd700', '#000', 3, FONT_FAMILY).setOrigin(0.5);
        }

        // Start Game button
        const startBtnY = height / 2 + 200;
        new UIPrimaryButton(this, width / 2, startBtnY, 'START GAME', () => {
            this.scene.start(SCENE_KEYS.LEVEL_SELECT);
        });

        // Daily challenge button
        // const optionsBtnY = startBtnY + 140;
        // new UIPrimaryButton(this, width / 2, optionsBtnY, 'DAILY CHALLENGE', () => {
        //     // TODO: Create daily challenge
        //     console.log('Daily challenge clicked');
        // });
    }
}
