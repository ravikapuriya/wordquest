import Phaser from 'phaser';
import { ATLAS_ASSETS, FONT_FAMILY, IMAGE_ASSETS, PRELOAD_BAR_OPTIONS, SCENE_KEYS } from '../config';
import { UIText } from '@utils/UIText';


export class LoadingScene extends Phaser.Scene {
    constructor() { super(SCENE_KEYS.LOADING); }

    init(): void {
        const barX: number = (this.game.config.width as number - PRELOAD_BAR_OPTIONS.size.width) / 2;
        const barY: number = (this.game.config.height as number - PRELOAD_BAR_OPTIONS.size.height) / 2;

        this.add.rectangle(barX, barY, PRELOAD_BAR_OPTIONS.size.width + 4, PRELOAD_BAR_OPTIONS.size.height + 4, PRELOAD_BAR_OPTIONS.color.container).setStrokeStyle(PRELOAD_BAR_OPTIONS.size.border, PRELOAD_BAR_OPTIONS.color.border).setOrigin(0);

        const bar: Phaser.GameObjects.Rectangle = this.add.rectangle(barX + 2, barY + 2, 1, PRELOAD_BAR_OPTIONS.size.height, PRELOAD_BAR_OPTIONS.color.fill);
        bar.setOrigin(0);

        const loadingText = this.add.text(this.game.config.width as number / 2, barY - 30, 'Loading...', {
            font: '24px BungeeRegular',
            color: '#a8b4ff'
        }).setOrigin(0.5);
        loadingText.setDepth(1);

        this.load.on('progress', (progress: number) => {
            bar.width = PRELOAD_BAR_OPTIONS.size.width * progress;
        });

        this.load.on('complete', () => {
            bar.destroy();
            loadingText.destroy();
        });
    }

    preload() {
        const { width, height } = this.scale;
        // const barBg = this.add.rectangle(width / 2, height / 2, 480, 20, 0x1f2433).setOrigin(0.5);
        // const bar = this.add.rectangle(width / 2 - 240, height / 2, 2, 12, 0x6ea8ff).setOrigin(0, 0.5);
        // new UIText(this, width / 2, height / 2 - 40, 'Loading...', '24px', '#a8b4ff', '#000', 4, FONT_FAMILY).setOrigin(0.5);

        // this.load.on('progress', (p: number) => { bar.width = 480 * p; });

        const allAssetUrls = import.meta.glob('/assets/**/*', {
            eager: true,
            query: '?url',
            import: 'default'
        }) as Record<string, string>;
        const toUrl = (path: string) => {
            const normalized = path.startsWith('/') ? path : `/${path}`;
            return allAssetUrls[normalized] ?? normalized;
        };

        for (const a of ATLAS_ASSETS) {
            this.load.atlas(a.assetKey, toUrl(a.path), toUrl(a.jsonPath));
        }

        for (const a of IMAGE_ASSETS) {
            this.load.image(a.assetKey, toUrl(a.path));
        }

        // Load level manifest
        this.load.setPath('levels');
        this.load.json('levels:manifest', 'manifest.json');

        // Generate runtime textures (no external art needed)
        const g = this.add.graphics();
        g.fillStyle(0x1a1f2b, 1); g.fillRoundedRect(0, 0, 96, 96, 16);
        g.lineStyle(3, 0x293145, 1); g.strokeRoundedRect(0, 0, 96, 96, 16);
        g.generateTexture('tile-bg', 100, 100); g.clear();

        g.fillStyle(0xffffff, 1); g.fillCircle(6, 6, 6); g.generateTexture('spark', 12, 12); g.clear();
        g.fillStyle(0x00e5ff, 1); g.fillCircle(5, 5, 5); g.generateTexture('dot', 10, 10); g.destroy();
    }

    create() {
        // After manifest is in cache, queue level JSONs, then jump to Menu
        const manifest = this.cache.json.get('levels:manifest') as { levels: { id: string, name: string, file: string, time?: number }[] };
        if (manifest?.levels?.length) {
            this.load.setPath('levels');
            for (const lv of manifest.levels) {
                this.load.json(`level:${lv.id}`, lv.file);
            }
            this.load.once('complete', () => {
                this.scene.launch(SCENE_KEYS.ANIMATED_BACKGROUND);
                this.scene.start(SCENE_KEYS.MENU)
            });
            this.load.start();
        } else {
            // Fallback: go to Menu with no levels
            this.scene.launch(SCENE_KEYS.ANIMATED_BACKGROUND);
            this.scene.start(SCENE_KEYS.MENU);
        }
    }
}
