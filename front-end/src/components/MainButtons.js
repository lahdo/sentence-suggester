import React, {Component} from 'react';
import {Button} from 'react-bootstrap';

import * as api from '../utils/api.js'

export default class MainButtons extends Component {
    constructor(props) {
        super(props);

        this.getRandomText = this.getRandomText.bind(this);
    }

    getRandomText() {
        this.props.setSpinner(true);
        return api.fetchRandomText().then(
            response => response.json()
        ).then(
            data => {
                this.props.setSpinner(false);
                this.props.setInputtedText(data);
                return null;
            }
        )
    }

    render() {
        return (
            <div>
                <div className="main-buttons">
                    <Button bsStyle="primary"
                            onClick={ this.props.onMainButtonClick }>
                        { this.props.mainButtonText}
                    </Button>
                    <Button bsStyle="info"
                            onClick={ this.getRandomText }>
                        Get Random Text
                    </Button>
                </div>
            </div>
        );
    }
}
