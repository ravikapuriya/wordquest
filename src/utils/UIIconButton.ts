import Phaser from 'phaser';
import { ASSET_KEYS } from '../config';

export class UIIconButton extends Phaser.GameObjects.Container {
    private btn: Phaser.GameObjects.NineSlice;
    private icon?: Phaser.GameObjects.Image | Phaser.GameObjects.Sprite;

    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        callback: () => void,
        iconKey?: string,
        iconFrame?: string | number,
        size: number = 100
    ) {
        super(scene, x, y);

        // Create nine-slice button background (square)
        this.btn = scene.add.nineslice(
            0, 0,
            ASSET_KEYS.GAME_UI,
            'level-bg-square',
            size, size,
            32, 32, 32, 32
        ).setInteractive({ useHandCursor: true });

        // Add to container
        this.add(this.btn);

        // Add icon if provided
        if (iconKey) {
            if (iconFrame !== undefined) {
                this.icon = scene.add.image(0, 0, iconKey, iconFrame);
            } else {
                this.icon = scene.add.image(0, 0, iconKey);
            }
            this.icon.setOrigin(0.5);
            this.add(this.icon);
        }

        // Button interactions
        this.btn.on('pointerover', () => {
            scene.tweens.add({ targets: this, scale: 1.1, duration: 100 });
        });

        this.btn.on('pointerout', () => {
            scene.tweens.add({ targets: this, scale: 1, duration: 100 });
        });

        this.btn.on('pointerdown', () => {
            scene.tweens.add({
                targets: this,
                scale: 0.9,
                duration: 50,
                yoyo: true,
                onComplete: callback
            });
        });

        // Add to scene
        scene.add.existing(this);
    }

    public setIcon(iconKey: string, iconFrame?: string | number): this {
        // Remove old icon if exists
        if (this.icon) {
            this.icon.destroy();
        }

        // Create new icon
        if (iconFrame !== undefined) {
            this.icon = this.scene.add.image(0, 0, iconKey, iconFrame);
        } else {
            this.icon = this.scene.add.image(0, 0, iconKey);
        }
        this.icon.setOrigin(0.5);
        this.add(this.icon);

        return this;
    }

    public setEnabled(enabled: boolean): this {
        this.btn.setInteractive(enabled);
        this.setAlpha(enabled ? 1 : 0.5);
        return this;
    }

    public setButtonFrame(frame: string): this {
        this.btn.setFrame(frame);
        return this;
    }
}
