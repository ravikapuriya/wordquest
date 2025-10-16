import Phaser from 'phaser';
import { ASSET_KEYS, FONT_FAMILY } from '../config';
import { UIText } from '@utils/UIText';

export class Tile extends Phaser.GameObjects.Container {
    r: number; c: number; char: string; bg: Phaser.GameObjects.Image; label: Phaser.GameObjects.Text;
    constructor(scene: Phaser.Scene, r: number, c: number, char: string, size = 96) {
        super(scene, 0, 0);
        this.r = r; this.c = c; this.char = char;
        this.bg = scene.add.sprite(0, 0, ASSET_KEYS.GAME_UI, 'blue-grid').setOrigin(0).setDisplaySize(size, size);
        this.label = new UIText(scene, size / 2, size / 2, char, `${Math.floor(size * 0.5)}px`, '#d9e3ff', '#000', 4, FONT_FAMILY).setOrigin(0.5);
        this.add([this.bg, this.label]);
        this.setSize(size, size);
        this.setInteractive(new Phaser.Geom.Rectangle(0, 0, size, size), Phaser.Geom.Rectangle.Contains);
    }
    pulse() { this.scene.tweens.add({ targets: this, scale: 1.06, duration: 110, yoyo: true, ease: 'sine.inOut' }); }
    markFound() { this.bg.setTexture(ASSET_KEYS.GAME_UI, 'green-grid'); this.label.setFill('#a2ffcf'); }
}
