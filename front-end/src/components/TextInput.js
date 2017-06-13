import React, {Component} from 'react';

export default class TextInput extends Component {
    constructor(props) {
        super(props);
    }

    onPaste(e) {
        e.preventDefault();
        let text = e.clipboardData.getData("text/plain");
        document.execCommand("insertHTML", false, text);
    }

    render() {
        return (
            <div ref="textForKeywords"
                 onPaste={this.onPaste.bind(this)}
                 className="page"
                 contentEditable="true">
            </div>
        );
    }
}