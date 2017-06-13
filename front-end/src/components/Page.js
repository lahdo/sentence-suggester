import React, {Component} from 'react';
// import * as SentenceParser from '../lib/SentenceParser';

export default class Page extends Component {
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
            <div ref="pageContent"
                onPaste={this.onPaste.bind(this)}
                onKeyDown={this.props.onKeyDown.bind(this)}
                 onClick={ this.props.onClick.bind(this) }
                 onInput={ this.props.onInput.bind(this) }
                 className="page"
                 contentEditable="true">
            </div>
        );
    }
}