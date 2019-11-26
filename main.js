class Block {
    constructor(x, y, value = 0) {
        this.x = x;
        this.y = y;
        this._value = value;
        this._enable = true;
        this.ele = document.createElement('div');
        this.ele.classList.add('block');
        this.ele.style.opacity = '.5';

        this.ele.addEventListener('touchstart', () => {
            if (this._enable)
                GAME.click(this.x, this.y);
        });

        this.ele.addEventListener('click', () => {
            if (this._enable)
                GAME.click(this.x, this.y);
        });
    }

    enable() {
        this.ele.style.opacity = '1';
        this._enable = true;
    }

    get value() {
        return this._value;
    }

    set value(val) {
        this._value = val;
        this.ele.innerText = val || '';
    }
}

class Game {
    constructor(options = {}) {
        this.options = options;
        this.game = document.createElement('div');
        this.game.classList.add('game');
        document.body.append(this.game);

        this.blocks = document.createElement('div');
        this.blocks.classList.add('blocks');

        this.buttons = document.createElement('div');
        this.buttons.classList.add('buttons');

        this.prevButton = document.createElement('button');
        this.nextButton = document.createElement('button');
        this.prevButton.innerText = 'Previous';
        this.nextButton.innerText = 'Next';
        this.prevButton.addEventListener('click', this.prevRecord.bind(this));
        this.nextButton.addEventListener('click', this.nextRecord.bind(this));

        this.game.append(this.blocks);
        this.buttons.append(this.prevButton);
        this.buttons.append(this.nextButton);
        this.game.append(this.buttons);

        this.start = () => {
            for (let i = 1; i <= this.count; i++) {
                let x = Math.floor(Math.random() * this.size);
                let y = Math.floor(Math.random() * this.size);
                this.updateBlockValue(x, y, 1);
            }

            for (let i = 0; i < this.size; i++) {
                for (let j = 0; j < this.size; j++) {
                    this.map[i][j].enable();
                }
            }

            this.putRecord(this.recordsIndex);
        }
    }

    async initialize(options = {}) {
        this.prevButton.setAttribute('disabled', true);
        this.nextButton.setAttribute('disabled', true);
        // this.size = options.size || this.options.size || 3;
        // this.count = Math.floor(Math.random() * (options.difficult || 3)) + 1;
        return Alert.prompt('Input Game Size: ', 3, {
            placeholder: 'Default Size = 3'
        }).then(size => {
            if (size < 2 || size > 10) {
                return Alert.showMessage('Size must be between 2 and 10.').then(() => {
                    return this.initialize(options);
                });
            }
            this.size = size;
            return Alert.prompt('Input Game Difficult: ', 3, {
                placeholder: 'Default Difficult = 3'
            }).then(difficult => {
                if (difficult < 1 || difficult > 10) {
                    return Alert.showMessage('Difficult must be between 1 and 10.').then(() => {
                        return this.initialize(options);
                    });
                }
                // this.count = Math.floor(Math.random() * difficult) + 1;
                this.count = difficult;
                this.records = [];
                this.recordsIndex = -1;
                this.createBlock();
            });
        });
    }

    createBlock() {
        this.blocks.innerHTML = '';
        this.map = [];

        for (let i = 1; i <= this.size; i++) {
            this.map.push([]);
        }

        for (let i = 0; i < this.size; i++) {
            let row = document.createElement('div');
            row.classList.add('row');
            for (let j = 0; j < this.size; j++) {
                let block = new Block(i, j);
                this.map[i].push(block);
                row.append(block.ele);
            }
            this.blocks.append(row);
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
            this.updateBlockValue(x, y, -1);
            this.putRecord(this.recordsIndex);
            if (this.records.length - 1 == this.count) {
                this.over();
            }

            this.nextButton.setAttribute('disabled', true);
        }
    }

    putRecord() {
        this.records[++this.recordsIndex] = this.map.map(x => x.map(y => y.value));
        if (this.recordsIndex > 0)
            this.prevButton.removeAttribute('disabled');
    }

    nextRecord() {
        let record = this.records[++this.recordsIndex];
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                this.map[i][j].value = record[i][j];
            }
        }

        if (this.recordsIndex == this.records.length - 1)
            this.nextButton.setAttribute('disabled', true);

        this.prevButton.removeAttribute('disabled');
    }

    prevRecord() {
        let record = this.records[--this.recordsIndex];
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                this.map[i][j].value = record[i][j];
            }
        }

        if (this.recordsIndex == 0)
            this.prevButton.setAttribute('disabled', true);

        this.nextButton.removeAttribute('disabled');
    }

    over() {
        Alert.showMessage('Finish!').then(() => {
            this.initialize().then(this.start);
        })
    }
}

const GAME = new Game();
GAME.initialize().then(GAME.start);