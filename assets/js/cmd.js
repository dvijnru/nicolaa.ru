/*! CMD Page v0.0.1 | Nikolay Grigoriev | https://github.com/dvijnru/nicolaa.ru */
class Cmd {

    constructor(props) {
        this.init(props);
    }

    init = (props) => {

        this.rowName = 'guest: ';
        this.historyId = 0;

        if(props.selector) {
            this.id = props.selector;
            this.$block = document.getElementById(this.id);
        } else {
            return alert('Не указан селектор блока для терминала');
        }
        if(props.old) {
            this.old = props.old;
        } else {
            this.old = null;
        }

        this.$container = this.renderContainer();

        this.$input = this.$container.querySelector('.cmd-input');
        this.$inputCursor = this.$container.querySelector('.cmd-input-cursor');

        this.listeners();

        this.commands = [
            {
                name: 'help',
                message: this.sendMessageHelp,
                description: 'Вывод списка доступных команд',
            }, {
                name: 'about',
                message: 'Меня зовут Николай, живу в Екатеринбурге<br>В сфере программирования около 7 лет<br>Стек: php, mysql, redis, elasticsearch, laravel, html, css, js, react, vue',
                description: 'Вывод информации обо мне',
            }, {
                name: 'template-change',
                message: this.changeTemplate,
                description: 'Изменение шаблона терминала',
            }, {
                name: 'portfolio',
                message: this.sendPortfolio,
                description: 'Вывод списка моих работ',
            }, {
                name: 'history',
                message: this.sendHistory,
                description: 'Вывод истории введенных команд',
            }, {
                name: 'history-clear',
                message: this.clearHistory,
                description: 'Очистка истории введенных команд',
            }, {
                name: 'clear',
                message: this.clearTerminal,
                description: 'Очистка терминала',
            }
        ];

        this.portfolios = [
            {
                id: 1,
                name: 'nicolaa.ru',
                message: 'Тут описание сайта',
                description: 'Мой сайт'
            }
        ];

        this.sendMessage('Добро пожаловать в мой терминал<br>Для получения списка доступных команд введите "help"');
        this.setInputFocus();
    }

    listeners = () => {
        document.addEventListener('click', this.clickHandler);
        this.$input.addEventListener('input', this.inputInputHandler);
        this.$input.addEventListener('keyup', this.inputKeyUpHandler);
        this.$input.addEventListener('keydown', this.inputKeyDownHandler);
    }
    inputInputHandler = () => {
        this.changeCursor();
    }
    inputKeyUpHandler = (event) => {
        event.preventDefault();
        let keyCode = event.keyCode || event.which;
        if(keyCode == 35 || keyCode == 36 || keyCode == 37 || keyCode == 38 || keyCode == 39 || keyCode == 40) {
            this.changeCursor();
        }
    }
    inputKeyDownHandler = (event) => {
        let keyCode = event.keyCode || event.which;
        if(keyCode == 13) {
            event.preventDefault();
            this.sendCommand();
        } else if(keyCode == 38) {
            this.getHistory('up');
        } else if(keyCode == 40) {
            this.getHistory('down');
        }
    }
    clickHandler = (event) => {
        if(event.target.closest('.cmd-input')) {
            this.changeCursor();
        } else {
            this.setInputFocus();
        }
    }

    sendCommand = () => {
        this.$inputCursor.style.display = 'none';
        let value = this.$input.innerText.trim();
        let $blockRow = this.renderBlockRow(value);
        this.$container.querySelector('.cmd-block-content').appendChild($blockRow);
        this.$input.innerHTML = '';
        this.changeCursor();
        this.$inputCursor.style.display = 'block';
        this.getCommand(value);
        this.setCommandHistory(value);
    }
    sendMessage = (message) => {
        let $block = this.renderMessage();
        this.typeWriter($block, message, 0);
    }
    sendMessageHelp = () => {
        let message = '';
        this.commands.forEach((item) => {
            message += `${item.name} - ${item.description}<br>`;
        });
        this.sendMessage(message);
    }
    sendHistory = () => {
        let message = '';
        this.getCommandHistory().forEach((item) => {
            message += `${item}<br>`;
        });
        this.sendMessage(message);
    }

    changeTemplate = () => {
        this.$container.classList.toggle('terminal-old');
        this.sendMessage('Шаблон изменен');
    }
    changeCursor = () => {
        let position = this.getCursorPosition();
        this.$inputCursor.style.top = `${position.top}px`;
        this.$inputCursor.style.left = `${position.left}px`;
    }

    getCursorPosition = () => {
        let top = 0;
        let left = 0;
        let selection = document.getSelection();
        if (selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            const rect = range.getBoundingClientRect();
            top = rect.top + window.pageYOffset + 3;
            left = rect.left;
            let value = this.$input.innerText.trim();
            if(!value) {
                let height = this.$container.querySelector('.cmd-block-content').offsetHeight;
                top = height + 3;
                left += 69;
            }
        }
        return {
            top: top,
            left: left
        }
    }
    getCommand = (value) => {
        let valueArray = value.split(' ');
        let message = `Команда ${value} не найдена<br>Введите "help" для получения списка доступных команд`;

        this.commands.forEach((item) => {
            if(item.name == valueArray[0]) {
                if (typeof item.message === 'function') {
                    item.message(valueArray);
                    message = '';
                } else {
                    message = item.message;
                }
            }
        });

        this.sendMessage(message);
    }
    sendPortfolio = (value) => {
        if(value[1]) {
            this.getPortfolio(value[1]);
        } else {
            this.getPortfolios();
        }
    }
    getPortfolios = (value) => {
        let message = '';
        this.portfolios.forEach((item) => {
            message += `id: ${item.id}; ${item.name} - ${item.description}<br>`;
        });
        message += 'Для получения подробной информации о работе введите "portfolio id"';
        this.sendMessage(message);
    }
    getPortfolio = (id) => {
        let message = '';
        this.portfolios.forEach((item) => {
            if(item.id == id) {
                message = item.message;
            }
        });
        if(!message) {
            message = `Работа с id ${id} не найдена`;
        }
        this.sendMessage(message);
    }
    getCommandHistory = () => {
        let history = localStorage.getItem('cmd-history');
        if(history) {
            history = JSON.parse(history);
        } else {
            history = [];
        }
        return history;
    }
    getHistory = (direction) => {
        let top = this.$input.offsetTop + 3;
        let topCursor = this.$inputCursor.offsetTop;
        let history = this.getCommandHistory();
        let historyLength = history.length;
        let id = 0;
        if(direction == 'up') {
            if(top == topCursor) {
                if(this.historyId > -historyLength) {
                    this.historyId -= 1;
                    id = historyLength + this.historyId;
                }
            }
        } else if(direction == 'down') {
            if(top == topCursor) {
                if(this.historyId < 0) {
                    this.historyId += 1;
                    id = historyLength + this.historyId;
                }
            }
        }
        if(id) {
            if(history[id]) {
                history = history[id];
                this.$input.innerHTML = history;
            } else {
                this.$input.innerHTML = '';
            }
        }
    }

    setInputFocus = () => {
        this.$input.focus();
        if(!this.$container.classList.contains('cmd-input-focus')) {
            this.$container.classList.add('cmd-input-focus');
        }
    }
    setCommandHistory = (value) => {
        let history = localStorage.getItem('cmd-history');
        if(history) {
            history = JSON.parse(history);
            if(history[history.length - 1] != value) {
                history.push(value);
            }
            history = JSON.stringify(history);
        } else {
            history = [value];
            history = JSON.stringify(history);
        }
        localStorage.setItem('cmd-history', history);
        this.historyId = 0;
    }

    renderContainer = () => {

        let $terminal = document.createElement('div');
        $terminal.className = 'terminal';

        let $container = document.createElement('div');
        $container.className = 'cmd-container';

        let $blockOutput = document.createElement('div');
        $blockOutput.className = 'cmd-block-content';

        let $blockRow = this.renderBlockRow();

        let $blockFooter = document.createElement('div');
        $blockFooter.className = 'cmd-block-footer';

        $blockOutput.appendChild($blockRow);

        $blockFooter.appendChild($blockRow)

        $container.appendChild($blockOutput);
        $container.appendChild($blockFooter);

        $terminal.appendChild($container);

        if(this.old) {
            $terminal.classList.add('terminal-old');
            let $terminalScanLines = document.createElement('div');
            $terminalScanLines.className = 'scanlines';
            $terminalScanLines.style = '--time: 1.8;';
            let $terminalNoise = document.createElement('div');
            $terminalNoise.className = 'noise';
            $terminal.appendChild($terminalScanLines);
            $terminal.appendChild($terminalNoise);
        }

        this.$block.appendChild($terminal);

        return $terminal;
    }
    renderBlockRow = (text = null) => {
        let blockRow = document.createElement('div');
        blockRow.className = 'cmd-row';

        let blockRowName = document.createElement('div');
        blockRowName.className = 'cmd-row-name';
        blockRowName.innerHTML = this.rowName;

        let blockRowBody = document.createElement('div');
        blockRowBody.className = 'cmd-row-body';
        if(text) {
            blockRowBody.innerHTML = text;
        } else {
            let input = document.createElement('div');
            input.className = 'cmd-input';
            input.contentEditable = true;

            let inputCursor = document.createElement('div');
            inputCursor.className = 'cmd-input-cursor';

            blockRowBody.appendChild(input);
            blockRowBody.appendChild(inputCursor);

        }

        blockRow.appendChild(blockRowName);
        blockRow.appendChild(blockRowBody);

        return blockRow;
    }
    renderMessage = () => {
        let $block = document.createElement('div');
        $block.className = 'cmd-block-message';
        this.$container.querySelector('.cmd-block-content').appendChild($block);
        return $block;
    }

    clearTerminal = () => {
        this.$container.querySelector('.cmd-block-content').innerHTML = '';
        this.$input.innerHTML = '';
        this.changeCursor();
    }
    clearHistory = () => {
        localStorage.removeItem('cmd-history');
        this.historyId = 0;
    }

    typeWriter = ($block, message, i, tag = '') => {
        if (i < message.length) {
            let text = message.charAt(i);
            if(text == '<') {
                tag += text;
            } else if(text == '>') {
                tag += text;
                $block.innerHTML += tag;
                tag = '';
            } else if(tag) {
                tag += text;
            } else {
                $block.innerHTML += text;
            }
            i++;
            this.changeCursor()
            setTimeout(this.typeWriter, 10, $block, message, i, tag);
        }
    }

}