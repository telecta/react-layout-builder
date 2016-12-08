## react-form-with-layout

`<FormWithLayout />` is a React component to help build the form fields and its layout.

#### Usage 
```javascript
import {FormWithLayout} from 'react-form-with-layout';

class FeedbackForm extends React.Component {
	render () {
		const formProps = {
		    renderLayout: this.renderLayout,
            getFieldProps: this.getFieldProps,
            renderField: (name, fieldProps) => <input {...fieldProps} />,
            
            renderButtons: null
            renderExpandedLayout: null
        };
        
	    return <FormWithLayout {...formProps} />; 
	}
    
    renderLayout (builder) {
        const {layout, section} = builder;
        const col = (type, ...children) => builder.col(`col-xs-${type}`, ...children);
        
        return layout(
            section('Section 1', 
                [col(6, 'first_name', 'last_name')], // first row: two col-xs-6
                [col(5, 'email', 'id_no'), col(2, 'age')] // second row: two col-xs-5, one col-xs-2 
            )
        );
    }
    
    getFieldProps (name) {
        return {
            first_name: { type: 'text' }, 
            last_name: { type: 'text' },
            email: { type: 'email' },
            id_no: { type: 'text' },
            age: { type: 'number' }
        }[name];
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
