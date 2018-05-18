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
      <form {...formProps} className={props.className || 'form-horizontal'}>
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

    const fieldProps = assign({}, def, {
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
