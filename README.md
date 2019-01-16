# tic-tac-toe_blank

для запуска приложения необходимо выполнить
$ npm install
$ npm start

урок из
https://youtu.be/1oalI49s7GI?t=2103

https://paper.dropbox.com/doc/l3e05jiLzaerEVwihBUKe

Ссылка на заготовку
https://www.jsexpert.net/wp-content/uploads/2018/12/tic-tac-toe_blank.zip



Приложение “крестики-нолики” (мастер-класс)


Прежде всего, для запуска проекта необходимо установить зависимости, которые представляют собой современный сборщик веб-приложений Parcel. Для этого необходимо открыть в командной строке заготовку приложения и выполнить команды  `npm install`. 

Для успешного выполнения данной команды в системе должен быть установлен node.js и пакетный менеджер npm, который станет доступным в системе после установки node.js. Более детально о пакетном менеджере npm можете узнать на нашем бесплатном курсе “ИНСТРУМЕНТЫ РАЗРАБОТЧИКА”.

После установки зависимостей выполните команду  `npm start`. Эта команда запустит сервер разработки с приложением, который можно будет открыть по адресу http://localhost:8000.

В процессе работы над заготовкой, когда вы будете вносить изменения и эти изменения будут сохранены, запущенный сервер автоматически применит эти изменения и перезагрузит  страницу в браузере. 

Посмотрим структуру заготовки.
Файл index.html, с разметкой приложения. 
В файлах main.css и vendor.css, которые находится в папке “css”, стили приложения.
В index.html уже подключен CSS-фреймворк Bulma. Данный CSS-фреймворк  стал очень популярным в последнее время, так как по умолчанию поддерживает адаптивную сетку с помощью технологии flexbox и имеет очень интуитивно понятные названия классов. 

Запуск приложения происходит в файле index.js. 
На первой строке импортируется класс игры “крестики-нолики”, который и предстоит реализовать.
С 3-й по 5-ю строки создаются необходимые константы. 
В константе `gameInfo` будет храниться элемент, в который будет выводиться информация об игре.
В константе `board` сохраняется элемент, который представляет собой “игровую поверхность”, а именно 9 кнопок (по 3 в ряд), нажатие на которые буде соответствовать игровому ходу.
В константе `restartButton` будет элемент кнопки, с помощью которой можно начать игру с начала.
На 7-й строчке файла index.js создаем, с помощью ключевого слова `new`, экземпляр класса игры “крестики-нолики”, в конструктор которого будем передавать необходимые DOM-элементы страницы приложения. 

Приступим к написанию класса игры “крестики-нолики” в файле game.js. Для написания будем использовать синтаксис ES6.

Создадим для начала сам класс и экспортируем его:

    export default class Game {
    
    }

Экспорт необходим для возможности импорта данного класса в  основном скрипте приложения.

Далее определим внутри класса его конструктор, в котором определим несколько полей класса:

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
    }

В полях `this.board`, `this.gameInfo`, `this.restartButton` будем хранить переданные в конструктор DOM-элементы.

В поле `this.xIsNext` определим “переключатель”, который будет определять какой игрок должен совершать ход. Если значение поля рано `true`, то делает ход игрок. который ходит “крестиками”, если `false` - “ноликами”. Это поле так же будет полезным для вывода актуальной игровой информации внутри поля `this.gameInfo`.  Для начала инициализируем его пустым значением `null`.

В поле `this.squares` будут храниться данные игры, для начала инициализируем его пустым значением `null`.

В поле `isGameFinished` будет флаг, который хранит состояние об окончание текущей сессии игры.

В поле `this.winnerMatrix` будем хранить все возможные выигрышные комбинации в виде списка массивов с комбинациями координат выигрышных ячеек.

Поля `this.boardHandler` и `this.resetHandler` для начала инициализируем  пустыми значениями (`null`), в которые при инициализации запишем обработчики событий на нажатия на игровую поверхность и кнопку сброса соответственно.

Внутри конструктора при создании нового экземпляра класса игры, будут запущены методы:

- `this.initListeners()` —  который инициализирует все обработчики событий на необходимых DOM-элементах;
- `this.startNewGame()` — метод, который установит начальные значения некоторых полей и запустит дополнительную инициализационную логику.

Следующим шагом будет определение метода инициализации `initListeners` внутри класса:

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


В поля `this``.boardHandler` и `this``.resetHandler` запишем обработчики событий при нажатии на игровую поверхность и кнопку сброса соответственно, которые рассмотрим более детально ниже.
На 20-й и 21-й строках добавляем эти обработчики  на соответствующие DOM-элементы. 

- На 20-й строке добавляем обработчик на событие “нажатия” на элемент, который соответствует “игровой поверхности”.  Обработчиком этого события будет стрелочная функция `this``.boardHandler`, которую определили выше. Использование анонимной стрелочной функции в качестве обработчика событий более целесообразно по сравнению с обычным методом класса, если внутри него есть обращение к полям и методам класса через ключевое слово `this`, так как стрелочные функции берут контекст из окружающей области видимости и исключат возможность потери контекста в обработчике.
- На 21-й строке добавляем обработчик на нажатие на кнопку, которая будет нам сбрасывать игру на начало с помощью повторного вызова метода `this``.startNewGame`.


Дальше определим сам метод `startNewGame`:

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

Первое, что сделаем, это запишем в поле `this``.squares` (которое отвечает за данные игры) массив, который будет состоять из трех массивов заполненных тремя элементами со значениями `null`. Это будет соответствовать стартовому состоянию игры, когда все клетки пустые и есть возможность сделать на них ход.
В поле `this``.xIsNext` запишем значение `true`, так как по условиям игру первый ход всегда за игроком, который ходит “крестиками”.
В `this``.isGameFinished` установим флаг `false`, который поменяем на `true`, когда игра закончится — будет известен победитель или не останется больше свободных ходов.
Далее идет последовательный запуск нескольких методов, которые необходимо будет реализовать:

- `this.initAllSquares()` - запуск метода, который обнулит данные ячеек для игровой поверхности `this.squares`;
- `this``.renderGameInfo()` - запуск метода для отображения актуальной игровой информации в соответствующем поле.

Определим в классе  метод  `initAllSquares`:


    initAllSquares() {
        [...this.board.children].forEach(boardRow => {
            [...boardRow.children].forEach(button => {
                button.innerText = null;
            })
        });
    }

Этот метод реализует простую логику, проходится по каждой кнопке в рядах элемента игровой поверхности и в поле `innerText` кнопок устанавливает значение `null`, что позволит очистить предыдущие надписи на них.


И метод  `renderGameInfo`:


    renderGameInfo() {
        this.gameInfo.innerText = this.xIsNext
            ? 'Next player: X'
            : 'Next player: O';
    }

В этом методе в зависимости от текущего значения в поле `this.xIsNext` выводим в соответствующий DOM-элемент информацию о том какой игрок должен совершить следующий ход.


Рассмотрим детальнее обработчики событий на DOM-элементах:


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

Как известно, в качестве аргумента в функцию обработчик события передается объект события. В параметре стрелочной функции с помощью синтаксиса деструктуризации получаем поле `target` из объекта события и переименуем его в `button`. В этом аргументе теперь будет храниться кнопка, нажатая на игровом поле. 
Если посмотреть на HTML-разметку, можно увидеть, что каждая кнопка игрового поля хранит дата-аттрибут `data-index=``"{y}:{x}``"`, где `y` и `x` означают соответствующие координаты кнопки на игровой поверхности.
С помощью деструктуризации массива на 3-й строке в переменные `row` и `column` запишем соответствующие значения координат кнопки на игровой поверхности. Массив значений получаем, разбив методом `split` строковое значение дата-аттрибута по разделителю “:”.
После того как получили координаты нажатой кнопки, проверяем соответствующее значение в данных игры в поле `this``.squares` на 5-й строке.  Тут есть два случая:

- Если в данных уже есть строковое значение, это означает нажатие на ячейку игрового поля, где ход уже был осуществлен ранее или флаг `this``.isGameFinished` установлен в значение `true` — в таком случае просто делаем `return` , что бы предотвратить последующие действия.
- Если в данных нажатой ячейки храниться инициализационное значение `null`, то это соответствует нормальному игровому ходу и в зависимости от текущего значения поля  `this.xIsNext` устанавливаем в элемент массива (который находится по координатам `row, column`) строковое значение “X” или “O”.

На 10-й строке переворачиваем значение поля `this``.xIsNext` на противоположное, что бы следующий “игрок” мог осуществить свой ход.

На 11-й стр. вызывается метод `this``.renderPressedSquare(row, column)`, с помощью него отображаем факт совершенного хода на игровой поверхности:


    renderPressedSquare(row, column) {
        let pressedSquare = document.querySelector(`[data-index='${row}:${column}']`);
        pressedSquare.innerText= this.squares[row][column];
    }

Данный метод принимает координаты нажатой кнопки в виде аргументов `row, column`. 
С помощью метода `document.querySelector` можем легко получить непосредственно саму нажатую кнопку по ее дата-атрибуту, используя полученные координаты. Записываем ее в переменную `pressedSquare`.
На 3-й стр. в поле `innerText` полученной кнопки установим соответствующее значение из данных `this``.squares`, которое мы туда записали в обработчике `this.boardHandler`.

На 12-й стр. в обработчике `this.boardHandler` вызываем метод `this``.renderGameInfo()` для отображения актуальной игровой информации, который уже рассматривали выше.


На 13-й строке в обработчике `this.boardHandler` вызываем метод `this``.checkWinner()`, который определит по результату хода:

- победитель игры уже определился;
- еще нет и можно продолжать игру;
- результатом игры – ничья, так как возможные ходы закончились и нет победителя;


    checkWinner() {
        let winner = this.calculateWinner();
        if (winner) {
            this.renderWinner(winner);
            this.isGameFinished = true;
        }
    }

На 2-й строке этого метода в переменную `winner` запишем результат вызова метода `this``.calculateWinner`, который и определяет победителя:


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
    
        if (this.squares.flat().every(sq => sq)) {
            return 3;
        }
    }

Для определения итерируемся циклом `for … of` по массиву `this``.winnerMatrix`, который как уже знаем, хранит комбинации координат ячеек, которые соответствуют победе.
На 3-й стр. метода `calculateWinner` заводим переменную `valueList`, которую инициализируем как пустой массив.
Далее итерируемся по конкретному варианту комбинации “победных” ячеек, что представляется на итерации переменной `winningCombination`. По полученным в переменных `y, x` координатам берем соответствующее значение из данных игры в поле `squares` и с помощью метода `push`, помещаем это значение в массив `valueList`.
После этого проверяем методом `every`:

- Все ли значения равны 'X' и если да, возвращаем число 1. Это будет означать победу игрока, который ходил с помощью 'X';
- Все ли значения равны 'О' и если да, возвращаем число 2. Это будет означать победу игрока, который ходил с помощью 'О';
- Если нет победителя с после двух проверок, дополнительно на 15-й строке проверим, все ли ячейки в массиве `squares` имеют значения. Для простоты, что бы избежать вложенных итераций делаем массив массивов “плоским”, с помощью метода `flat`, пример:
    `[[a, b], [c, d]] => [a, b, c, d]`
  Если все ячейки занятые значениями (нет свободных клеток), а победителя нет, то возвращаем число 3, которое будет означать ничью.

Вернемся к методу `checkWinner`.
Теперь в переменной `winner` будет храниться либо число (1, 2 или 3), или `undefined`.
На 3-й строке метода `checkWinner` делаем проверку, которая вернет true если у нас есть в `winner` число, то есть имеем победителя или ничью.
Тогда вызываем на 4-й строке метод `this``.renderWinner`, который принимает как аргумент значение  `winner` и  выведет в элемент `this``.gameInfo` информацию о победе или ничье в зависимости от этого числа:

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
  - Если `winner`  равен 1 — выводим информацию о победе игрока. который ходил 'X’
  - Если `winner`  равен 2 — выводим информацию о победе игрока. который ходил 'О’
  - Если `winner`  равен 3 — выводим информацию о ничье.

Завершаем на 5-й строке метода `checkWinner` установкой флага `this``.isGameFinished`  в значение `true`.


Теперь наша игра “крестики-нолики” готова! 🙌 
Спасибо за внимание!  
