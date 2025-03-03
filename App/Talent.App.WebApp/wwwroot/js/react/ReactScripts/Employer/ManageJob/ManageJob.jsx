import React from 'react';
import Cookies from 'js-cookie';
import moment from 'moment';
import LoggedInBanner from '../../Layout/Banner/LoggedInBanner.jsx';
import { LoggedInNavigation } from '../../Layout/LoggedInNavigation.jsx';
import { JobSummaryCard } from './JobSummaryCard.jsx';
import { BodyWrapper, loaderData } from '../../Layout/BodyWrapper.jsx';
import { Pagination, Icon, Dropdown, Checkbox, Accordion, AccordionTitle, Form, Segment } from 'semantic-ui-react';
import Loading from '../../Layout/Loading.jsx';
import ManageJobsFilter from './ManageJobsFilter.jsx';
import JobEditNavigator from './JobEditNavigator.jsx';

export default class ManageJob extends React.Component {
    constructor(props) {
        super(props);
        let loader = loaderData
        loader.allowedUsers.push("Employer");
        loader.allowedUsers.push("Recruiter");
        //console.log(loader)
        this.state = {
            loadJobs: [],
            loaderData: loader,
            activePage: 1,
            jobsPerPage: 6,
            sortBy: {
                date: "desc"
            },
            filter: {
                showActive: true,
                showClosed: false,
                showDraft: true,
                showExpired: true,
                showUnexpired: true
            },
            totalJobs: 1,
            activeIndex: -1,
            copied: false
        }
        this.loadData = this.loadData.bind(this);
        this.init = this.init.bind(this);
        this.handleFilterChange = this.handleFilterChange.bind(this);
        this.handleAccordionClick = this.handleAccordionClick.bind(this);
        this.handleSortChange = this.handleSortChange.bind(this);
        //this.loadNewData = this.loadNewData.bind(this);
        //your functions go here
    };

    init() {
        let loaderData = TalentUtil.deepCopy(this.state.loaderData)
        this.setState({
            loaderData: {
                ...this.state.loaderData,
                isLoading: true
            }
        });
        //this.setState({ loaderData });//comment this

        //set loaderData.isLoading to false after getting data
        this.loadData(() =>
            this.setState({ loaderData })
        )

        //console.log(this.state.loaderData)
    }

    componentDidMount() {
        this.init();
        //this.loadNewData();
        
    };

    componentDidUpdate(prevPops, prevState) {
        if (JSON.stringify(prevState.filter) !== JSON.stringify(this.state.filter) ||
            prevState.sortBy.date !== this.state.sortBy.date ||
            prevState.activePage !== this.state.activePage) {
            this.loadData();
        }
    };
    loadData(callback) {
        const link = ` http://localhost:51689/listing/listing/getSortedEmployerJobs`;
        var cookies = Cookies.get('talentAuthToken');

        this.setState({
            loaderData: {
                ...this.state.loaderData,
                isLoading: true
            }
        })
        const params = {
            activePage: this.state.activePage,
            sortbyDate: this.state.sortBy.date,
            showActive: this.state.filter.showActive,
            showClosed: this.state.filter.showClosed,
            showDraft: this.state.filter.showDraft,
            showExpired: this.state.filter.showExpired,
            showUnexpired: this.state.filter.showUnexpired,
            limit: this.state.jobsPerPage
        };

        // your ajax call and other logic goes here
        $.ajax({
            url: link,
            headers: {
                'Authorization': 'Bearer ' + cookies,
                'Content-Type': 'application/json'
            },
            type: "GET",
            contentType: "application/json",
            dataType: "json",
            data: params,
            success: function (res) {
                if (res.success) {
                    let deletedJobs = JSON.parse(localStorage.getItem("deletedJobs")) || [];

                    res.myJobs.forEach((job, index) => {
                        res.myJobs[index].expiryDate = moment(job.expiryDate);
                    });

                    // Exclude deleted jobs
                    const filteredJobs = res.myJobs.filter(job => !deletedJobs.includes(job.id));

                    this.setState({
                        loadJobs: filteredJobs,
                        totalJobs: res.totalCount
                    });
                } else {
                    TalentUtil.notification.show(res.message, "error", null, null);
                }
                this.setState({
                    loaderData: {
                        ...this.state.loaderData,
                        isLoading: false
                    }
                });
            }.bind(this),
            error: (xhr, status, error) => {

                // Update state to hide the loader even on error
                this.setState({
                    loaderData: {
                        ...this.state.loaderData,
                        isLoading: false
                    }
                });
            }
        })
    }

    /*loadNewData(data) {
        var loader = this.state.loaderData;
        loader.isLoading = true;
        data[loaderData] = loader;
        this.setState(data, () => {
            this.loadData(() => {
                loader.isLoading = false;
                this.setState({
                    loadData: loader
                })
            })
        });
    }*/

    // Toggle Accordion section open/close
    handleAccordionClick(newIndex) {
        this.setState({ activeIndex: newIndex });
    };

    handleFilterChange(newFilter) {
        //also set the activePage: default: 1
        this.setState({
            filter: newFilter,
            activePage: 1
        })

    }

    handleSortChange(sortValue) {
        const sortTemp = { date: sortValue }
        this.setState({ sortBy: sortTemp });
    }

    handleActivePageChange = (activePageValue) => {
        this.setState({
            activePage: activePageValue
        })
    };

    handleClosejob = (jobId) => {
        const link = `http://localhost:51689/listing/listing/CloseJob`;
        var cookies = Cookies.get('talentAuthToken');

        $.ajax({
            url: link,
            headers: {
                'Authorization': 'Bearer ' + cookies,
                'Content-Type': 'application/json'
            },
            type: "POST",
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify(jobId),
            success: function (res) {
                if (res.success) {
                    // Get deleted jobs from localStorage
                    let deletedJobs = JSON.parse(localStorage.getItem("deletedJobs")) || [];

                    // Add current deleted job to the list
                    deletedJobs.push(jobId);

                    // Save updated list in localStorage
                    localStorage.setItem("deletedJobs", JSON.stringify(deletedJobs));

                    // Update state to reflect deletion
                    this.setState((prevState) => ({
                        loadJobs: prevState.loadJobs.filter(job => job.id !== jobId)
                    }));
                } else {
                    TalentUtil.notification.show(res.message, "error", null, null);
                }
            }.bind(this)
        });
    };

    handlePaginationChange = (e, { activePage }) => {
        this.handleActivePageChange(activePage);
    };

    render() {
        if (this.state.loaderData.isLoading) {
            return <Loading />;
        }

        return (
            <BodyWrapper reload={this.init} loaderData={this.state.loaderData}>
                <div className="ui container">
                    <section className="page-body">
                        <div className="ui container">
                            <h5>List of Jobs</h5>
                            <ManageJobsFilter
                                filter={this.state.filter}
                                activeIndex={this.state.activeIndex}
                                sortBy={this.state.sortBy}
                                handleAccordionClick={this.handleAccordionClick}
                                handleFilterChange={this.handleFilterChange}
                                handleSortChange={this.handleSortChange}
                            />
                            {this.state.loadJobs.length > 0 ? (<JobEditNavigator
                                paginatedJobs={this.state.loadJobs}
                                activePage={this.state.activePage}
                                jobsPerPage={this.state.jobsPerPage}
                                totalJobs={this.state.totalJobs}
                                handleActivePageChange={this.handleActivePageChange}
                                handleClosejob={this.handleClosejob}
                                handleCopyJobData={this.handleCopyJobData}
                            />) : (
                                <span>No Jobs Found</span>
                            )}
                        </div>
                        <div className="ui grid" >
                            <div className="ui centered row" style={{ marginTop: '20px' }}>
                                <div className="ten wide column">
                                    <Pagination
                                        ellipsisItem={null}
                                        activePage={this.state.activePage}
                                        totalPages={Math.ceil(this.state.totalJobs / this.state.jobsPerPage)}
                                        onPageChange={this.handlePaginationChange}
                                    />
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </BodyWrapper>
        )
    }
}