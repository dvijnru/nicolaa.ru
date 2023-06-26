class Cmd {

    // test = '';

    constructor(props) {
        this.init(props);
    }

    init = (props) => {

        this.rowName = 'guest: ';

        if(props.selector) {
            this.id = props.selector;
            this.$block = document.getElementById(this.id);
        } else {

        }
        if(props.old) {
            this.old = props.old;
        } else {
            this.old = null;
        }

        this.$container = this.renderContainer();
        this.$input = this.$container.querySelector('.cmd-input');
        this.$inputCursor = this.$container.querySelector('.cmd-input-cursor');

        this.listners();

    }

    listners = () => {

        document.addEventListener('click', this.clickHandler);

        this.$input.addEventListener('blur', this.inputBlur);
        this.$input.addEventListener('input', this.inputInput);
        this.$input.addEventListener('click', this.inputClickHandler);
        this.$input.addEventListener('keyup', this.inputKeyUpHandler);
        this.$input.addEventListener('keydown', this.inputKeyDownHandler);
    }
    beforeunloadHandler = (event) => {
        this.$input.blur();
        this.$input.classList.remove('cmd-input-focus');
    }
    inputBlur = (event) => {
        console.log(event);
    }
    inputInput = () => {
        this.changeCursor();
    }
    inputClickHandler = () => {
        this.changeCursor();
    }
    inputKeyUpHandler = (event) => {
        event.preventDefault();
        let keyCode = event.keyCode || event.which;
        if(keyCode == 37 || keyCode == 38 || keyCode == 39 || keyCode == 40) {
            this.changeCursor();
        }
    }
    inputKeyUpHandler = (event) => {
        event.preventDefault();
        let keyCode = event.keyCode || event.which;
        if(keyCode == 13) {
            this.sendMessage();
        }
    }
    sendMessage = () => {
        this.$inputCursor.style.display = 'none';
        let value = this.$input.innerText.trim();
        let $blockRow = this.renderBlockRow(value);
        this.$container.querySelector('.cmd-block-content').appendChild($blockRow);
        this.$input.innerHTML = '';
        this.changeCursor();
        this.$inputCursor.style.display = 'block';
        this.sendCommand(value);
    }
    sendCommand = (value) => {
        let message = 'command not found: ' + value + '<br>type "help" for more information';
        if(value == 'help') {
            message = 'help';
        }
        let $block = document.createElement('div');
        $block.className = 'cmd-block-message';
        // $block.innerHTML = message;
        this.$container.querySelector('.cmd-block-content').appendChild($block);
        this.typeWriter($block, message, 0);
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
            setTimeout(this.typeWriter, 20, $block, message, i, tag);
        }
    }


    changeCursor = () => {
        let position = window.getSelection().anchorOffset;
        this.$inputCursor.style.left = position + 'ch';
    }
    clickHandler = (event) => {

        if(event.target == '') {

        } else {
            this.$input.focus();
            if(!this.$container.classList.contains('cmd-input-focus')) {
                this.$container.classList.add('cmd-input-focus');
            }
        }

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
            $terminalScanLines.style = '--time: 1.8588235294117648;';
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
            // let blockInput = document.createElement('div');
            // blockInput.className = 'cmd-row-body-input';

            let input = document.createElement('div');
            input.className = 'cmd-input';
            input.contentEditable = true;

            let inputCursor = document.createElement('div');
            inputCursor.className = 'cmd-input-cursor';

            blockRowBody.appendChild(input);
            blockRowBody.appendChild(inputCursor);

            // blockRowBody.appendChild(blockInput);
        }

        blockRow.appendChild(blockRowName);
        blockRow.appendChild(blockRowBody);

        return blockRow;
    }

    as = () => {
        this.test = 'test';
        console.log(this.test);
    }

}