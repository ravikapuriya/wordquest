import Phaser from 'phaser';
import { SCENE_KEYS } from '../config';

export class AnimatedBackground extends Phaser.Scene {
    constructor() { super(SCENE_KEYS.ANIMATED_BACKGROUND); }
    private stars: Phaser.GameObjects.Rectangle[] = [];

    create() {
        const width = this.scale.width;
        const height = this.scale.height;

        const rt = this.add.renderTexture(0, 0, width, height).setOrigin(0);
        const g = this.add.graphics();
        const top = 0x0b1020;
        const bottom = 0x101a40;
        for (let y = 0; y < height; y++) {
            const t = y / height;
            const r = Phaser.Math.Linear((top >> 16) & 0xff, (bottom >> 16) & 0xff, t) | 0;
            const gch = Phaser.Math.Linear((top >> 8) & 0xff, (bottom >> 8) & 0xff, t) | 0;
            const b = Phaser.Math.Linear(top & 0xff, bottom & 0xff, t) | 0;
            const color = (r << 16) | (gch << 8) | b;
            g.fillStyle(color, 1);
            g.fillRect(0, y, width, 1);
        }
        rt.draw(g);
        g.destroy();

        const starCount = 80;
        for (let i = 0; i < starCount; i++) {
            const x = Phaser.Math.Between(0, width);
            const y = Phaser.Math.Between(0, height);
            const size = Phaser.Math.FloatBetween(1, 2.5);
            const star = this.add.rectangle(x, y, size, size, 0x66f2ff).setAlpha(Phaser.Math.FloatBetween(0.2, 0.9));
            (star as any).speed = Phaser.Math.FloatBetween(0.2, 0.8);
            this.stars.push(star);
        }

        this.tweens.addCounter({
            from: 0,
            to: 100,
            duration: 1800,
            yoyo: true,
            repeat: -1,
            onUpdate: (tw) => {
                const prog = (tw as any).getValue ? (tw as any).getValue() : 0;
                const a = Phaser.Math.Linear(0.35, 0.7, (prog ?? 0) / 100);
                const cam = this.cameras && this.cameras.main ? this.cameras.main : null;
                if (cam) cam.setAlpha(a);
            }
        });
    }

    update(time: number, delta: number) {
        const height = this.scale.height;
        const width = this.scale.width;
        for (const s of this.stars) {
            const speed = (s as any).speed as number;
            s.y += speed * (delta / 16.6667);
            if (s.y > height + 4) {
                s.y = -4;
                s.x = Phaser.Math.Between(0, width);
                s.alpha = Phaser.Math.FloatBetween(0.2, 0.9);
            }
        }
    }
}
