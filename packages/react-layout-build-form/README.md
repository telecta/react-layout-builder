## react-layout-build-form

#### API Description
```javascript
export class FormWithLayout extends React.Component {
	static get 
	
	render () {
		return computeLayout(...);
	}
};
FormWithLayout.propTypes = {
	renderLayout: React.PropTypes.func.isRequired,
	getFieldProps: React.PropTypes.func.isRequired,
	renderField: React.PropTypes.func.isRequired,
		
	renderButtons: React.PropTypes.func,
	renderExpandedLayout: React.PropTypes.func
};


export const buildForm = (Base) => (props) =>
    <Base form={FormWithLayout} {...props}/>;
```

#### Usage `buildForm: function`
```javascript
import {buildForm} from 'react-layout-build-form';

class Base extends React.Component {
	render () {
	    const Form = this.props.form;
		return <Form 
			renderField={this.renderField}
			renderLayout={this.renderLayout} /> 
	}
	renderField (name) {
	    const inputProps = getFieldProps(name);
		return <input {...inputProps} />
	}
	renderLayout (builder) {
	   const {layout, section, col} = builder;
	   const hidden = (name, value) => 
	   		<input type='hidden' name={name} value={value} />;
	   		
		return layout(
	        section('Header 1',
	            col(6, 'name', 'dob') 
	        ),
	        section('Header 2',
	            col(3, 'street', 'street2', 'city'),
	            col(6, 'zip', 'country')
	        ),
	        hidden('secret', 'fish'));
	}
	getFieldProps (name) { 
		/* field props for field */
	}
}
export default buildForm(Base);

```