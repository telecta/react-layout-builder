# react-form-with-layout

`<FormWithLayout />` is a React component to help build the form fields and its layout.

## Usage

A stateful component is necessary in order to keep a refernce to the rendered form element.

```javascript
import React from 'react';
import {FormWithLayout} from 'react-form-with-layout';
import {formInputsSerialize } from 'form-input-serialize';

class FeedbackForm extends React.Component {
    construct(props) {
        super(props);
        this.form = null;
        this.submit = this.submit.bind(this);
    }

    render(props) {
        return <FormWithLayout
            ref={(component) => this.form = component.form}
            renderLayout={this.layout}
            getFieldProps={this.fieldProps}
            renderField={this.renderField}
            defaultValues={this.props.values} />;
    }

    layout(builder) {
        const {layout, section} = builder;
        const col = (type, ...children) => builder.col(`col-xs-${type}`, ...children);

        return layout(
            section('Section 1',
                [col(6, 'first_name', 'last_name')], // first row: two 6 cols
                [col(5, 'email', 'id_no'), col(2, 'age')], // second row: two 5 cols, one 2 cols
                <button onClick={this.submit}>Submit</button>
            )
        );
    }

    fieldProps(name) {
        return {
            first_name: { type: 'text' },
            last_name: { type: 'text' },
            email: { type: 'email' },
            id_no: { type: 'text' },
            age: { type: 'number' }
        }[name];
    }

    renderField(name, props) {
        return <input type={props.type} name={props.name} defaultValue={props.defaultValue} />;
    }

    submit(event) {
        event.preventDefault();
        this.props.onSubmit(formInputsSerialize(this.form));
    }
}

FeedbackForm.propTypes = {
    values: React.PropTypes.object.isRequired,
    onSubmit: React.PropTypes.func.isRequired
}
```
