import React, { Component } from 'react';
import { withRouter } from 'react-router-dom'; // withRouter HOC for navigation
import DisplayJobs from './DisplayJobs.jsx';

class JobEditNavigator extends Component {
    constructor(props) {
        super(props);
        this.handleEditClick = this.handleEditClick.bind(this);
        this.handleCopyClick = this.handleCopyClick.bind(this);
    }

    handleEditClick(jobId) {
        if (jobId) {
            // Navigate using this.props.history.push()
            this.props.history.push(`/EditJob/${jobId}`);
        } else {
            TalentUtil.notification.show("Edit Job Id Missing", "error", null, null);
        }
    }

    handleCopyClick(jobId) {
        if (jobId) {
            this.props.history.push(`/PostJob/${jobId}`);
        } else {
            TalentUtil.notification.show("Copy Job Id Missing", "error", null, null);
        }
    }

    render() {
        return (
            <DisplayJobs
                paginatedJobs={this.props.paginatedJobs}
                activePage={this.props.activePage}
                jobsPerPage={this.props.jobsPerPage}
                totalJobs={this.props.totalJobs}
                handleActivePageChange={this.props.handleActivePageChange}
                handleClosejob={this.props.handleClosejob}
                handleCopyClick={this.handleCopyClick}
                handleEditClick={this.handleEditClick}
            />
        );
    }
}

// Wrap the class component with withRouter to inject navigation props
export default withRouter(JobEditNavigator);
