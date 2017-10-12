import PropTypes from 'prop-types';
import React from 'react';
import invariant from 'invariant';

import humanize from './utils/humanize';
import assign from 'object-assign';
import { inputValueLookup } from 'react-form-utils';
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
    const formProps = this.props;
    const fieldProps = formProps.getFieldProps(name);

    const label = typeof fieldProps.label !== 'undefined'
      ? fieldProps.label
      : humanize(name);
    const refName = this.getFieldRef(name);

    // fieldProps.disabled > formProps.disabled >
    const disabled = typeof fieldProps.disabled !== 'undefined'
      ? fieldProps.disabled
      : formProps.disabled;

    // fieldProps.defaultValue > formProps.defaultValues(field).defaultValue
    const defaultValue = typeof fieldProps.defaultValue !== 'undefined'
        ? fieldProps.defaultValue
        : inputValueLookup(formProps.defaultValues || {}, name);

    // fieldProps.value > formProps.values(field).value
    const value = typeof fieldProps.value !== 'undefined'
        ? fieldProps.value
        : inputValueLookup(formProps.values || {}, name);

    const inputProps = assign({}, fieldProps, {
      ref: c => this.fields[refName] = c,
      className: 'field',
      name: name,
      value: value,
      label: label,
      disabled: disabled,

      defaultValue: typeof value !== 'undefined' ? undefined : defaultValue,
      formProps: formProps
    });

    return fieldProps.input
      ? React.createElement(fieldProps.input, inputProps)
      : formProps.renderField(name, inputProps);
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
