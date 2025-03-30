import React from "react";
import { jobCategories } from "../common.js";

export class JobCategories extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            category: props.categories?.category || "",
            subCategory: props.categories?.subCategory || "",
        };
        this.handleChange = this.handleChange.bind(this);
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (
            nextProps.categories?.category !== prevState.category ||
            nextProps.categories?.subCategory !== prevState.subCategory
        ) {
           // console.log("🔄 Syncing state with props:", nextProps.categories);
            return {
                category: nextProps.categories.category || "",
                subCategory: nextProps.categories.subCategory || "",
            };
        }
        return null;
    }

    handleChange(event) {
        const { name, value } = event.target;
        this.setState({ [name]: value }, () => {
            let updatedCategories = {
                ...this.props.categories,
                [name]: value,
            };

            if (name === "category") {
                updatedCategories.subCategory = "";
                this.setState({ subCategory: "" });
            }

            this.props.handleChange({
                target: { name: "categories", value: updatedCategories },
            });
        });
    }

    render() {
        const { category, subCategory } = this.state;

       // console.log("📌 Rendering JobCategories - Selected Category:", category);
        //console.log("📌 Rendering JobCategories - Selected SubCategory:", subCategory);

        // ⏳ Wait for props before rendering dropdowns
        if (!this.props.categories || !this.props.categories.category) {
            return <div>Loading categories...</div>;
        }

        // Generate category options
        const categoryOptions = jobCategories.map((x) => (
            <option value={x.Name} key={x.Code}>
                {x.Name}
            </option>
        ));

        // Generate sub-category options based on selected category
        let subCatList = [];
        if (category) {
            subCatList = jobCategories
                .find((x) => x.Name === category)
                ?.SubCategories.map((x) => (
                    <option value={x.Name} key={x.Code}>
                        {x.Name}
                    </option>
                ));
        }

        return (
            <div>
                <select
                    className="ui dropdown"
                    name="category"
                    value={category}
                    onChange={this.handleChange}
                >
                    <option value="">Select a category</option>
                    {categoryOptions}
                </select>

                <div style={{ marginBottom: "5px", marginTop: "5px" }}></div>

                {category && subCatList.length > 0 && (
                    <select
                        className="ui dropdown"
                        name="subCategory"
                        value={subCategory}
                        onChange={this.handleChange}
                    >
                        <option value="">Select a subcategory</option>
                        {subCatList}
                    </select>
                )}
            </div>
        );
    }
}
