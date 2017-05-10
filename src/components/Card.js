import React, {Component} from 'react';

export default class Card extends Component {

    calculateCardStyle() {
        return {
            top: this.props.cardStyles.top + 27,
            left: this.props.cardStyles.left - 10
        };
    }

    render() {
        const cardStyles = this.calculateCardStyle();

        return (
            <div>
                <div className='sentences-list'
                     style={cardStyles}>
                    <ul className='sentences'>
                        <li>Please note that this library is</li>
                        <li>Please take a note</li>
                        <li>Please make sure</li>
                    </ul>
                </div>
            </div>
        );
    }
}


