class Block {
    constructor(value = 0) {
        this.value = value;
    }
}

class Game {
    constructor(options = {}) {
        this.options = options;
    }

    async initialize(options = {}) {
        this.size = options.size || this.options.size || 3;
        this.count = Math.floor(Math.random() * (options.count || 3)) + 1;
        this.records = [];
        this.createBlock();

        this.debug();
    }

    createBlock() {
        this.map = [];

        for (let i = 1; i <= this.size; i++) {
            this.map.push([]);
        }

        for (let i = 1; i <= this.size; i++) {
            for (let j = 1; j <= this.size; j++) {
                this.map[i - 1].push(new Block());
            }
        }

        for (let i = 1; i <= this.count; i++) {
            let x = Math.floor(Math.random() * this.size);
            let y = Math.floor(Math.random() * this.size);
            console.log(x, y);
            this.updateBlockValue(x, y, 1);
        }
    }

    updateBlockValue(x, y, offsetX) {
        for (let i = 0; i < this.size; i++) {
            this.map[x][i].value += offsetX;
            if (x != i)
                this.map[i][y].value += offsetX;

        }
    }

    checkPathNotEmpty(x, y) {
        for (let i = 0; i < this.size; i++) {
            if (this.map[x][i].value <= 0 || this.map[i][y].value <= 0)
                return false;
        }

        return true;
    }

    click(x, y) {
        if (this.checkPathNotEmpty(x, y)) {
            this.pushRecord()
            this.updateBlockValue(x, y, -1);
            if (this.records.length == this.count) {
                this.over();
            }
        }
    }

    pushRecord() {
        this.records.push(this.map.map(x => x.map(y => y.value)));
    }

    rollbackRecord() {
        if (this.records.length > 0) {
            let record = this.records.pop();
            for (let i = 0; i < this.size; i++) {
                for (let j = 0; j < this.size; j++) {
                    this.map[i][j].value = record[i][j];
                }
            }
        }
    }

    start() {
        console.log('start');
    }

    over() {
        console.log('over');
    }

    debug() {
        console.table(this.map.map(m => m.map(b => b.value)));

        this.click = (() => {
            let func = this.click;
            return (x, y) => {
                func.call(this, x, y);
                console.table(this.map.map(m => m.map(b => b.value)));
            };
        })();
    }
}

const GAME = new Game();
GAME.initialize().then(GAME.start);