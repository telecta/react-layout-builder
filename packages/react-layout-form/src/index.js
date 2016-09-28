import React from 'react';
import invariant from 'invariant';

import humanize from 'utils/humanize';
import assign from 'object-assign';
import {builder, inputValueLookup} from 'react-layout-builder';

class FormWithLayout extends React.Component {
    constructor(props, context) {
        super(props, context);

        invariant(props.renderLayout && props.renderField,
            'props.renderLayout and props.renderField is required.');

        this._refs = {};
        this._isMounted = false;

        this.renderField = this.renderField.bind(this);
    }

    componentDidMount () {
        this._isMounted = true;
    }

    render () {
        const {props} = this;

        const formProps = {
            action: props.action,
            method: props.method, onSubmit: props.onSubmit };

        const formBuilder = assign({}, builder);
        formBuilder.col = builder.col.bind(builder, this.renderField);

        const children = this.props.showAll && props.renderExpandedLayout ?
            props.renderExpandedLayout(formBuilder, props)
            : props.renderLayout(formBuilder, props);

        return (
            <form ref="form"
                {...formProps}

                className={ props.className || 'form-horizontal'}>

                {children}
                {props.renderButtons ? props.renderButtons(props) : <div />}
            </form>);
    }

    renderField (name) {
        const props = this.props;

        const value = inputValueLookup(props.values || {}, name);
        const error = props.errors ? props.errors[name] : null;
        const def = props.getFieldProps(name);

        // form.field.defaultValue
        var defaultValue = inputValueLookup(props.defaultValues || {}, name);

        // fieldProps.value > form.field.value
        defaultValue = def.defaultValue || defaultValue;

        // form props.disabled
        var disabled = props.disabled || def.disabled;

        var label = def.label ? def.label : name;
        label = humanize(label);

        var refName = this.getFieldRef(name);

        const fieldProps = assign({}, def, {
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

        return def.input ?
            React.createElement(def.input, fieldProps)
            : props.renderField(name, fieldProps);
    }

    /** contextual features */
    getFieldRef (name) {
        var refName = 'field-'+name;
        var count = this._refs[refName];

        if(!this._isMounted)
            this._refs[refName] = count ? (count+1) : 1;

        count = this._refs[refName];
        refName = refName + (count == 1 ? '' : '-'+ (this._refs[refName]-1));
        return refName;
    }
}
FormWithLayout.propTypes = {
    renderLayout: React.PropTypes.func.isRequired,
    getFieldProps: React.PropTypes.func.isRequired,
    renderField: React.PropTypes.func.isRequired,

    renderButtons: React.PropTypes.func,
    renderExpandedLayout: React.PropTypes.func
};

export const layoutForm = (Base) =>
    function BaseWithFormLayout(props){ return <Base form={FormWithLayout} {...props} />; };
