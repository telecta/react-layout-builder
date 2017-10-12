import assign from 'object.assign';
import serialize, { hash_serializer } from 'form-serialize';

export const inputPropsLookup = (inputProps, inputName) => {
  var props = inputProps[inputName];
  if (props) return assign({ label: inputName }, props); // props found, easy.

  var inputNameTree = hash_serializer({}, inputName, null);
  var attrName = Object.keys(inputNameTree)[0]; // inputName describes only single path

  props = inputProps[attrName];

  if (!isNaN(parseInt(attrName, 10))) {
    // skip number
    props = inputProps;
  } else if (props && props.type === 'nested') {
    // continue with nested props
    props = props.fields;
  } else if (props) {
    return props;
  } else {
    return undefined;
  }

  var newInputName = inputName.replace(attrName, '');
  var nextAttrName = Object.keys(inputNameTree[attrName])[0];

  // remove bracket
  newInputName = newInputName.replace('[' + nextAttrName + ']', '');
  newInputName = nextAttrName + newInputName;

  return inputPropsLookup(props, newInputName);
};

export const inputValueLookup = (serializedValues, inputName) => {
  if (!serializedValues || Object.keys(serializedValues).length === 0)
    return undefined;

  var value = serializedValues[inputName];
  if (typeof value !== 'undefined' && value !== null) return value; // value found, easy.

  // try to serialize and traverse
  var inputNameTree = hash_serializer({}, inputName, null);
  var attrName = Object.keys(inputNameTree)[0]; // inputName describes only single path

  var next = inputNameTree[attrName];
  if (next == null) return undefined; // if it's already leaf, then no chance to be found.

  var nextAttrName = Object.keys(next)[0];
  var newInputName = inputName.replace(attrName, '');

  // remove bracket
  newInputName = newInputName.replace('[' + nextAttrName + ']', '');

  if (newInputName === '') {
    return serializedValues[attrName]
      ? serializedValues[attrName][nextAttrName]
      : undefined;
  }
  newInputName = nextAttrName + newInputName;

  var nestedValues = serializedValues[attrName];
  return inputValueLookup(nestedValues, newInputName);
};

export const formSerialize = (form, options) => {
  options = options || { hash: true };
  return serialize(form, options);
};
