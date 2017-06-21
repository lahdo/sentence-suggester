import React, {Component} from 'react';
import {Row, Col, Table} from 'react-bootstrap';
import Rating from 'react-rating';

export default class Sentences extends Component {
    constructor(props) {
        super(props);

        this.POL_RESULTS = {
            positive: 'positive',
            negative: 'negative',
            neutral: 'neutral'
        };

        this.SUB_RESULTS = {
            subjective: 'subjective',
            objective: 'objective',
            neutral: 'neutral'
        };

        this.renderPolarity = this.renderPolarity.bind(this);
        this.renderSubjectivity = this.renderSubjectivity.bind(this);
        this.normalizePolarity = this.normalizePolarity.bind(this);
        this.normalizeSubjectivity = this.normalizeSubjectivity.bind(this);
        this.normalizeValue = this.normalizeValue.bind(this);
    }

    normalizeValue(value) {
        return (Math.round((value * 100) / 2)/10).toFixed(2);
    }

    normalizePolarity(sentiment) {
        let value = this.normalizeValue(sentiment);
        let result = this.POL_RESULTS.negative;

        if (sentiment > 0) {
            result = this.POL_RESULTS.positive;
        }
        else if (sentiment < 0) {
            result = this.POL_RESULTS.negative;
            value = -value
        }
        else {
            result = this.POL_RESULTS.neutral;
        }

        return [value, result]
    }

    normalizeSubjectivity(sentiment) {
        let value = this.normalizeValue(sentiment);
        let result = this.SUB_RESULTS.objective;

        if (value > 2.65) {
            result = this.SUB_RESULTS.subjective;
        }
        else if (value < 2.35) {
            result = this.SUB_RESULTS.objective;
        }
        else {
            result = this.SUB_RESULTS.neutral;
        }

        return [value, result]
    }

    renderPolarity(polarity) {
        const [rating, result] = this.normalizePolarity(polarity);
        let value = this.normalizeValue(polarity);

        let empty = `fa fa-circle-o sentiment-icon sentiment-icon-${ result }`;
        let full = `fa fa-circle sentiment-icon sentiment-icon-${ result }`;

        return (
            <div>
                <Rating
                    empty={ empty }
                    full={ full }
                    initialRate={ Number(rating) }
                    readonly
                />
                <p>{ result } ({ value })</p>
            </div>
        )
    }

    renderSubjectivity(subjectivity) {
        const [rating, result] = this.normalizeSubjectivity(subjectivity);
        let value = this.normalizeValue(subjectivity);

        let empty = `fa fa-circle-o sentiment-icon sentiment-icon-${ result }`;
        let full = `fa fa-circle sentiment-icon sentiment-icon-${ result }`;

        return (
            <div>
                <Rating
                    empty={ empty }
                    full={ full }
                    initialRate={ Number(rating) }
                    readonly
                />
                <p>{ result } ({ value })</p>
            </div>
        )
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
