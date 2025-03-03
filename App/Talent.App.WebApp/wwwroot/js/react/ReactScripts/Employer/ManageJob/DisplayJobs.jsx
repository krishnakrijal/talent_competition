
import React, { Component } from 'react';
import { Icon, Card, Button, Pagination, Container, Label } from 'semantic-ui-react';
import styles from "./JobStyle.module.css";
import moment from 'moment';
import CloseJobConfirmation from './CloseJobConfirmation.jsx';

export default class DisplayJobs extends Component {
    constructor(props) {
        super(props);

        this.state = {
            closeConfirm: false,
            closeJobId: null
        };

        // Bind methods to `this`
        this.checkExpiration = this.checkExpiration.bind(this);
        this.handleCopy = this.handleCopy.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.setCloseJobId = this.setCloseJobId.bind(this);
        this.setCloseConfirm = this.setCloseConfirm.bind(this);
    }

    checkExpiration(date) {
        const expiryDate = moment(date); // Ensure date is a moment object
        return expiryDate.isBefore(moment(), 'day') ? 'Expired' : null;
    }

    


    handleCopy(jobId) {
        this.props.handleCopyClick(jobId);
    }

    handleEdit(jobId) {
        this.props.handleEditClick(jobId);
    }
    handleClose(jobId) {
        // Save the deleted job ID in localStorage
        let deletedJobs = JSON.parse(localStorage.getItem("deletedJobs")) || [];
        if (!deletedJobs.includes(jobId)) {
            deletedJobs.push(jobId);
            localStorage.setItem("deletedJobs", JSON.stringify(deletedJobs));
        }

        // Call the parent function to update UI state
        this.props.handleClosejob(jobId);
    }


    setCloseJobId(id) {
        this.setState({ closeJobId: id });
    }

    setCloseConfirm(confirm) {
        this.setState({ closeConfirm: confirm });
    }

    render() {
        const pagedJobs = this.props.paginatedJobs;

        if (!Array.isArray(pagedJobs)) {
            return null;
        }
       
        return (
            <Container>
                <Card.Group>
                    {pagedJobs.map((job) => (
                        <Card key={job.id} className={styles.cardMargin}>
                            <Card.Content>
                                <Card.Header>{job.title}</Card.Header>
                                <a className="ui black right ribbon label">
                                    <Icon name='user' size='small' />
                                    {job.noOfSuggestions}
                                </a>
                                <Card.Meta>{job.location.city}, {job.location.country}</Card.Meta>
                                <Card.Description>{job.summary}</Card.Description>
                            </Card.Content>

                            <div className="ui divider"></div>
                            <div className="ui grid">
                                <div className={`three wide column ${styles.expireJobMargin}`}>
                                   
                                    {
                                        this.checkExpiration(job.expiryDate) === 'Expired'
                                            ? <Label color="red" size="tiny">Expired</Label>
                                            : <Label color="green" size="tiny">Valid</Label>
                                    }

                                    
                                </div>

                                <div className="twelve wide right aligned column">
                                    <Button.Group  className={styles.buttonGroup}>
                                        {!job.status && (
                                            <Button className={`basic outline blue ${styles.customTinyButtonStyle}`}
                                                onClick={() => this.handleClose(job.id)}>
                                                <Icon name="close" /> Close
                                            </Button>
                                        )}
                                        <Button className={`basic outline blue ${styles.customTinyButtonStyle}`}
                                            onClick={() => this.handleEdit(job.id)}>
                                            <Icon name="edit" /> Edit
                                        </Button>
                                        <Button className={`basic outline blue ${styles.customTinyButtonStyle} ${styles.buttonRightMargin}`}
                                            onClick={() => this.handleCopy(job.id)}>
                                            <Icon name="copy" /> Copy
                                        </Button>
                                    </Button.Group>
                                </div>
                            </div>
                        </Card>
                    ))}
                </Card.Group>
                <CloseJobConfirmation
                    open={this.state.closeConfirm}
                    handleClosejob={this.props.handleClosejob}
                    setCloseConfirm={this.setCloseConfirm}
                    closeJobId={this.state.closeJobId}
                    setCloseJobId={this.setCloseJobId}
                />
            </Container>
        );
    }
}
