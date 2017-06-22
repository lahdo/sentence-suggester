import React, {Component} from 'react';
import {Button} from 'react-bootstrap';

export default class EntityButtons extends Component {
    constructor(props) {
        super(props);

        this.entities = {
            PERSON: 'People',
            NORP: 'Nationalities or Groups',
            FACILITY: 'Facilities',
            ORG: 'Organizations',
            GPE: 'Places',
            LOC: 'Locations',
            PRODUCT: 'Objects',
            EVENT: 'Events',
            WORK_OF_ART: 'Work of Art',
            LANGUAGE: 'Languages',
            TYPE: 'Types',
            DATE: 'Dates',
            TIME: 'Times',
            PERCENT: 'Percents',
            MONEY: 'Money',
            QUANTITY: 'Quantity',
            ORDINAL: 'Ordinal Numerals',
            CARDINAL: 'Other Numerals',
            FAC: 'FAC',
        }

    }

    render() {
        return (
            <div className="entityButtons">
                {
                    Object.keys(this.props.entities).length ?
                        Object.keys(this.props.entities).map((entity, i) => {
                            return (
                                <Button key={ i }
                                        bsStyle="default"
                                        className="entityButton"
                                        onClick={ (e) => this.props.onEntityButtonClick(e, entity)}>
                                    { this.entities[entity] }
                                </Button>
                            );
                        })
                        : null
                }
            </div>
        );
    }
}

//     PERSON	People, including fictional.
//     NORP	Nationalities or religious or political groups.
//     FACILITY	Buildings, airports, highways, bridges, etc.
//     ORG	Companies, agencies, institutions, etc.
//     GPE	Countries, cities, states.
//     LOC	Non-GPE locations, mountain ranges, bodies of water.
//     PRODUCT	Objects, vehicles, foods, etc. (Not services.)
//     EVENT	Named hurricanes, battles, wars, sports events, etc.
//     WORK_OF_ART	Titles of books, songs, etc.
//     LANGUAGE	Any named language.
//
//     The following values are also annotated in a style similar to names:
//
//     TYPE	DESCRIPTION
//     DATE	Absolute or relative dates or periods.
//     TIME	Times smaller than a day.
//     PERCENT	Percentage, including "%".
//     MONEY	Monetary values, including unit.
//     QUANTITY	Measurements, as of weight or distance.
//     ORDINAL	"first", "second", etc.
//     CARDINAL	Numerals that do not fall under another type.