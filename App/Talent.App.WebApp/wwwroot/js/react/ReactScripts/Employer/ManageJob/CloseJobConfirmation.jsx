import React from 'react';
import { Confirm } from 'semantic-ui-react';

export default class CloseJobConfirmation extends React.Component {
    constructor(props) {
        super(props);

        this.handleCloseCancel = this.handleCloseCancel.bind(this);
        this.handleCloseConfirm = this.handleCloseConfirm.bind(this);
    }

    handleCloseCancel() {
        this.props.setCloseConfirm(false);
        this.props.setCloseJobId(null);
    }

   handleCloseConfirm() {
    const jobId = this.props.closeJobId;

    // Store deleted job ID in localStorage
    let deletedJobs = JSON.parse(localStorage.getItem("deletedJobs")) || [];
    if (!deletedJobs.includes(jobId)) {
        deletedJobs.push(jobId);
        localStorage.setItem("deletedJobs", JSON.stringify(deletedJobs));
    }

    // Call parent function to update state in the UI
    this.props.handleClosejob(jobId);
    this.props.setCloseJobId(null);
    this.props.setCloseConfirm(false);
}


    render() {
        return (
            <Confirm
                open={this.props.open}
                header='Close the job'
                content='Are you sure you want to proceed?'
                onCancel={this.handleCloseCancel}
                onConfirm={this.handleCloseConfirm}
            />
        );
    }
}
