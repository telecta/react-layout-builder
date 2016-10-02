import React from 'react';
import assign from 'object.assign';
// import humanize from './utils/humanize';
import serialize, {hash_serializer} from './utils/form-serialize';

var layoutCount = 0;
const renderLayout = (...children) => {
    return <div key={`layout-${layoutCount++}`} className="layout">{children}</div>;
};

var sectionCount = 0;
const renderSection = (name, ...rows) => {
    const renderedRows = rows.map((cols, index) => {
        return <div key={`columns-${index}`} className="columns">{cols}</div>;
    });
    return (
        <div key={`section-${sectionCount++}`} className="section">
            {name && name !== ''? <h5>{name}</h5> : <div />}
            {renderedRows}
        </div>);
};

const renderCol = (renderField, type, ...fields) => {
    if(fields.length == 0) return <div className="column col-sm-1" />;
    return fields.map((field, index) => {
        return (
        <div
            key={`col-${index}`}
            className={`column ${type}`}>
            {renderField(field)}
        </div>);
    });
};

export const builder = {
    layout: renderLayout,
    section: renderSection,
    col: renderCol
};

export function inputPropsLookup (inputProps, inputName){
    var props = inputProps[inputName];
    if(props) return assign({label: inputName}, props); // props found, easy.

    var inputNameTree = hash_serializer({}, inputName, null);
    var attrName = Object.keys(inputNameTree)[0]; // inputName describes only single path

    props = inputProps[attrName];

    if( !isNaN(parseInt(attrName)) ){ // skip number
        props = inputProps;
    }else if(props && props.type == 'nested'){ // continue with nested props
        props = props.fields;
    }else if(props){
        return props;
    }else throw (inputName+': props cannot be found.');

    var newInputName = inputName.replace(attrName, '');
    var nextAttrName =  Object.keys(inputNameTree[attrName])[0];

    // remove bracket
    newInputName = newInputName.replace('['+nextAttrName+']', '');
    newInputName = nextAttrName + newInputName;

    return inputPropsLookup(props, newInputName);
}

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

    if(newInputName === ''){
        return serializedValues[attrName] ?
            serializedValues[attrName][nextAttrName] : undefined;
    }
    newInputName = nextAttrName + newInputName;

    var nestedValues = serializedValues[attrName];
    return inputValueLookup(nestedValues, newInputName);
}

export function formInputsSerialize(form){
    return serialize(form, {hash: true});
}
