import Phaser from 'phaser';
import { FONT_FAMILY } from '../config';
import { UIText } from '@utils/UIText';

export class UIPanel extends Phaser.GameObjects.Container {
    scoreText: UIText;
    levelNameText: UIText;
    levelNumberText: UIText;
    timerText: UIText;
    timerBarBg: Phaser.GameObjects.Graphics;
    timerBarFill: Phaser.GameObjects.Graphics;
    timerContainer: Phaser.GameObjects.Container;
    wordsContainer: Phaser.GameObjects.Container;
    wordTexts: Map<string, UIText> = new Map();
    gameWidth: number;
    gameHeight: number;
    maxTime: number = 180;
    currentTime: number = 180;
    timerBarWidth: number = 500;
    timerBarHeight: number = 25;

    constructor(scene: Phaser.Scene, width: number, height: number) {
        super(scene, 0, 0);
        this.gameWidth = width;
        this.gameHeight = height;

        // Score text (centered)
        this.scoreText = new UIText(scene, 20, 100, 'Score: 0', '48px', '#e7f0ff', '#000', 4, FONT_FAMILY).setOrigin(0, 0.5);

        // level name text
        this.levelNameText = new UIText(scene, width / 2, 80, 'Level 1', '32px', '#9cb6ff', '#000', 3, FONT_FAMILY).setOrigin(0.5, 0.5);

        // level number text
        this.levelNumberText = new UIText(scene, width / 2, 120, '1', '32px', '#9cb6ff', '#000', 3, FONT_FAMILY).setOrigin(0.5, 0.5);

        // Timer container (centered below score)
        this.timerContainer = scene.add.container(width / 2, 380);

        // Timer text
        this.timerText = new UIText(scene, 0, -40, 'Time Left: 180s', '28px', '#ffd1a8', '#000', 3, FONT_FAMILY).setOrigin(0.5);

        // Timer bar background
        this.timerBarBg = scene.add.graphics();
        this.timerBarBg.fillStyle(0x1a1f2b, 1);
        this.timerBarBg.fillRoundedRect(-this.timerBarWidth / 2, -this.timerBarHeight / 2, this.timerBarWidth, this.timerBarHeight, 10);
        this.timerBarBg.lineStyle(2, 0x293145, 1);
        this.timerBarBg.strokeRoundedRect(-this.timerBarWidth / 2, -this.timerBarHeight / 2, this.timerBarWidth, this.timerBarHeight, 10);

        // Timer bar fill
        this.timerBarFill = scene.add.graphics();

        this.timerContainer.add([this.timerText, this.timerBarBg, this.timerBarFill]);

        this.wordsContainer = scene.add.container(this.gameWidth / 2, this.gameHeight - 200);

        this.add([this.scoreText, this.levelNameText, this.levelNumberText, this.timerContainer, this.wordsContainer]);
    }

    setScore(n: number) { this.scoreText.setText(`Score: ${n}`); }

    setLevelName(name: string) { this.levelNameText.setText(name); }

    setLevelNumber(n: string) { this.levelNumberText.setText(n); }

    setTime(s: number, maxTime?: number) {
        if (maxTime !== undefined) {
            this.maxTime = maxTime;
        }
        this.currentTime = s;
        this.timerText.setText(`Time Left: ${s}s`);

        // Allow time to go over maxTime (when bonus time is added)
        // But cap the bar at 100%
        const percentage = Math.max(0, Math.min(1, s / this.maxTime));
        const fillWidth = this.timerBarWidth * percentage;

        // Choose color based on time left percentage
        let color = 0x4ade80; // Green
        if (percentage < 0.1) {
            color = 0xff6b6b; // Red
        } else if (percentage < 0.5) {
            color = 0xffe66d; // Yellow
        }

        // Redraw fill
        this.timerBarFill.clear();
        this.timerBarFill.fillStyle(color, 1);
        this.timerBarFill.fillRoundedRect(-this.timerBarWidth / 2, -this.timerBarHeight / 2, fillWidth, this.timerBarHeight, 10);
    }

    setWordsList(words: string[], foundWords: Set<string>) {
        // Clear existing texts
        this.wordsContainer.removeAll(true);
        this.wordTexts.clear();

        const gap = 20;
        const lineHeight = 40;
        const maxWidth = this.gameWidth - 100; // Leave 50px padding on each side

        const lines: { words: string[], width: number }[] = [];
        let currentLine: string[] = [];
        let currentLineWidth = 0;

        // Build lines by checking if words fit
        words.forEach((word, i) => {
            const isFound = foundWords.has(word);

            // Create temporary text to measure width
            const tempText = new UIText(this.scene, 0, 0, word, '28px', isFound ? '#4ade80' : '#8aa7ff', '#000', 4, FONT_FAMILY);
            const wordWidth = tempText.width;
            tempText.destroy();

            const widthWithGap = currentLineWidth + wordWidth + (currentLine.length > 0 ? gap : 0);

            if (widthWithGap <= maxWidth || currentLine.length === 0) {
                // Fits in current line
                currentLine.push(word);
                currentLineWidth = widthWithGap;
            } else {
                // Start new line
                lines.push({ words: [...currentLine], width: currentLineWidth });
                currentLine = [word];
                currentLineWidth = wordWidth;
            }
        });

        // Add last line
        if (currentLine.length > 0) {
            lines.push({ words: [...currentLine], width: currentLineWidth });
        }

        // Create text elements for each line
        lines.forEach((line, lineIndex) => {
            let xOffset = -line.width / 2; // Start from negative half width for centering
            const yOffset = lineIndex * lineHeight;

            line.words.forEach(word => {
                const isFound = foundWords.has(word);

                const wordText = new UIText(
                    this.scene,
                    xOffset,
                    yOffset,
                    word,
                    '28px',
                    isFound ? '#4ade80' : '#8aa7ff',
                    '#000',
                    4,
                    FONT_FAMILY
                );

                // Add strikethrough for found words
                if (isFound) {
                    const strikethrough = this.scene.add.graphics();
                    strikethrough.lineStyle(2, 0x4ade80, 1);
                    const textWidth = wordText.width;
                    strikethrough.strokeLineShape(
                        new Phaser.Geom.Line(xOffset, yOffset + wordText.height / 2, xOffset + textWidth, yOffset + wordText.height / 2)
                    );
                    this.wordsContainer.add(strikethrough);
                }

                this.wordsContainer.add(wordText);
                this.wordTexts.set(word, wordText);

                xOffset += wordText.width + gap;
            });
        });

        // Position container - adjust y based on number of lines
        const totalHeight = lines.length * lineHeight;
        this.wordsContainer.setPosition(this.gameWidth / 2, this.gameHeight - 200 - totalHeight / 2);
    }
}
