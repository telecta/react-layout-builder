# react-form-utils

[![Build Status](https://travis-ci.org/blacktangent/react-layout-builder.svg?branch=master)](https://travis-ci.org/blacktangent/react-layout-builder)

`react-form-utils` provides helper functions to retrieve form props and form values

```
import {inputPropsLookup, inputValueLookup, formSerialize} from 'react-form-utils';
```

### `inputPropsLookup(fieldsProps, fieldName) `

Argument    | Type        | Example
:-----------| :-----------| :-----------
`fieldsProps`      | `object`      | `{name: {type: 'text'}, email: {type: 'email'}}`
`fieldName`   | `string`      | `name`, `email[0]`, `email[1]`

#### returns
`object`: props, e.g. `{type: 'text'}`

#### e.g.
```js
const fieldsProps = {
  name: { type: 'text' },
  age_group: {
    type: 'select',
    size: 4,
    options: []
  }
  address: {
    type: 'nested',
    fields: {
      street: {
        type: 'text'
      }
    }
  }  
};
const fieldName = 'address[0][street]';

const props = inputPropsLookup(fieldsProps, fieldName);
// <input name={fieldName} {...props} />
```

### `formSerialize(form)`

    formSerialize(form)  

Argument    | Type        | Example
:-----------| :-----------| :-----------
`form`      | `DOMNode`      | `form` element

#### returns
`object`. serialized, e.g. `{type: 'text'}`

#### e.g.
```js
// <form ref={f => this.form =f}><input name="message" value="hello"/></form>

const values = formSerialize(this.form);
// { message: 'hello' }

```

### `inputValueLookup(values, fieldName) `

Argument    | Type        | Example
:-----------| :-----------| :-----------
`values`      | `object`      | `{address: [ {zip: '55555'} ]}`
`fieldName`   | `string`      | `address[0][zip]`

#### returns
`any`. input value, e.g. `{type: 'text'}`

#### e.g.
```js
const values = {
  name: 'Ali',
  age_group: '31-40'
  address: {
    0: {
      street: '13 Calle 49a'
     }
};
const fieldName = 'address[0][street]';

const value = inputValueLookup(values, fieldName);

// <input name={fieldName} value={value} />
```
