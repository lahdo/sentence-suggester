import React, {Component} from 'react';

export default class Page extends Component {
    constructor(props) {
        super(props);

        this.getCaretCoordinates = this.getCaretCoordinates.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.onClick = this.onClick.bind(this);
        this.onInput = this.onInput.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);
        this.insertCaretIndicator = this.insertCaretIndicator.bind(this);
        this.removeCaretIndicator = this.removeCaretIndicator.bind(this);
    }

    getCaretCoordinates() {
        let caretCoordinates = {};
        let offsets = {};
        const minOffsets = {
            top: 234,
            left: 78
        };

        this.removeCaretIndicator();
        this.insertCaretIndicator();

        offsets = document.getElementById('caretIndicator').getBoundingClientRect();

        let offsetTop = 150;
        let offsetLeft = offsets.left - ((window.innerWidth - this.refs.page.offsetWidth) / 2);

        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        console.log('offsets.top: ', offsets.top);

        caretCoordinates.top = offsets.top - offsetTop + scrollTop;
        caretCoordinates.left = offsetLeft > minOffsets.left ? offsetLeft : minOffsets.left;

        // console.log('Caret has new coordinates: ', caretCoordinates.top + ', ' + caretCoordinates.left);
        // console.log('Caret possible coordinates: ', offsets.top + ', ' + offsets.left);

        console.log('scrollTop', scrollTop);

        return caretCoordinates;
    }

    removeCaretIndicator() {
        let caretIndicator = document.getElementById('caretIndicator');

        if (caretIndicator && caretIndicator.parentNode) {
            caretIndicator.parentNode.removeChild(caretIndicator);
        }
    }

    insertCaretIndicator() { // http://stackoverflow.com/a/6691294/3959662
        let selection, range;
        let html = '<span id="caretIndicator"></span>';
        let element = document.createElement('div');
        element.innerHTML = html;

        if (window.getSelection) {
            selection = window.getSelection();
            if (selection.getRangeAt && selection.rangeCount) {
                range = selection.getRangeAt(0);

                let fragment = document.createDocumentFragment(), node, lastNode;

                while ((node = element.firstChild)) {
                    lastNode = fragment.appendChild(node);
                }
                range.insertNode(fragment);
            }
        } else if (document.selection && document.selection.type !== "Control") {
            document.selection.createRange().pasteHTML(html); // IE < 9
        }
    }

    handleChange(e) {
        let caretCoordinates = this.getCaretCoordinates();
        this.props.setCaretCoordinates(caretCoordinates);
    }

    onClick(e) {
        e.preventDefault();
        this.handleChange(e);
    }

    onInput(e) {
        e.preventDefault();
        this.refs.page.textContent ? this.props.setCardVisibility(true) : this.props.setCardVisibility(false);
        this.handleChange(e);
    }

    onKeyDown(e) {
        this.handleChange(e);
        // if (e.keyCode === 37) { // LEFT
        //     this.handleChange(e);
        //     console.log('LEFT');
        // }
        // if (e.keyCode === 39) { // RIGHT
        //     this.handleChange(e);
        //     console.log('RIGHT');
        // }
        // if (event.keyCode === 38) { // UP
        //     console.log('UP');
        // }
        // if (event.keyCode === 40) { // DOWN
        //     console.log('DOWN');
        // }
    }

    render() {
        return (
            <div ref="page"
                 className="page"
                 onKeyDown={this.onKeyDown}
                 onClick={this.onClick}
                 onInput={this.onInput}
                 contentEditable="true">
            </div>
        );
    }
}