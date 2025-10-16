export type LevelData = { id: string; name: string; time?: number; gridSize: number; words: string[] };
export type Manifest = { levels: { id: string; name: string; file: string; time?: number }[] };

export class LevelManager {
    static getManifest(scene: Phaser.Scene): Manifest {
        return scene.cache.json.get('levels:manifest');
    }
    static getLevel(scene: Phaser.Scene, id: string): LevelData {
        return scene.cache.json.get(`level:${id}`);
    }
}
