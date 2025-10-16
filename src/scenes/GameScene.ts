import Phaser from 'phaser';
import { ASSET_KEYS, TILE_SIZE, HEADER_Y_OFFSET, DEFAULT_TIMER_SECONDS, SCENE_KEYS } from '../config';
import { WordSearch } from '@game/WordSearch';
import { LevelManager } from '@game/LevelManager';
import { UIPanel } from '@game/UI';
import { Vec2, isAdjacent, containsCell } from '@utils/geometry';
import { Tile } from '@objects/Tile';
import { Save } from '../Storage';

export class GameScene extends Phaser.Scene {
    constructor() { super(SCENE_KEYS.GAME); }

    tileSize = TILE_SIZE;
    ws!: WordSearch; tiles: Tile[][] = [];
    dragPath: Vec2[] = []; dragging = false; pathG!: Phaser.GameObjects.Graphics; emitter!: Phaser.GameObjects.Particles.ParticleEmitter;
    foundWords = new Set<string>();
    score = 0; timeLeft = DEFAULT_TIMER_SECONDS; levelId = 'level1';

    create(data: { levelId: string }) {
        // Reset state when restarting the Scene (same instance is reused)
        this.input.removeAllListeners();
        this.time.removeAllEvents();
        if (this.pathG) { this.pathG.destroy(); }
        this.foundWords = new Set<string>();
        this.score = 0;
        this.dragPath = [];
        this.dragging = false;

        this.levelId = data?.levelId ?? 'level1';
        const level = LevelManager.getLevel(this, this.levelId);
        const totalW = level.gridSize * this.tileSize; const totalH = level.gridSize * this.tileSize;
        const originX = Math.floor((this.scale.width - totalW) / 2);
        const originY = Math.floor((this.scale.height - totalH) / 2);

        this.ws = new WordSearch(level.gridSize, level.gridSize, level.words);

        // UI
        const ui = new UIPanel(this, this.scale.width, this.scale.height);
        this.add.existing(ui);
        ui.setWordsList(this.ws.placed, this.foundWords);
        this.timeLeft = level.time ?? DEFAULT_TIMER_SECONDS;
        ui.setTime(this.timeLeft, this.timeLeft); // Pass maxTime on initialization
        ui.setScore(0);
        ui.setLevelName(level.name);
        ui.setLevelNumber(`Level ${Number(this.levelId.replace('level', ''))}`);

        // Grid
        for (let r = 0; r < level.gridSize; r++) {
            this.tiles[r] = [];
            for (let c = 0; c < level.gridSize; c++) {
                const t = new Tile(this, r, c, this.ws.grid[r][c], this.tileSize).setPosition(originX + c * this.tileSize, originY + r * this.tileSize);
                this.add.existing(t); this.tiles[r][c] = t;
            }
        }

        // Trail & particles
        this.pathG = this.add.graphics();
        this.emitter = this.add.particles(0, 0, 'spark', { speed: { min: 10, max: 30 }, lifespan: 300, alpha: { start: 0.9, end: 0 }, scale: { start: 0.9, end: 0 }, quantity: 1, blendMode: 'ADD', emitting: false });

        // Timer
        this.time.addEvent({
            delay: 1000, loop: true, callback: () => {
                this.timeLeft--; ui.setTime(this.timeLeft);
                if (this.timeLeft <= 0) {
                    setTimeout(() => {
                        this.endLevel(false);
                    }, 1000);
                }
            }
        });

        // Input
        this.input.on('pointerdown', (p: Phaser.Input.Pointer) => {
            const cell = this.pickCell(p.x, p.y, originX, originY, level.gridSize);
            if (!cell) return; this.dragging = true; this.dragPath = [cell]; this.redrawPath(originX, originY); this.tiles[cell.r][cell.c].pulse(); this.emitter.start(); this.emitter.emitParticleAt(p.x, p.y);
        });

        this.input.on('pointermove', (p: Phaser.Input.Pointer) => {
            if (!this.dragging || !p.isDown) return; const cell = this.pickCell(p.x, p.y, originX, originY, level.gridSize); if (!cell) return;
            const last = this.dragPath[this.dragPath.length - 1]; if (last && cell.r === last.r && cell.c === last.c) return;
            if (this.dragPath.length >= 2) { const prev = this.dragPath[this.dragPath.length - 2]; if (prev && cell.r === prev.r && cell.c === prev.c) { this.dragPath.pop(); this.redrawPath(originX, originY); this.emitter.emitParticleAt(p.x, p.y); return; } }
            if (isAdjacent(last, cell) && !containsCell(this.dragPath, cell)) { this.dragPath.push(cell); this.redrawPath(originX, originY); this.tiles[cell.r][cell.c].pulse(); this.emitter.emitParticleAt(p.x, p.y); }
        });

        this.input.on('pointerup', () => {
            if (!this.dragging) return; this.dragging = false; this.emitter.stop();
            const word = this.pathWord(); const rev = [...word].reverse().join('');
            const match = this.ws.placed.includes(word) ? word : (this.ws.placed.includes(rev) ? rev : '');
            if (match) {
                this.onWordFound(match, originX, originY);
                ui.setScore(this.score);
                ui.setTime(this.timeLeft); // Update time bar when bonus time is added
                // Always recompute words list from fresh WordSearch, no stale ticks
                ui.setWordsList(this.ws.placed, this.foundWords);
                if (this.ws.placed.every(w => this.foundWords.has(w))) {
                    setTimeout(() => {
                        this.endLevel(true);
                    }, 1000);
                }
            } else { this.cameras.main.shake(100, 0.002); }
            this.dragPath = [];
            this.redrawPath(originX, originY);
        });
    }

    pickCell(x: number, y: number, originX: number, originY: number, gridSize: number) {
        const c = Math.floor((x - originX) / this.tileSize); const r = Math.floor((y - originY) / this.tileSize);
        if (r < 0 || c < 0 || r >= gridSize || c >= gridSize) return null; return { r, c };
    }

    pathWord() { return this.dragPath.map(v => this.ws.grid[v.r][v.c]).join(''); }

    redrawPath(originX: number, originY: number) {
        this.pathG.clear(); if (this.dragPath.length <= 0) return; this.pathG.lineStyle(10, 0x00e5ff, 0.65);
        const pts = this.dragPath.map(v => new Phaser.Math.Vector2(originX + v.c * this.tileSize + this.tileSize / 2, originY + v.r * this.tileSize + this.tileSize / 2));
        this.pathG.beginPath(); this.pathG.moveTo(pts[0].x, pts[0].y); for (let i = 1; i < pts.length; i++) this.pathG.lineTo(pts[i].x, pts[i].y); this.pathG.strokePath();
    }

    onWordFound(word: string, originX: number, originY: number) {
        if (this.foundWords.has(word)) return; this.foundWords.add(word);
        // score: 10 per letter + small time bonus
        this.score += 10 * word.length; this.timeLeft += Math.min(3, Math.floor(word.length / 3));
        for (const v of this.dragPath) { this.tiles[v.r][v.c].markFound(); }

        // Calculate centroid for confetti spawn
        const centroid = this.dragPath.reduce((acc, v) => {
            acc.x += originX + v.c * this.tileSize + this.tileSize / 2;
            acc.y += originY + v.r * this.tileSize + this.tileSize / 2;
            return acc;
        }, { x: 0, y: 0 });
        centroid.x /= this.dragPath.length;
        centroid.y /= this.dragPath.length;

        // Confetti animation
        this.playConfetti(centroid.x, centroid.y);
    }

    private playConfetti(x: number, y: number) {
        // Use confetti atlas if available
        const frames = this.textures.get(ASSET_KEYS.CONFETTI).getFrameNames();

        const emitter = this.add.particles(x, y, ASSET_KEYS.CONFETTI, {
            frame: frames,
            speed: { min: 150, max: 350 },
            angle: { min: 0, max: 360 },
            lifespan: 1200,
            quantity: 40,
            scale: { start: 0.8, end: 0.2 },
            alpha: { start: 1, end: 0 },
            rotate: { min: 0, max: 360 },
            gravityY: 500,
            emitting: false
        });

        // Emit once and destroy after particles are gone
        emitter.explode();
        this.time.delayedCall(1200, () => emitter.destroy());
    }

    async endLevel(win: boolean) {
        const total = this.ws.placed.length; const found = [...this.foundWords].length;

        // Save progress
        const saveData = await Save.get();

        // Update current score
        await Save.set({ currentScore: this.score, levelId: this.levelId });

        // If level completed, add to completed levels
        if (win && !saveData.completedLevels.includes(this.levelId)) {
            await Save.set({
                completedLevels: [...saveData.completedLevels, this.levelId]
            });
        }

        // Update high score if this is better
        if (this.score > saveData.highScore) {
            await Save.set({ highScore: this.score });
        }

        this.scene.start(SCENE_KEYS.GAME_OVER, { score: this.score, found, total, levelId: this.levelId, win });
    }
}
