import React, {Component} from 'react';
import {Button} from 'react-bootstrap';

export default class MainButtons extends Component {
    render() {
        return (
            <div>
                <div className="main-buttons">
                    <Button bsStyle="primary"
                            onClick={this.props.onMainButtonClick}>
                        Enrich Content
                    </Button>
                    <Button bsStyle="info"
                            onClick={this.props.onRandomTextButtonClick}>
                        Get Random Text
                    </Button>
                </div>
            </div>
        );
    }
}
