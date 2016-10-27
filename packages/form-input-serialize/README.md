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
`form`      | DOMNode      | `ReactDOM.findDOMNode(this.form)`
