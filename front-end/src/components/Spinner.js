import React, {Component} from 'react'
// easily import from entry
import {
    BeatLoading, BounceLoading, CircularLoading,
    ClockLoading, RotateLoading, SpinLoading,
    WaveLoading, DashLoading, CopperLoading
} from 'respinner'

export default class Spinner extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="spinner"> {
                this.props.showSpinner ?
                    <div className="spinner-wrapper">
                        <h2>processing</h2>
                        <div className="spinners">
                            <BounceLoading fill="#00ae84" count={6}/>
                        </div>
                    </div> : null
            }
            </div>
        );
    }
}

