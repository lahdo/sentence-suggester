import React, {Component} from 'react';
import {DropdownButton, MenuItem} from 'react-bootstrap';

export default class StyleSelector extends Component {

    render() {
        return (
            <div className="styleSelector">
                <DropdownButton id="styleSelector" title="Select Jargon">
                    {
                        this.props.styles.map(function (style, i) {
                            return (
                                <MenuItem
                                    onClick={() => this.props.selectStyle(style)}
                                    key={i}>
                                    {style}
                                </MenuItem>
                            );
                        }, this)
                    }
                </DropdownButton>
                <span className="currentStyleHeader">Current: </span>
                <strong>{this.props.selectedStyle}</strong>
            </div>
        );
    }
}


