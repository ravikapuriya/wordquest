export const IS_BUILD = import.meta.env.MODE === 'production';
export const GAME_WIDTH = 1080;
export const GAME_HEIGHT = 1920;
export const TILE_SIZE = 80;
export const HEADER_Y_OFFSET = 80;
export const DEFAULT_TIMER_SECONDS = 120; // per level, can be overridden

export const SCENE_KEYS = Object.freeze({
    ANIMATED_BACKGROUND: 'AnimatedBackground',
    LOADING: 'Loading',
    MENU: 'Menu',
    LEVEL_SELECT: 'LevelSelect',
    GAME: 'Game',
    GAME_OVER: 'GameOver',
});

export const FONT_FAMILY = 'BungeeRegular';

export const PRELOAD_BAR_OPTIONS = {
    size: {
        width: 200,
        height: 20,
        border: 3,
    },
    color: {
        fill: 0x6ea8ff,
        container: 0x1f2433,
        border: 0x293145
    },
};

export const ASSET_KEYS = Object.freeze({
    // UI
    GAME_BG: 'GAME_BG',
    LOGO: 'LOGO',

    // ATLAS
    GAME_UI: 'GAME_UI',
    CONFETTI: 'CONFETTI',

    // AUDIO
    GAME_MUSIC_LOOP: 'GAME_MUSIC_LOOP',
    SFX_BTN_CLICK: 'SFX_BTN_CLICK',
    SFX_CORRECT_ANSWER: 'SFX_CORRECT_ANSWER',
    SFX_WRONG_ANSWER: 'SFX_WRONG_ANSWER',
    SFX_TIME_WARNING: 'SFX_TIME_WARNING',
});

export const ATLAS_ASSETS = [
    {
        assetKey: ASSET_KEYS.GAME_UI,
        path: 'assets/atlas/game-ui.png',
        jsonPath: 'assets/atlas/game-ui.json'
    },
    {
        assetKey: ASSET_KEYS.CONFETTI,
        path: 'assets/atlas/confetti.png',
        jsonPath: 'assets/atlas/confetti.json'
    }
];

export const IMAGE_ASSETS = [
    {
        assetKey: ASSET_KEYS.LOGO,
        path: 'assets/images/wordquest-logo.png'
    },
];
