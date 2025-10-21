import Phaser from 'phaser';
import { ASSET_KEYS, FONT_FAMILY, GAME_WIDTH, GAME_HEIGHT, SCENE_KEYS } from '../config';

export class PauseMenuPopup {
    private scene: Phaser.Scene;
    private container?: Phaser.GameObjects.Container;
    private dimBackground?: Phaser.GameObjects.Rectangle;
    private popupBody?: Phaser.GameObjects.NineSlice;
    private popupHeader?: Phaser.GameObjects.NineSlice;
    private onResume?: () => void;
    private onRestart?: () => void;
    private onHome?: () => void;

    private defaultScale = 0.8;
    private pressedScale = 0.7;

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
    }

    async show(callbacks: {
        onResume?: () => void;
        onRestart?: () => void;
        onHome?: () => void;
    } = {}): Promise<void> {
        if (this.container) {
            return;
        }

        console.log('Show pause menu popup');

        this.onResume = callbacks.onResume;
        this.onRestart = callbacks.onRestart;
        this.onHome = callbacks.onHome;

        const centerX = GAME_WIDTH / 2;
        const centerY = GAME_HEIGHT / 2;

        // Dim background - blocks all clicks to elements behind it
        this.dimBackground = this.scene.add.rectangle(
            centerX,
            centerY,
            GAME_WIDTH,
            GAME_HEIGHT,
            0x000000,
            0.7
        ).setDepth(10000).setInteractive();

        // Consume all pointer events on the dim background to prevent clicks from passing through
        this.dimBackground.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
            pointer.event.stopPropagation();
        });
        this.dimBackground.on('pointerup', (pointer: Phaser.Input.Pointer) => {
            pointer.event.stopPropagation();
        });
        this.dimBackground.on('pointermove', (pointer: Phaser.Input.Pointer) => {
            pointer.event.stopPropagation();
        });

        // Create container
        this.container = this.scene.add.container(centerX, centerY).setDepth(10001);
        this.container.setScale(0); // Start at 0 for bubble animation

        // Popup body
        this.popupBody = this.scene.add.nineslice(
            0, 0,
            ASSET_KEYS.GAME_UI,
            'popup-body',
            400, 500,
            96, 32, 96, 32
        );
        this.container.add(this.popupBody);

        // Popup header
        this.popupHeader = this.scene.add.nineslice(
            0, -200,
            ASSET_KEYS.GAME_UI,
            'popup-header',
            400, 128,
            96, 32, 96, 32
        );
        this.container.add(this.popupHeader);

        // Title text
        const titleText = this.scene.add.text(0, -200, 'PAUSED', {
            fontSize: '48px',
            fontFamily: FONT_FAMILY,
            color: '#e7f0ff',
            stroke: '#000',
            strokeThickness: 4,
            align: 'center'
        }).setOrigin(0.5);
        this.container.add(titleText);

        // Fade in dimBackground
        this.dimBackground.setAlpha(0);

        // Animate container in
        this.scene.tweens.add({
            targets: this.container,
            scale: 1,
            ease: 'Back.easeOut',
            duration: 300,
            easeParams: [1.7],
        });

        // Animate dimBackground in
        this.scene.tweens.add({
            targets: this.dimBackground,
            alpha: 1,
            duration: 300,
            ease: 'Cubic.easeOut'
        });

        // Create buttons
        const startX = 80;
        const startY = 30;

        // Restart button
        const restartBtn = this.scene.add.image(-startX, -startY, ASSET_KEYS.GAME_UI, 'blue-restart-button')
            .setInteractive({ useHandCursor: true }).setScale(this.defaultScale)
            .on('pointerdown', () => {
                restartBtn.setScale(this.pressedScale);
            })
            .on('pointerup', () => {
                restartBtn.setScale(this.defaultScale);
                this.hide();
                if (this.onRestart) {
                    this.onRestart();
                }
            });
        restartBtn.setOrigin(0.5);
        this.container.add(restartBtn);

        // Play button (resume)
        const playBtn = this.scene.add.image(startX, -startY, ASSET_KEYS.GAME_UI, 'blue-play-button')
            .setInteractive({ useHandCursor: true }).setScale(this.defaultScale)
            .on('pointerdown', () => {
                playBtn.setScale(this.pressedScale);
            })
            .on('pointerup', () => {
                playBtn.setScale(this.defaultScale);
                this.hide();
                if (this.onResume) {
                    this.onResume();
                }
            });
        playBtn.setOrigin(0.5);
        this.container.add(playBtn);

        // Home button
        const homeBtn = this.scene.add.image(-startX, startY + 90, ASSET_KEYS.GAME_UI, 'blue-home-button')
            .setInteractive({ useHandCursor: true }).setScale(this.defaultScale)
            .on('pointerdown', () => {
                homeBtn.setScale(this.pressedScale);
            })
            .on('pointerup', () => {
                homeBtn.setScale(this.defaultScale);
                this.hide();
                if (this.onHome) {
                    this.onHome();
                }
            });
        homeBtn.setOrigin(0.5);
        this.container.add(homeBtn);

        // Close button
        const closeBtn = this.scene.add.image(startX, startY + 90, ASSET_KEYS.GAME_UI, 'red-close-button')
            .setInteractive({ useHandCursor: true }).setScale(this.defaultScale)
            .on('pointerdown', () => {
                closeBtn.setScale(this.pressedScale);
            })
            .on('pointerup', () => {
                closeBtn.setScale(this.defaultScale);
                this.hide();
                if (this.onResume) {
                    this.onResume();
                }
            });
        closeBtn.setOrigin(0.5);
        this.container.add(closeBtn);
    }

    hide(): void {
        if (!this.container || !this.dimBackground) return;

        this.scene.tweens.killTweensOf(this.container);
        this.scene.tweens.killTweensOf(this.dimBackground);

        // Animate container out
        this.scene.tweens.add({
            targets: this.container,
            scale: 0,
            ease: 'Back.easeIn',
            duration: 200,
            easeParams: [1.7],
            onComplete: () => {
                if (this.container) {
                    this.container.destroy(true);
                    this.container = undefined;
                }
                this.popupBody = undefined;
                this.popupHeader = undefined;
            }
        });

        // Animate dimBackground out
        this.scene.tweens.add({
            targets: this.dimBackground,
            alpha: 0,
            duration: 200,
            ease: 'Cubic.easeIn',
            onComplete: () => {
                if (this.dimBackground) {
                    this.dimBackground.destroy();
                    this.dimBackground = undefined;
                }
            }
        });
    }

    isVisible(): boolean {
        return !!this.container;
    }
}
