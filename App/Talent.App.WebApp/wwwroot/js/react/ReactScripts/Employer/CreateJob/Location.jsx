import React from "react";
import { countries } from "../common.js";

export class Location extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            country: props.location?.country || "",
            city: props.location?.city || "",
        };
        this.handleChange = this.handleChange.bind(this);
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (
            nextProps.location?.country !== prevState.country ||
            nextProps.location?.city !== prevState.city
        ) {
           // console.log("🔄 Syncing state with props:", nextProps.location);
            return {
                country: nextProps.location.country || "",
                city: nextProps.location.city || "",
            };
        }
        return null;
    }

    handleChange(event) {
        const { name, value } = event.target;
        this.setState({ [name]: value }, () => {
            let updatedLocation = {
                ...this.props.location,
                [name]: value,
            };

            if (name === "country") {
                updatedLocation.city = "";
                this.setState({ city: "" });
            }

            this.props.handleChange({
                target: { name: "location", value: updatedLocation },
            });
        });
    }

    render() {
        const { country, city } = this.state;

      //  console.log("📌 Rendering Location - Selected Country:", country);
       // console.log("📌 Rendering Location - Selected City:", city);

        // ⏳ Wait for props before rendering dropdowns
        if (!this.props.location || !this.props.location.country) {
            return <div>Loading location...</div>;
        }

        const countriesOptions = Object.keys(countries).map((c) => (
            <option key={c} value={c}>
                {c}
            </option>
        ));

        let citiesOptions = [];
        if (country && countries[country]) {
            citiesOptions = countries[country].map((c) => (
                <option key={c} value={c}>
                    {c}
                </option>
            ));
        }

        return (
            <div>
                <select
                    className="ui dropdown"
                    name="country"
                    value={country}
                    onChange={this.handleChange}
                >
                    <option value="">Select a country</option>
                    {countriesOptions}
                </select>

                <div style={{ marginBottom: "5px", marginTop: "5px" }}></div>

                {country && citiesOptions.length > 0 && (
                    <select
                        className="ui dropdown"
                        name="city"
                        value={city}
                        onChange={this.handleChange}
                    >
                        <option value="">Select a city</option>
                        {citiesOptions}
                    </select>
                )}
            </div>
        );
    }
}
