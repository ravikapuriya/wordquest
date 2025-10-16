import { IS_BUILD } from './config';

export interface SaveData {
    coins: number;
    levelId: string;
    completedLevels: string[];
    currentScore: number;
    highScore: number;
    sfxEnabled: boolean;
    musicEnabled: boolean;
    lang: string;
}

const SAVE_KEYS: (keyof SaveData)[] = [
    'coins',
    'levelId',
    'completedLevels',
    'currentScore',
    'highScore',
    'sfxEnabled',
    'musicEnabled',
    'lang',
];

const DEFAULT_SAVE: SaveData = {
    coins: 0,
    levelId: 'level1',
    completedLevels: [],
    currentScore: 0,
    highScore: 0,
    sfxEnabled: true,
    musicEnabled: true,
    lang: 'en',
};

let cache: SaveData | null = null;
let pendingSave: Promise<SaveData> | null = null;

export const Save = {
    get: async function (): Promise<SaveData> {
        if (pendingSave) {
            return pendingSave;
        }

        if (cache) {
            return cache;
        }

        pendingSave = this.loadSave();
        try {
            const result = await pendingSave;
            cache = result;
            return result;
        } finally {
            pendingSave = null;
        }
    },

    async loadSave(): Promise<SaveData> {
        let loadedData: Partial<SaveData> = {};

        loadedData = await this.loadFromLocalStorage();

        return { ...DEFAULT_SAVE, ...loadedData };
    },

    async loadFromLocalStorage(): Promise<Partial<SaveData>> {
        const data: Partial<SaveData> = {};

        for (const key of SAVE_KEYS) {
            const value = localStorage.getItem(`wordsearch.${key}`);
            if (value !== null) {
                try {
                    data[key] = JSON.parse(value) as any;
                } catch (e) {
                    // If parsing fails, skip this key
                    console.warn(`Failed to parse storage key: ${key}`);
                }
            }
        }

        return data;
    },

    set: async function (data: Partial<SaveData>): Promise<void> {
        const current = await this.get();
        const newData = { ...current, ...data };

        cache = newData;

        this.saveToLocalStorage(newData);
    },

    saveToLocalStorage(data: SaveData): void {
        for (const key of SAVE_KEYS) {
            const value = data[key];
            if (value !== undefined) {
                localStorage.setItem(`wordsearch.${key}`, JSON.stringify(value));
            }
        }
    },

    clearCache: function (): void {
        cache = null;
    }
};
