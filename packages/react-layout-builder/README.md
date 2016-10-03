## react-form-builder

### Installation

`$ npm install --save react-form-builder` 

#### API Description

```javascript
export const layout = (...children) => 
	<Wrapper>{makeSections(children)}</Wrapper>;

export const section = (header, ...children) => 
	<Section>{header}{makeRows(children)}</Section>;

export const column = (renderField, colType, ...childrenNames) =>
	<Column>{makeColumns(colType, childrenNames)}</Column>;
```
#### Usage `{layout, section, col} : {function}`

```javascript
import {
	layout, 
	section, 
	col
} from 'react-layout-builder';

export default class AnotherLayout extends React.Component {
	render () {
	    const renderField = (name) => (props) => 
	    	<input name={props.name} value={props.value} />;
	    const c = col(this, renderField);
	    const hidden = (name, value) => <input type={name} value={value} />
	
	    return layout(
	        section('Header 1',
	            c('col-xs-6', 'first name', 'last name') 
	        ),
	        section('Header 2',
	            [c('col-xs-6', 'street'), c('col-xs-3', 'city', 'state')], 
	            [c('col-xs-6', 'country', 'zip')]
	        ),
        	hidden('secret', 'fish'))
	}
}
```