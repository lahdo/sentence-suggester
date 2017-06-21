import React, {Component} from 'react';
import {Table} from 'react-bootstrap';

export default class Sentences extends Component {
    constructor(props) {
        super(props);

        this.renderPolarity = this.renderPolarity.bind(this);
        this.renderSubjectivity = this.renderSubjectivity.bind(this);
    }

    render() {
        return (
            <Table striped bordered condensed>
                <thead>
                <tr>
                    <th className="sentiment-number-header">Nr</th>
                    <th>Sentence</th>
                    <th>Polarity</th>
                    <th>Subjectivity</th>
                </tr>
                </thead>
                <tbody>
                {
                    this.props.sentiments.map(function (item, i) {
                        return (
                            <tr key={i}>
                                <td>
                                    <p className="sentiment-sentence sentiment-number">{ i+1 }</p>
                                </td>
                                <td>
                                    <p className="sentiment-sentence">{ item.sentence }</p>
                                </td>
                                <td>
                                    { this.renderPolarity(item.sentiment[0]) }
                                </td>
                                <td>
                                    { this.renderSubjectivity(item.sentiment[1]) }
                                </td>
                            </tr>
                        );
                    }, this)
                }
                </tbody>
            </Table>
        );
    }
}
