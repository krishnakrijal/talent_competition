import React from 'react';
import { Icon, Dropdown, Accordion, AccordionTitle } from 'semantic-ui-react';

const sortOptions = [
    { key: 'desc', text: 'Newest First', value: 'desc' },
    { key: 'asc', text: 'Oldest First', value: 'asc' }
];

export default class ManageJobsFilter extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            filterDropdownOpen: false,
            sortDropdownOpen: false,
        }
        this.handleAccordionClick = this.handleAccordionClick.bind(this);
        this.handleFilterChange = this.handleFilterChange.bind(this);
        this.handleSortChange = this.handleSortChange.bind(this);
        this.toggleFilterDropdown = this.toggleFilterDropdown.bind(this);
        this.toggleSortDropdown = this.toggleSortDropdown.bind(this);
    }

    handleAccordionClick(e, titleProps) {
        const { index } = titleProps;
        const activeIndex = this.props.activeIndex;
        const newIndex = activeIndex === index ? -1 : index; // Toggle between open and closed

        this.props.handleAccordionClick(newIndex);
    };

    handleFilterChange(event, data) {
        //const data = Object.assign({}, this.state.filter)
        //data[event.target.name] = event.target.value
        const newFilter = {};

        const filter = this.props.filter || {};

        Object.keys(filter).forEach(status => {
            if (data.value.includes(status)) {
                newFilter[status] = true;
            } else {
                newFilter[status] = false;
            }
        });
        this.props.handleFilterChange(newFilter);
    }

    handleSortChange(event, data) {
        this.props.handleSortChange(data.value);
    }

    toggleFilterDropdown() {
        this.setState(prevState => ({
            filterDropdownOpen: !prevState.filterDropdownOpen
        }));
    }

    toggleSortDropdown() {
        this.setState(prevState => ({
            sortDropdownOpen: !prevState.sortDropdownOpen
        }));
    }

    render() {
        const filter = this.props.filter;
        const filterOptions = Object.keys(filter).map(key => ({
            key,
            text: key,
            value: key
        }));

        const filterValue = Object.keys(filter).filter(key => filter[key]);
        const sortValue = this.props.sortBy.date;
        const sortOptionSelected = sortOptions.find(option => option.value === sortValue);
        const sortText = sortOptionSelected ? sortOptionSelected.text : '';

        return (
            <div className="ui grid">
                <div className="ui row">
                    <div className="ui column" style={{ display: 'flex', alignItems: 'center' }}>
                        <div className="ui column">
                            <Accordion>
                                <AccordionTitle
                                    active={this.props.activeIndex === 0} // Only active when this section is open
                                    index={0}
                                    onClick={this.handleAccordionClick}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <Icon name="filter" />
                                    <span style={{ marginLeft: '5px' }}>Filter:&nbsp;</span>
                                    <strong>Choose filter</strong>
                                    <Icon name={this.props.activeIndex === 0 ? 'angle up' : 'angle down'} />
                                </AccordionTitle>

                                <Accordion.Content active={this.props.activeIndex === 0}>
                                    <div onClick={this.toggleFilterDropdown}>
                                        <Dropdown
                                            fluid
                                            multiple
                                            selection
                                            options={filterOptions}
                                            value={filterValue}
                                            onChange={this.handleFilterChange}
                                            open={this.state.filterDropdownOpen}
                                        />
                                    </div>
                                </Accordion.Content>
                            </Accordion>
                        </div>
                        <div className="ui column">
                            <Accordion>
                                <AccordionTitle
                                    active={this.props.activeIndex === 1} // Only active when this section is open
                                    index={1}
                                    onClick={this.handleAccordionClick}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <Icon name="calendar" />
                                    <span style={{ marginLeft: '5px' }}>Sort by date:&nbsp;</span>
                                    <strong>{sortText}</strong>
                                    <Icon name={this.props.activeIndex === 0 ? 'angle up' : 'angle down'} />
                                </AccordionTitle>
                                <Accordion.Content active={this.props.activeIndex === 1}>
                                    <div onClick={this.toggleSortDropdown}>
                                        <Dropdown
                                            placeholder='Newest First'
                                            fluid
                                            selection
                                            options={sortOptions}
                                            value={sortValue}
                                            onChange={this.handleSortChange}
                                            open={this.state.sortDropdownOpen}
                                        />
                                    </div>
                                </Accordion.Content>
                            </Accordion>
                        </div>

                    </div>
                </div>
            </div>
        );
    }
}