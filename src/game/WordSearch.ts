
export type Direction = { dr: number; dc: number };
const DIRS: Direction[] = [
    { dr: 0, dc: 1 },  // right
    { dr: 0, dc: -1 }, // left
    { dr: 1, dc: 0 },  // down
    { dr: -1, dc: 0 }  // up
];

export class WordSearch {
    rows: number; cols: number; grid: string[][]; words: string[]; placed: string[] = [];
    constructor(rows: number, cols: number, words: string[]) {
        this.rows = rows; this.cols = cols; this.words = words.map(w => w.toUpperCase());
        this.grid = Array.from({ length: rows }, () => Array(cols).fill(''));
        this.placeWords();
        this.fillRandom();
    }
    private randInt(n: number) { return Math.floor(Math.random() * n); }
    private shuffle<T>(arr: T[]): T[] {
        const copy = [...arr];
        for (let i = copy.length - 1; i > 0; i--) {
            const j = this.randInt(i + 1);
            [copy[i], copy[j]] = [copy[j], copy[i]];
        }
        return copy;
    }
    private canPlace(word: string, r: number, c: number, d: Direction) {
        for (let i = 0; i < word.length; i++) {
            const rr = r + d.dr * i, cc = c + d.dc * i;
            if (rr < 0 || rr >= this.rows || cc < 0 || cc >= this.cols) return false;
            // No overlaps allowed, even if letters match
            if (this.grid[rr][cc]) return false;
        }
        return true;
    }
    private place(word: string, r: number, c: number, d: Direction) {
        for (let i = 0; i < word.length; i++) { const rr = r + d.dr * i, cc = c + d.dc * i; this.grid[rr][cc] = word[i]; }
    }
    private placeWords() {
        // Backtracking placement that guarantees all words are placed, with no overlaps
        // Place longer words first for better success
        const sorted = [...this.words].sort((a, b) => b.length - a.length);

        // Clear grid before placement
        this.grid = Array.from({ length: this.rows }, () => Array(this.cols).fill(''));
        this.placed = [];

        // Build list of all (row, col, dir) positions and shuffle them for randomness
        const allPositions: { r: number; c: number; d: Direction }[] = [];
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                for (const d of DIRS) {
                    allPositions.push({ r, c, d });
                }
            }
        }

        const tryPlace = (idx: number): boolean => {
            if (idx >= sorted.length) return true;
            const w = sorted[idx];

            // Shuffle positions so words are randomly distributed
            const shuffledPositions = this.shuffle(allPositions);

            for (const pos of shuffledPositions) {
                if (!this.canPlace(w, pos.r, pos.c, pos.d)) continue;
                // place
                const placedCells: { r: number; c: number }[] = [];
                for (let i = 0; i < w.length; i++) {
                    const rr = pos.r + pos.d.dr * i, cc = pos.c + pos.d.dc * i;
                    this.grid[rr][cc] = w[i];
                    placedCells.push({ r: rr, c: cc });
                }
                this.placed.push(w);

                if (tryPlace(idx + 1)) return true;

                // backtrack
                this.placed.pop();
                for (const cell of placedCells) this.grid[cell.r][cell.c] = '';
            }
            return false;
        };

        const success = tryPlace(0);
        if (!success) {
            // As a last resort, keep grid empty and rely on caller to handle (shouldn't happen with these levels)
            this.grid = Array.from({ length: this.rows }, () => Array(this.cols).fill(''));
            this.placed = [];
        } else {
            // Ensure original order for display
            this.placed = this.words.slice();
        }
    }
    private fillRandom() {
        const A = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        for (let r = 0; r < this.rows; r++) for (let c = 0; c < this.cols; c++) if (!this.grid[r][c]) this.grid[r][c] = A[this.randInt(A.length)];
    }
}
