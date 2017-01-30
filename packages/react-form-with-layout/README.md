# react-form-with-layout

`<FormWithLayout />` is a React component to help build the form fields and its layout.

## Usage

A stateful component is necessary in order to keep a refernce to the rendered form element.

```javascript
import {FormWithLayout} from 'react-form-with-layout';
import {formInputsSerialize } from 'form-input-serialize';

class FeedbackForm extends React.Component {
    construct(props) {
        super(props);
        this.form = null;
    }

    render(props) {
        return <FormWithLayout
            ref={(c) => this.form = c}
            renderLayout={this.renderLayout}
            getFieldProps={this.getFieldProps}
            renderField={(name, fieldProps) => <input type={} name={} defaultValue={}}
            defaultValues={this.props.values} />;
    }

    layout(builder) {
        const {layout, section} = builder;
        const col = (type, ...children) => builder.col(`col-xs-${type}`, ...children);

        return layout(
            section('Section 1',
                [col(6, 'first_name', 'last_name')], // first row: two 6 cols
                [col(5, 'email', 'id_no'), col(2, 'age')], // second row: two 5 cols, one 2 cols
                <button onClick={this.submit(this.form)}>Submit</button>
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

    renderField(name, fieldProps) {
        return <input type={} name={} defaultValue={} />;
    }

    submit(form) {
        this.props.onSubmit(formInputsSerialize(form));
    }
}
```

#### Component's propTypes
```
FormWithLayout.propTypes = {
	renderLayout: React.PropTypes.func.isRequired,
	getFieldProps: React.PropTypes.func.isRequired,
	renderField: React.PropTypes.func.isRequired,
		
	renderButtons: React.PropTypes.func,
	renderExpandedLayout: React.PropTypes.func
};
```
