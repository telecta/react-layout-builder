# react-form-with-layout

`<FormWithLayout />` is a React component to help build the form fields and its layout.

## Usage

A stateful component is necessary in order to keep a reference to the rendered form element.

```javascript
import React from 'react';
import FormWithLayout from 'react-form-with-layout';
import {formInputsSerialize} from 'form-input-serialize';

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
                <FeedbackForm onSubmit={this._handleSubmit} />
            </div>);
    }

    _handleSubmit(e){
        if(e) e.preventDefault();

        const values = formInputsSerialize(e.target);
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
    const {defaultValues, onSubmit} = props;

    const renderlayout = (builder) => {
        const {layout, section} = builder;
        const col = (type, ...children) => builder.col(`col-xs-${type}`, ...children);

        return layout(
            section('Section 1',
                [col(6, 'first_name', 'last_name')], // first row: two 6 cols
                [col(5, 'email', 'id_no'), col(2, 'age')], // second row: two 5 cols, one 2 cols
                <button onClick={this.submit}>Submit</button>
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

    const renderField = (name, props) => {
        return <input
              type={props.type}
              name={props.name}
              defaultValue={props.defaultValue} />;
    };

    var form;
    const formProps = {
        ref: (component) => (form = component.form),
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

### renderLayout
```
layout(mainHeader, section, section, ...)
// @param {element or string} mainHeader
// @param {element} section
// @return {element}

section(sectionHeader, row, row, row, ...)
// @param {element or string} sectionHeader
// @param {element} row
// @return {element}

const col = (type, ...children) =>
    builder.column(`col-${type}`, ...children);

col(count, fieldName, fieldName, fieldName, ...)
// @param {string} count - the group identifier for all columns within.
// @param {string} fieldName - the name for lookup with `getFieldProps`+`renderField`
// @return {element}
// builder.column has `renderField`+`getFieldProps` in context, to help us build elements.
```
