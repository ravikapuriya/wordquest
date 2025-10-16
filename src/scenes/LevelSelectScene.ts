import Phaser from 'phaser';
import { ASSET_KEYS, FONT_FAMILY, SCENE_KEYS } from '../config';
import { UIText } from '@utils/UIText';
import { UIPrimaryButton } from '@utils/UIPrimaryButton';
import { Save } from '../Storage';

export class LevelSelectScene extends Phaser.Scene {
    constructor() { super(SCENE_KEYS.LEVEL_SELECT); }

    async create() {
        const { width, height } = this.scale;

        // Get save data to check completed levels
        const saveData = await Save.get();

        // Title
        new UIText(this, width / 2, 200, 'SELECT LEVEL', '48px', '#cfe3ff', '#000', 4, FONT_FAMILY).setOrigin(0.5);

        const manifest = this.cache.json.get('levels:manifest') as { levels: { id: string, name: string, file: string, time?: number }[] };

        if (!manifest?.levels?.length) {
            new UIText(this, width / 2, height / 2, 'No levels found', '24px', '#ffb3b3', '#000', 4, FONT_FAMILY).setOrigin(0.5);
            return;
        }

        // Grid layout for level buttons
        const cols = 3;
        const btnSize = 200;
        const gap = 30;
        const startX = width / 2 - (cols * btnSize + (cols - 1) * gap) / 2 + btnSize / 2;
        const startY = 350;

        manifest.levels.forEach((lv, i) => {
            const row = Math.floor(i / cols);
            const col = i % cols;
            const x = startX + col * (btnSize + gap);
            const y = startY + row * (btnSize + gap);

            const isCompleted = saveData.completedLevels.includes(lv.id);

            // Check if level is unlocked (first level or previous level completed)
            const isUnlocked = i === 0 || saveData.completedLevels.includes(manifest.levels[i - 1].id);

            // Use nine-slice for level button background
            const btn = this.add.nineslice(
                x, y,
                ASSET_KEYS.GAME_UI,
                'level-bg-square',
                btnSize, btnSize,
                32, 32, 32, 32
            );

            // Make interactive only if unlocked
            if (isUnlocked) {
                btn.setInteractive({ useHandCursor: true });
            } else {
                // Darken locked levels
                btn.setAlpha(0.4);
            }

            // Level number
            const levelNumber = new UIText(this, x, y - 20, `${i + 1}`, '42px', '#ffffff', '#000', 4, FONT_FAMILY).setOrigin(0.5);
            if (!isUnlocked) levelNumber.setAlpha(0.5);

            // Level name
            const levelName = new UIText(this, x, y + 30, lv.name, '18px', '#c7d7ff', '#000', 3, FONT_FAMILY).setOrigin(0.5);
            if (!isUnlocked) levelName.setAlpha(0.5);

            // Time info or lock icon
            if (isUnlocked) {
                new UIText(this, x, y + 55, `${lv.time ?? 120}s`, '16px', '#8aa7ff', '#000', 3, FONT_FAMILY).setOrigin(0.5);
            } else {
                // Lock icon
                new UIText(this, x, y + 55, '🔒', '32px', '#6b7280', '#000', 3, FONT_FAMILY).setOrigin(0.5);
            }

            // Completion checkmark
            if (isCompleted) {
                new UIText(this, x + btnSize / 2 - 30, y - btnSize / 2 + 30, '✓', '36px', '#4ade80', '#000', 4, FONT_FAMILY).setOrigin(0.5);
            }

            // Button interactions (only if unlocked)
            if (isUnlocked) {
                btn.on('pointerover', () => {
                    this.tweens.add({ targets: btn, scale: 1.05, duration: 100 });
                });
                btn.on('pointerout', () => {
                    this.tweens.add({ targets: btn, scale: 1, duration: 100 });
                });
                btn.on('pointerdown', () => {
                    this.tweens.add({
                        targets: btn,
                        scale: 0.95,
                        duration: 50,
                        yoyo: true,
                        onComplete: () => {
                            this.scene.start(SCENE_KEYS.GAME, { levelId: lv.id });
                        }
                    });
                });
            }
        });

        // Back button
        this.createBackButton(width, height);
    }

    private createBackButton(width: number, height: number) {
        const btnY = height - 150;
        new UIPrimaryButton(this, width / 2, btnY, 'BACK', () => {
            this.scene.start(SCENE_KEYS.MENU);
        }, 400, 80);
    }
}
