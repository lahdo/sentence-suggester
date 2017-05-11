import React, {Component} from 'react';
import {DropdownButton, MenuItem} from 'react-bootstrap';

export default class StyleSelector extends Component {

    render() {
        return (
            <div className="styleSelector">
                <span className="currentStyleHeader">Current Style (Jargon): </span>
                <DropdownButton id="styleSelector" title="Select Style">
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
            </div>
        );
    }
}


