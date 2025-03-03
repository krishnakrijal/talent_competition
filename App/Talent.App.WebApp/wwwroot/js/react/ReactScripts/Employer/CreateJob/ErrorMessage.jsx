import React from 'react';

export class ErrorMessage extends React.Component {

    constructor(props) {
        super(props);
    };

    render() {
        return (
            <div>
                {this.props.isError ? <div className="ui basic red pointing prompt label transition visible">{this.props.errorMessage}</div> : null}
            </div>
        )
    }
}