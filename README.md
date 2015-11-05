# react-form-layout [![Build Status](https://travis-ci.org/alvinsj/react-form-layout.svg)](https://travis-ci.org/alvinsj/react-form-layout) [![npm version](https://badge.fury.io/js/react-form-layout.svg)](https://badge.fury.io/js/react-form-layout)

A form layout generator for your [React](https://facebook.github.io/react/) components.

Using [bootstrap](http://getbootstrap.com/) css layout by default, and custom rendering is also allowed. (e.g. section, column, field, etc) 

## Create `<Form />`

    create(Field, inputPropsLookupFn, fullLayoutFn, shortLayoutFn, buttons)

Argument           | Type            | Example
:-----------       | :-----------    | :-----------
`Field`              | Component     | `<Field name="primary" type="email" />`
`inputPropsLookupFn` | function:object| `(name) => {primary: {type: 'email' }}[name]`
`fullLayoutFn`       | function:ReactElement     | refer to `__tests__/` for usage
`shortLayoutFn`      | function:ReactElement     | refer to `__tests__/` for usage
`buttons`            | ReactElement  | `<input type="submit" />`

#### Example Usage

   	let Field = class extends React.Component {
   		    render () { return <input {...this.props} />; }
   	    },
   	    inputPropsLookupFn = (n) => { return {name: {type: 'text'}}[n]; },
   	    fullLayoutFn = (builder, props) => {
   			let {layout, section, col} = builder;
   			return layout(props, 
   				section("Personal details",
   					[ col(12, 'name') ]
   				)
   			);
   		}, 
   		shortLayoutFn = fullLayoutFn,
   		buttons = <input type="submit" />;
   
    let Form = create(Field, inputPropsLookupFn, fullLayoutFn, shortLayoutFn, buttons);
    // <Form {...this.props} />

#### Configuration Props

Prop           | Type          | Description
:-----------       | :-----------          | :-----------
`renderLayout`     | function:ReactElement | overriding render fn for root/layout
`renderSection`    | function:ReactElement | overriding render fn for section
`renderCol`        | function:ReactElement | overriding render fn for column
`renderField`      | function:ReactElement | overriding render fn for field
`renderHidden`     | function:ReactElement | overriding render fn for hidden field
`showAll`          | boolean               | determine fulllayout/shortLayout 
`defaultValues`    | object                | initial values for the form fiels

	 

## Helper functions

### Input props lookup function

    inputPropsLookup(fields, fieldName)  
    
Argument    | Type        | Example
:-----------| :-----------| :-----------
`fields`      | object      | `{name: {type: 'text'}, email: {type: 'email'}}`
`fieldName`   | string      | `name`, `email[0]`, `email[1]`



### Input values lookup function

    inputValuesLookup(values, fieldName)  
    
Argument    | Type        | Example
:-----------| :-----------| :-----------
`values`      | object      | `{address: [ {zip: '55555'} ]}`
`fieldName`   | string      | `address[0][zip]`


### Form input serialization function 

    formInputsSerialize(form)  
    
Argument    | Type        | Example
:-----------| :-----------| :-----------
`form`      | DOMNode      | `ReactDOM.findDOMNode(this.refs.form)`

## License
MIT