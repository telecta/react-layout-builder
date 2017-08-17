import PropTypes from 'prop-types';
import React from 'react';
import invariant from 'invariant';

import humanize from './utils/humanize';
import assign from 'object-assign';
import { inputValueLookup } from 'form-input-serialize';
import { layout, section, col } from 'react-layout-builder';

export default class FormWithLayout extends React.Component {
  constructor(props, context) {
    super(props, context);

    invariant(
      props.renderLayout && props.renderField,
      'props.renderLayout and props.renderField is required.'
    );

    this._refs = {};
    this._isMounted = false;

    this.renderField = this.renderField.bind(this);
    this.fields = {};
  }

  componentDidMount() {
    this._isMounted = true;
  }

  render() {
    const { props } = this;

    const formProps = {
      action: props.action,
      method: props.method,
      onSubmit: props.onSubmit
    };

    const formBuilder = { layout: layout, section: section };
    formBuilder.col = col.bind(null, this.renderField);

    const children =
      this.props.showAll && props.renderExpandedLayout
        ? props.renderExpandedLayout(formBuilder, props)
        : props.renderLayout(formBuilder, props);

    return (
      <form
        ref={c => (this.form = c)}
        {...formProps}
        className={props.className || 'form-horizontal'}
      >
        {children}
        {props.renderButtons ? props.renderButtons(props) : <div />}
      </form>
    );
  }

  renderField(name) {
    const props = this.props;

    const value = inputValueLookup(props.values || {}, name);
    const error = props.errors ? props.errors[name] : null;
    const def = props.getFieldProps(name);

    // form.defaultValues(field).defaultValue
    var defaultValue = inputValueLookup(props.defaultValues || {}, name);

    // fieldProps.value > form.defaultValues(field).defaultValue
    defaultValue =
      def.defaultValue === null || typeof def.defaultValue === 'undefined'
        ? defaultValue
        : def.defaultValue;

    // form.props.disabled > fieldProps.disabled
    var disabled = props.disabled || def.disabled;

    var label = def.label ? def.label : humanize(name);

    var refName = this.getFieldRef(name);

    const fieldProps = assign({}, def, {
      ref: c => {
        this.fields[refName] = c;
      },
      // key: refName,
      className: 'field',
      field: def,
      name: name,
      value: value,
      defaultValue: defaultValue,
      label: label,
      error: error,
      disabled: disabled
    });

    return def.input
      ? React.createElement(def.input, fieldProps)
      : props.renderField(name, fieldProps);
  }

  /** contextual features */
  getFieldRef(name) {
    var refName = 'field-' + name;
    var count = this._refs[refName];

    if (!this._isMounted) this._refs[refName] = count ? count + 1 : 1;

    count = this._refs[refName];
    refName = refName + (count === 1 ? '' : '-' + (this._refs[refName] - 1));
    return refName;
  }
}

FormWithLayout.propTypes = {
  renderLayout: PropTypes.func.isRequired,
  renderField: PropTypes.func.isRequired,
  getFieldProps: PropTypes.func.isRequired,

  values: PropTypes.object,
  defaultValues: PropTypes.object,

  errors: PropTypes.object,
  disabled: PropTypes.bool,
  className: PropTypes.string,

  renderButtons: PropTypes.func,
  renderExpandedLayout: PropTypes.func,
  showAll: PropTypes.bool
};
