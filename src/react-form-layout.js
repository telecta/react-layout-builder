/*
The MIT License (MIT)

Copyright (c) 2015 Alvin S.J. Ng

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

import React from 'react';
import cx from 'classnames';
import assign from 'object.assign';
import humanize from './utils/humanize';
import serialize, {hash_serializer} from './utils/form-serialize';

export function create(FormField, $inputPropsLookup, $fullLayout, $shortLayout, $buttons){
    return class Form extends React.Component {

        constructor(props, context) {
            super(props, context);
            this._refs = {};
            this._f = {};

            this.layoutCount = 0;
            this.sectionCount = 0;

            this.builder = {
                layout: this.renderLayout.bind(this),
                section: this.renderSection.bind(this),
                col: this.renderCol.bind(this),
                hidden: this.renderHiddenField.bind(this)
            }

            this.renderForm = this.renderForm.bind(this);
            this.renderField = this.renderField.bind(this);
            this._isMounted = false;

            this.renderFullLayout = this.renderFullLayout.bind(this);
            this.renderShortLayout = this.renderShortLayout.bind(this);
            this._fullLayout = null;
            this._shortLayout = null;
        }

        componentDidMount () {
            this._isMounted = true;
        }

        render () {
            return this.renderForm(
        		{action:this.props.action, method: this.props.method, onSubmit: this.onSubmit},
        		this.props.showAll ?
                    this.renderFullLayout(this.props)
                    : this.renderShortLayout(this.props));
        }

        renderFullLayout (props) {
            if(!this._fullLayout) {
                this._fullLayout = $fullLayout(this.builder, props);
                return this._fullLayout;
            }
            else{
                return React.cloneElement(this._fullLayout, props);
            }
        }

        renderShortLayout (props) {
            if(!this._shortLayout) {
                this._shortLayout = $shortLayout(this.builder, props);
                return this._shortLayout;
            }
            else{
                return React.cloneElement(this._shortLayout, props);
            }
        }

        renderForm (props, children) {
            return <form ref="form" {...props} className="form-horizontal">
                {children}
                {$buttons ? $buttons : <div />}
            </form>;
    	}

    	renderField (name) {
            if(this.props.renderField) return this.props.renderField.apply(this, arguments);

    		var value = inputValueLookup(this.props.values || {}, name);
            var defaultValue = inputValueLookup(this.props.defaultValues || {}, name);
            var error = this.props.errors ? this.props.errors[name] : null;
            var def = $inputPropsLookup(name);

            // field overriding form defaultValues
            defaultValue = def['defaultValue'] || defaultValue;
            var disabled = def['disabled'] || this.props.disabled;

            var label = def["label"] ? def.label : name;
            label = humanize(label);

            var refName = this.getFieldRef(name);

            var Field = FormField;
            if(def["input"]) Field = def["input"];

            let fieldProps = assign({}, def, {
                ref: refName,
                key: refName,
                field: def,
                name: name,
                value: value,
                defaultValue: defaultValue,
                label: label,
                error: error,
                disabled: disabled
            });

            if(this._f[refName]){
                return React.cloneElement(this._f[refName], fieldProps);
            }
            else{
                this._f[refName] = <Field {...fieldProps} />;
                return this._f[refName];
            }
    	}
        /** contextual features */
        onSubmit (e) {
            if(e) e.preventDefault();
        }

    	renderLayout () {
            if(this.props.renderLayout) return this.props.renderLayout.apply(this, arguments);

    		var children = Array.prototype.slice.bind(arguments)(1);
    		return <div key={"layout-"+this.layoutCount++} className="layout">{children}</div>;
    	}

    	renderSection (name) {
            if(this.props.renderSection) return this.props.renderSection.apply(this, arguments);

    		var rows = Array.prototype.slice.bind(arguments)(1);
    		rows = rows.map((cols, index) => {
    			return <div key={"columns-"+index} className="columns section">{cols}</div>;
    		});

    		return (
                <div key={"section-"+this.sectionCount++}>
                    {name && name !== ''? <h5>{name}</h5> : <div />}
                    {rows}
                </div>);
    	}

    	renderCol (type) {
            if(this.props.renderCol) return this.props.renderCol.apply(this, arguments);

    		var fields = Array.prototype.slice.bind(arguments)(1);
    	    if(fields.length == 0) return <div className="col-sm-1" />
    		return fields.map((field, index) => {
    			return <div key={"col-"+index} className={"col-sm-"+type}>{this.renderField(field)}</div>
    		});
    	}

    	renderHiddenField (name, value) {
            if(this.props.renderHiddenField) return this.props.renderHiddenField.apply(this, arguments);

            var def = $inputPropsLookup(name);

            var refName = this.getFieldRef(name);
            return <input ref={refName} key={refName} type="hidden" value={value || def.value} name={name} />
        }

        getFieldRef (name) {
            var refName = 'field-'+name;
            var count = this._refs[refName];

            if(!this._isMounted)
                this._refs[refName] = count ? count+1 : 1;

            count = this._refs[refName];
            refName = refName + (count == 1 ? "" : "-"+ (this._refs[refName]-1));
            return refName;
        }
    }
}

export function inputPropsLookup (inputProps, inputName){
    var props = inputProps[inputName];
    if(props) return assign({label: inputName}, props); // props found, easy.

    var inputNameTree = hash_serializer({}, inputName, null);
    var attrName = Object.keys(inputNameTree)[0]; // inputName describes only single path

    props = inputProps[attrName];

    if( !isNaN(parseInt(attrName)) ){ // skip number
        props = inputProps;
    }else if(props && props['type'] == 'nested'){ // continue with nested props
        props = props['fields'];
    }else if(props){
        return props;
    }else throw (inputName+': props cannot be found.');

    var newInputName = inputName.replace(attrName, '');
    var nextAttrName =  Object.keys(inputNameTree[attrName])[0];

    // remove bracket
    newInputName = newInputName.replace('['+nextAttrName+']', '');
    newInputName = nextAttrName + newInputName;

    return inputPropsLookup(props, newInputName);
};

export function inputValueLookup(serializedValues, inputName){
    if(!serializedValues || Object.keys(serializedValues).length == 0) return null;

    var value = serializedValues[inputName];
    if(value) return value; // value found, easy.

    // try to serialize and traverse
    var inputNameTree = hash_serializer({}, inputName, null);
    var attrName = Object.keys(inputNameTree)[0]; // inputName describes only single path

    var next = inputNameTree[attrName];
    if(next == null) return null; // if it's already leaf, then no chance to be found.

    var nextAttrName =  Object.keys(next)[0];
    var newInputName = inputName.replace(attrName, '');

    // remove bracket
    newInputName = newInputName.replace('['+nextAttrName+']', '');

    if(newInputName === '') return serializedValues[attrName][nextAttrName];
    newInputName = nextAttrName + newInputName;

    var nestedValues = serializedValues[attrName];
    return inputValueLookup(nestedValues, newInputName);
}

export function formInputsSerialize(form){
    return serialize(form, {hash: true});
}
