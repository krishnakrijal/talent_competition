import React from 'react';

export default class Loading extends React.Component {

    render() {
        return (
            <div className="ui active dimmer">
                <div className="ui text loader">Loading</div>
            </div>
        );
    }
}