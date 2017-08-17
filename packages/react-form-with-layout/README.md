# `<FormWithLayout />`

[![Build Status](https://travis-ci.org/blacktangent/react-layout-builder.svg?branch=master)](https://travis-ci.org/blacktangent/react-layout-builder)

`<FormWithLayout />` is a React component to facilitate building of the form fields with a fixed layout.

## Usage

```
$ yarn add react-form-with-layout
```

```
import FormWithLayout from 'react-form-with-layout';
```

### PropTypes
Argument    | Type        | Example
:-----------| :-----------| :-----------
`renderLayout `| `function(builder)`| required. renders layout
`getFieldProps `| `function(name)`      | required. retrieves field props
`renderField `| `function(name, props)`      | required. renders field
`defaultValues `| `object`      | required. values of the form fields
`onSubmit `| `function(e)`      | required. handles form submission
`renderExpandedLayout` | `function(builder)` | similar to `renderLayout`, for layout with more fields
`showAll` | `boolean` | hide/show fields. if it's false, use `renderLayout`. otherwise, use `renderExpandedLayout`
`renderButtons` | `function(props)` | renders buttons at the bottom of form

### Example

```jsx
import React from 'react';
import FormWithLayout from 'react-form-with-layout';
import {formSerialize} from 'react-form-utils';

class FormContainer extends React.Component {
    constructor(props){
        super(props);
        this._handleSubmit = this._handleSubmit.bind(this);
        this.state = {
            values: null,
            errorMessage: null
        };
    }

    render(){
        return (
            <div>
                {this.state.errorMessage}
                <FeedbackForm onSubmit={this._handleSubmit} defaultValues={this.state.defaultValues} />
            </div>);
    }

    _handleSubmit(e){
        if(e) e.preventDefault();

        const values = formSerialize(e.target);
        this.setState({defaultValues: values});

        this.props.postToServer(
            values
        ).then((res) => {
            // navigateToSummary();
        }).catch((err) => {
            this.setState({errorMessage: err.message});
        }});
    }
}

const FeedbackForm = (props) => {
    const renderlayout = (builder) => {
        const {layout, section} = builder;
        const col = (type, ...children) => builder.col(`col-xs-${type}`, ...children);

        return layout(
            section('Section 1',
                [col(6, 'first_name', 'last_name')], // first row: two 6 cols
                [col(5, 'email', 'id_no'), col(2, 'age')], // second row: two 5 cols, one 2 cols
                <button key="submit" onClick={this.submit}>Submit</button>
            )
        );
    };

    const getFieldProps = (name) => {
        return {
            first_name: { type: 'text' },
            last_name: { type: 'text' },
            email: { type: 'email' },
            id_no: { type: 'text' },
            age: { type: 'number' }
        }[name];
    };

    const renderField = (name, fieldProps) => {
        return <input
              key={name}
              type={fieldProps.type}
              name={fieldProps.name}
              defaultValue={fieldProps.defaultValue} />;
    };

    const {defaultValues, onSubmit} = props;
    const formProps = {
        renderLayout,
        getFieldProps,
        renderField,
        defaultValues,
        onSubmit
    };

    return <FormWithLayout {...formProps} />;
}

FeedbackForm.propTypes = {
    defaultValues: PropTypes.object.isRequired,
    onSubmit: PropTypes.func.isRequired
}
```

### DSL for layout
`builder` provides `{layout, section, col}` as helpers. e.g.

```jsx
const {layout, section} = builder;
const col = (type, ...children) =>
    builder.column(`col-${type}`, ...children);

return layout(
    section('Section 1',
        [col(6, 'first_name', 'last_name')], // first row
        [col(5, 'email', 'id_no'), col(2, 'age')], // second row
        <button key="submit" onClick={this.submit}>Submit</button> // regular
    )
);

```

#### builder.`layout`
```jsx
/*
 * @param {node} mainHeader
 * @param {node} section
 * @return {node}
 */
layout(mainHeader, section, section, ...)
// <div className="layout">{sections}</div>
```
#### builder.`section`
```jsx
/*
 * @param {node} sectionHeader
 * @param {node} row
 * @return {node}
 */
section(sectionHeader, row, row, row, ...)
// <section className="section">{rows}</section>
```

#### builder.`col`
```jsx
/*
 * @param {string} className - the group identifier for all columns within.
 * @param {string} fieldName - the name for lookup with `getFieldProps`+`renderField`
 * @return {node}
 */
builder.col(className, fieldName, fieldName, fieldName, ...)

// override the default arguments
const col = (type, ...children) =>
    builder.column(`col-${type}`, ...children);

col('6', fieldName, fieldName, fieldName, ...)
// <div className="col-6">
//   {renderField(fieldName, getFieldProps(name))}
// </div>

```
