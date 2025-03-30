import React from 'react';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import { Dropdown } from 'semantic-ui-react';
import { countryOptions } from '../common.js';
import { JobCategories } from './JobCategories.jsx';
import { Salary } from './Salary.jsx';
import { Location } from './Location.jsx';
import { ErrorMessage } from './ErrorMessage.jsx';

export class JobDetailsCard extends React.Component {
    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
        this.handleChangeDate = this.handleChangeDate.bind(this);
        this.updateJob = this.updateJob.bind(this);
    }

    handleChange(event) {
        var data = { ...this.props.jobDetails };
        const { name, value, id, type, checked } = event.target;

        if (type === "checkbox") {
            var subData = data[id] || [];
            if (checked) {
                if (!subData.includes(name)) subData.push(name);
            } else {
                subData = subData.filter(item => item !== name);
            }
            data[id] = subData;
        } else {
            data[name] = value;
        }

        this.props.updateStateData({ target: { name: "jobDetails", value: data } });
    }

    handleChangeDate(date, name) {
        if (name === 'expiryDate') {
            this.props.updateStateData({ target: { name: "expiryDate", value: date } });
        } else {
            var data = { ...this.props.jobDetails };
            data[name] = date;
            this.props.updateStateData({ target: { name: "jobDetails", value: data } });
        }
    }

    updateJob() {
        this.props.createJob();
    }

    render() {
        const { jobDetails = {}, expiryDate, formErrors } = this.props;

        // Default job details
        const jobCategories = jobDetails.categories || { category: "", subCategory: "" };
        const jobLocation = jobDetails.location || { country: "", city: "" };
        const jobType = jobDetails.jobType || [];

        function convertToDate(date) {
            if (!date) return null;
            if (moment.isMoment(date)) return date.toDate();
            if (date instanceof Date) return date;
            return new Date(date);
        }

        return (
            <div className="ui segment">
                <div className="content">
                    <div className="header">
                        Job Details
                        <ErrorMessage
                            isError={!!Object.keys(formErrors).find(key => key.startsWith('jobDetails.'))}
                            errorMessage="Please provide the required fields in JobDetails"
                        />
                    </div>
                </div>

                <div className="content">
                    <div className="ui form">
                        <div className="ui small feed">
                            {/* Job Categories */}
                            <div className="event">
                                <div className="content">
                                    <div className="summary">
                                        *Category:
                                        <JobCategories categories={jobCategories} handleChange={this.handleChange} />
                                    </div>
                                </div>
                            </div>

                            {/* Job Type */}
                            <div className="event">
                                <div className="content">
                                    <div className="summary">
                                        *JobType: <br />
                                        <div className="ui form">
                                            <div className="ui multi checkbox grouped fields">
                                                {["fullTime", "partTime", "contract"].map(type => (
                                                    <div className="ui checkbox field" key={type}>
                                                        <input
                                                            type="checkbox"
                                                            name={type}
                                                            id="jobType"
                                                            onChange={this.handleChange}
                                                            checked={jobType.includes(type)}
                                                        />
                                                        <label>{type.replace(/([A-Z])/g, " $1")}</label>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Dates */}
                            <div className="event">
                                <div className="content">
                                    <div className="summary">
                                        *Start Date:
                                        <br />
                                        <DatePicker
                                            selected={convertToDate(jobDetails.startDate)}
                                            onChange={date => this.handleChangeDate(date, "startDate")}
                                            minDate={new Date()}
                                        />
                                    </div>
                                    <div className="summary">
                                        End Date:
                                        <br />
                                        <DatePicker
                                            selected={convertToDate(jobDetails.endDate)}
                                            onChange={date => this.handleChangeDate(date, "endDate")}
                                            minDate={new Date()}
                                        />
                                    </div>
                                    <div className="summary">
                                        *Expiry Date:
                                        <br />
                                        <DatePicker
                                            selected={convertToDate(expiryDate)}
                                            onChange={date => this.props.updateStateData({ target: { name: 'expiryDate', value: date } })}
                                            minDate={new Date()}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Salary */}
                            <div className="event">
                                <div className="content">
                                    <div className="summary">
                                        Salary Per Annum:
                                        <br />
                                        <Salary salary={jobDetails.salary} handleChange={this.handleChange} />
                                    </div>
                                </div>
                            </div>

                            {/* Location */}
                            <div className="event">
                                <div className="content">
                                    <div className="summary">
                                        *Location:
                                        <Location location={jobLocation} handleChange={this.handleChange} />
                                    </div>
                                </div>
                            </div>

                            {/* Save Button */}
                            <div className="event">
                                <div className="content">
                                    <div className="summary">
                                        <button type="button" className="fluid ui teal button" onClick={this.props.createClick}>
                                            Save
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
