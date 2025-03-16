import React from 'react';
import ReactDOM from 'react-dom';
import Cookies from 'js-cookie';
import { LoggedInNavigation } from '../../Layout/LoggedInNavigation.jsx';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import { Dropdown } from 'semantic-ui-react';
import { countryOptions } from '../common.js';
import { JobDetailsCard } from './JobDetailsCard.jsx';
import { JobApplicant } from './JobApplicant.jsx';
import { ChildSingleInput } from '../../Form/SingleInput.jsx';
import { JobDescription } from './JobDescription.jsx';
import { JobSummary } from './JobSummary.jsx';
import { BodyWrapper, loaderData } from '../../Layout/BodyWrapper.jsx';
import { withRouter } from 'react-router-dom'; 
import Loading from '../../Layout/Loading.jsx';
import { ErrorMessage } from './ErrorMessage.jsx';

//  for validation
const requiredFields = [
    { name: 'title', message: 'Please enter the Title!!' },
    { name: 'description', message: 'Please enter Description!!' },
    { name: 'summary', message: 'Please enter Summary!!' },
    { name: 'jobDetails.categories.category', message: 'Please select a Category!!' },
    { name: 'jobDetails.categories.subCategory', message: 'Please select a SubCategory!!' },
    { name: 'jobDetails.jobType', message: 'Please select JobType!!' },
    { name: 'jobDetails.startDate', message: 'Please enter startDate!!' },
    { name: 'expiryDate', message: 'Please enter expiryDate!!' },
    { name: 'jobDetails.location.country', message: 'Please select Country!!' },
    { name: 'jobDetails.location.city', message: 'Please select City!' },
];


class CreateJob extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            jobData: {
                id: "",
                employerID: "",
                title: "",
                description: "",
                summary: "",
                expiryDate: moment().add(14, 'days'),
                applicantDetails: {
                    yearsOfExperience: { years: 1, months: 1 },
                    qualifications: [],
                    visaStatus: []
                },
                jobDetails: {
                    categories: { category: "", subCategory: "" },
                    jobType: [],
                    startDate: moment(),
                    endDate: null,
                    salary: { from: 0, to: 0 },
                    location: { country: "", city: "" }
                }
            },
            loaderData: loaderData,
            formErrors: {},
            heading: '',
            backendError: '',
        };

        this.updateStateData = this.updateStateData.bind(this);
        this.addUpdateJob = this.addUpdateJob.bind(this);
        this.loadData = this.loadData.bind(this);
        this.addErrorMessage = this.addErrorMessage.bind(this);
        this.validateField = this.validateField.bind(this);
        this.init = this.init.bind(this);
    }

    init() {
        let loaderData = this.state.loaderData;
        loaderData.allowedUsers.push("Employer");
        loaderData.allowedUsers.push("Recruiter");
        loaderData.isLoading = true;
        this.setState({ loaderData });
    }

    componentDidMount() {
        this.init();
        this.loadData();
    }

    loadData() {
        this.setState({
            loaderData: {
                ...this.state.loaderData,
                isLoading: true
            }
        });

        const param = this.props.match.params.id ? this.props.match.params.id : "";
        const copyJobParam = this.props.match.params.copyId ? this.props.match.params.copyId : "";

        

        if (param !== "" || copyJobParam !== "") {
            const apiUrl = process.env.REACT_APP_LISTING_API_URL;
            const link = param !== "" ? `${apiUrl}/listing/listing/GetJobByToEdit?id=` + param
                : `${apiUrl}/listing/listing/GetJobForCopy?id=` + copyJobParam;
            if (param !== '') {
                this.setState({
                    heading: "Edit Job"
                });
            } else {
                this.setState({
                    heading: "Copy Job"
                });
            }

            const cookies = Cookies.get('talentAuthToken');
            $.ajax({
                url: link,
                headers: {
                    'Authorization': 'Bearer ' + cookies,
                    'Content-Type': 'application/json'
                },
                type: "GET",
                contentType: "application/json",
                dataType: "json",
                success: function (res) {
                    if (res.success === true) {
                        res.jobData.jobDetails.startDate = moment(res.jobData.jobDetails.startDate);
                        res.jobData.jobDetails.endDate = res.jobData.jobDetails.endDate ? moment(res.jobData.jobDetails.endDate) : null;
                        res.jobData.expiryDate = res.jobData.expiryDate
                            ? moment(res.jobData.expiryDate) > moment()
                                ? moment(res.jobData.expiryDate) : moment().add(14, 'days') : null;
                        this.setState({ jobData: res.jobData });
                    } else {
                        this.setState({
                            backendError: res.message
                        });

                        TalentUtil.notification.show(res.message, "error", null, null);
                    }
                }.bind(this)
            });
        } else {
            this.setState({
                heading: "Create Job"
            });
        }

        this.setState({
            loaderData: {
                ...this.state.loaderData,
                isLoading: false
            }
        });
    }

    validateField() {
        const missingFieldsTemp = requiredFields.reduce((acc, field) => {
            const value = field.name.split('.').reduce((obj, prop) => obj && obj[prop], this.state.jobData);
            if (!value || (Array.isArray(value) && value.length === 0)) {
                return { ...acc, [field.name]: field.message };
            }
            return acc;
        }, {});

        if (Object.keys(missingFieldsTemp).length > 0) {
            this.setState({ formErrors: missingFieldsTemp });
            return false;
        } else {
            return true;
        }
    }

    addErrorMessage(message) {
        this.setState(
            { errorMessage: message }
        );
    }

    addUpdateJob() {
        const jobData = this.state.jobData;
        if (moment.isMoment(jobData.expiryDate)) {
            jobData.expiryDate = jobData.expiryDate.toDate();
        }
        const dataValid = this.validateField();
        if (!dataValid) {
            return;
        } else {
            this.setState(
                {
                    formErrors: {}
                }
            );
        }
        const cookies = Cookies.get('talentAuthToken');
        const apiUrl = process.env.REACT_APP_LISTING_API_URL;
        const link = `${apiUrl}/listing/listing/createUpdateJob`;
        $.ajax({
            url: link,
            headers: {
                'Authorization': 'Bearer ' + cookies,
                'Content-Type': 'application/json'
            },
            dataType: 'json',
            type: "post",
            data: JSON.stringify(jobData),
            success: function (res) {
                if (res.success === true) {
                    TalentUtil.notification.show(res.message, "success", null, null);
                    window.location = "/ManageJobs";
                } else {
                    TalentUtil.notification.show(res.message, "error", null, null);
                }

            }.bind(this)
        });
    }
    updateStateData(event) {
        const data = Object.assign({}, this.state.jobData)
        data[event.target.name] = event.target.value
        this.setState({
            jobData: data
        })
       // console.log(data);
    }
    render() {
        if (this.state.loaderData.isLoading) {
            return <Loading />;
        }
        if (this.state.backendError) {
            return <Redirect to="/ManageJobs" />; 
        }

        return (
            <BodyWrapper reload={this.init} loaderData={this.state.loaderData}>
                <section className="page-body">
                    <div className="ui container">
                        <div className="ui grid">
                            <div className="row">
                                <div className="sixteen wide center aligned padded column">
                                    <h1>{this.state.heading}</h1>
                                </div>
                            </div>

                            <div className="row">
                                <div className="sixteen wide column">
                                    <div className="ui form">
                                        <div className="ui grid">
                                            <div className="row">
                                                <div className="twelve wide column">
                                                    <label>* are required fields. Please enter all required fields.</label>
                                                    <h5>
                                                        *Title:
                                                    </h5>
                                                    <ChildSingleInput
                                                        inputType="text"
                                                        name="title"
                                                        value={this.state.jobData.title}
                                                        controlFunc={this.updateStateData}
                                                        maxLength={80}
                                                        placeholder="Enter a title for your job"
                                                        errorMessage={this.state.formErrors?.title || ''}
                                                        isError={!!this.state.formErrors?.title}
                                                    />
                                                    <h5>
                                                        *Description:
                                                    </h5>
                                                    <JobDescription
                                                        description={this.state.jobData.description}
                                                        controlFunc={this.updateStateData}
                                                        errorMessage={this.state.formErrors?.description || ''}
                                                        isError={!!this.state.formErrors?.description}
                                                    />
                                                    <br />
                                                    <h5>
                                                        *Summary:
                                                    </h5>
                                                    <JobSummary
                                                        summary={this.state.jobData.summary}
                                                        updateStateData={this.updateStateData}
                                                        errorMessage={this.state.formErrors?.summary || ''}
                                                        isError={!!this.state.formErrors?.summary}
                                                    />
                                                    <br />

                                                    <br />
                                                    <JobApplicant
                                                        applicantDetails={this.state.jobData.applicantDetails}
                                                        updateStateData={this.updateStateData}
                                                    />
                                                    <br />
                                                </div>
                                                <div className="four wide column">
                                                    <JobDetailsCard
                                                        expiryDate={this.state.jobData.expiryDate}
                                                        jobDetails={this.state.jobData.jobDetails}
                                                        updateStateData={this.updateStateData}
                                                        createClick={this.addUpdateJob}
                                                        formErrors={this.state.formErrors}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <br />
                    <br />
                </section>
            </BodyWrapper>
        );
    }
}

export default withRouter(CreateJob);
