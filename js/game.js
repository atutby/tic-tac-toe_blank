export default class Game {
    constructor(board, gameInfo, restartButton) {
        this.board = board;
        this.gameInfo = gameInfo;
        this.restartButton = restartButton;
        this.xIsNext = null;
        this.squares = null;
        this.boardHandler = null;
        this.resetHandler = null;
        this.isGameFinished = null;

        this.winnerMatrix = [
            [[0, 0], [0, 1], [0, 2]],
            [[1, 0], [1, 1], [1, 2]],
            [[2, 0], [2, 1], [2, 2]],
            [[0, 0], [1, 0], [2, 0]],
            [[0, 1], [1, 1], [2, 1]],
            [[0, 2], [1, 2], [2, 2]],
            [[0, 0], [1, 1], [2, 2]],
            [[0, 2], [1, 1], [2, 0]],
        ];
        this.initListeners();
        this.startNewGame();
    }

    initListeners() {
        this.boardHandler = ({ target: button }) => {
            let index = button.getAttribute('data-index');
            let [row, column] = index.split(':');

            if (this.squares[row][column] || this.isGameFinished === true) return;
            this.squares[row][column] = this.xIsNext
                ? 'X'
                : 'O';

            this.xIsNext = !this.xIsNext;
            this.renderPressedSquare(row, column);
            this.renderGameInfo();
            this.checkWinner();
        };

        this.resetHandler = () => {
            this.startNewGame();
        };
        this.board.addEventListener('click', this.boardHandler);
        this.restartButton.addEventListener('click', this.resetHandler);
    }


    startNewGame() {
        this.squares = [
            Array(3).fill(null),
            Array(3).fill(null),
            Array(3).fill(null),
        ];
        this.xIsNext = true;
        this.isGameFinished = false;
        this.initAllSquares();
        this.renderGameInfo();
    }


    initAllSquares() {
        [...this.board.children].forEach(boardRow => {
            [...boardRow.children].forEach(button => {
                button.innerText = null;
            })
        });
    }


    renderGameInfo() {
        this.gameInfo.innerText = this.xIsNext
            ? 'Next player: X'
            : 'Next player: O';
    }


    renderPressedSquare(row, column) {
        let pressedSquare = document.querySelector(`[data-index='${row}:${column}']`);
        pressedSquare.innerText = this.squares[row][column];
    }

    checkWinner() {
        let winner = this.calculateWinner();
        if (winner) {
            this.renderWinner(winner);
            this.isGameFinished = true;
        }
    }


    calculateWinner() {
        for (let winningCombination of this.winnerMatrix) {
            let valueList = [];
            for (let [y, x] of winningCombination) {
                valueList.push(this.squares[y][x]);
            }

            if (valueList.every(value => value === 'X')) {
                return 1;
            } else if (valueList.every(value => value === 'O')) {
                return 2;
            }
        }

        if (this.squares.flat().every(sq => sq === true)) {
            return 3;
        }
    }


    renderWinner(winner) {
        switch (winner) {
            case 1:
                this.gameInfo.innerText = 'Winner: X';
                break;
            case 2:
                this.gameInfo.innerText = 'Winner: O';
                break;
            case 3:
                this.gameInfo.innerText = 'Nobody\'s';
        }
    }
}