import Phaser from 'phaser';
import { ASSET_KEYS, FONT_FAMILY } from '../config';
import { UIText } from './UIText';

export class UIPrimaryButton extends Phaser.GameObjects.Container {
    private btn: Phaser.GameObjects.NineSlice;
    private label: UIText;

    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        text: string,
        callback: () => void,
        width: number = 500,
        height: number = 100
    ) {
        super(scene, x, y);

        // Create nine-slice button background
        this.btn = scene.add.nineslice(
            0, 0,
            ASSET_KEYS.GAME_UI,
            'blue-button-normal',
            width, height,
            96, 32, 96, 32
        ).setInteractive({ useHandCursor: true });

        // Create text label
        this.label = new UIText(scene, 0, 0, text, '32px', '#ffffff', '#000', 4, FONT_FAMILY).setOrigin(0.5);

        // Add to container
        this.add([this.btn, this.label]);

        // Button interactions
        this.btn.on('pointerover', () => {
            scene.tweens.add({ targets: this, scale: 1.05, duration: 100 });
        });

        this.btn.on('pointerout', () => {
            scene.tweens.add({ targets: this, scale: 1, duration: 100 });
        });

        this.btn.on('pointerdown', () => {
            this.btn.setFrame('blue-button-press');
        });

        this.btn.on('pointerup', () => {
            this.btn.setFrame('blue-button-normal');
            callback();
        });

        // Add to scene
        scene.add.existing(this);
    }

    public setText(text: string): this {
        this.label.setText(text);
        return this;
    }

    public setEnabled(enabled: boolean): this {
        this.btn.setInteractive(enabled);
        this.setAlpha(enabled ? 1 : 0.5);
        return this;
    }
}
