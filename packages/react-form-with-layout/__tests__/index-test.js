jest.unmock('react-form-utils');
jest.unmock('react-layout-builder');
jest.unmock('../src');

import React from 'react';
import PropTypes from 'prop-types';
import FormWithLayout from '../src';
import { inputPropsLookup, formSerialize } from 'react-form-utils';

import { mount } from 'enzyme';

const FIELDS = {
  age: {
    type: 'text'
  },
  name: {
    type: 'text',
    label: 'Full name'
  },
  email: {
    type: 'email',
    label: 'Email add.'
  },
  address: {
    type: 'text'
  },
  role: {
    type: 'hidden'
  }
};

const FormInput = props => {
  return (
    <input
      className={props.className}
      name={props.name}
      type={props.type}
      defaultValue={props.defaultValue}
    />
  );
};
FormInput.propTypes = {
  name: PropTypes.string,
  type: PropTypes.string,
  className: PropTypes.string,
  defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

describe('FormWithLayout', () => {
  var componentProps, createActions, component;

  beforeEach(() => {
    createActions = jest.fn();

    class FormOwner extends React.Component {
      constructor(props) {
        super(props);
        this._handleSubmit = this._handleSubmit.bind(this);
        this.renderButtons = this.renderButtons.bind(this);
      }

      render() {
        return (
          <FormWithLayout
            {...this.props}
            onSubmit={this._handleSubmit}
            getFieldProps={this.getFieldProps}
            renderLayout={this.getShortLayout}
            renderExpandedLayout={this.getFullLayout}
            renderField={(name, fieldProps) => <FormInput {...fieldProps} />}
            renderButtons={this.renderButtons}
          />
        );
      }

      getFieldProps(name) {
        return inputPropsLookup(FIELDS, name);
      }

      getFullLayout(builder, props) {
        const { layout, section, col } = builder;

        return layout(
          section(
            'main',
            [col(3, 'name', 'age'), col(6, 'email')],
            [col(6, 'address[0]', 'address[1]')]
          ),
          <input
            type="hidden"
            name={'role'}
            value={'husband'}
            key={'role-husband'}
          />,
          section(
            'main',
            [col(3, 'name', 'age'), col(6, 'email')],
            [col(6, 'address[0]', 'address[1]')]
          ),
          <input type="hidden" name={'role'} value={'wife'} key={'role-wife'} />
        );
      }

      getShortLayout(builder, props) {
        const { layout, section, col } = builder;

        return layout(
          section('husband', [col(6, 'name', 'email')]),
          <input
            type={'hidden'}
            name={'role'}
            value={'husband'}
            key={'role-husband'}
          />
        );
      }

      renderButtons(props) {
        return <button>Create</button>;
      }

      _handleSubmit(e) {
        const form = e.target;

        if (e) e.preventDefault();
        const values = formSerialize(form);
        createActions(values);
        this.setState({ defaultValues: values });

        if (this.props.onSubmit) this.props.onSubmit(e);
      }
    }
    FormOwner.propTypes = {
      onSubmit: PropTypes.func
    };

    componentProps = { showAll: true, defaultValues: { age: 0 } };
    component = mount(<FormOwner {...componentProps} />);
  });

  describe('#create', () => {
    it('renders form', () => {
      expect(component.find('form').length).toBe(1);
    });

    it('renders two same fields', () => {
      const form = component.find('form');
      expect(form.find('[name="name"]').length).toBe(2);
    });

    it('renders same number of fields when updated', () => {
      const form = component.find('form');
      expect(form.find('.field').length).toBe(10);

      component.update();
      expect(form.find('.field').length).toBe(10);
    });

    it('renders 1 layout and 2 sections', () => {
      expect(component.find('.layout').length).toBe(1);
      expect(component.find('.section').length).toBe(2);
    });

    describe('renders inputs', () => {
      var name, type, value;
      beforeAll(() => {
        var search = component.find(FormInput);
        expect(search.length).toBe(10);

        search = component.find('input');
        expect(search.length).toBe(12);

        name = n => {
          return search.at(n).node.getAttribute('name');
        };
        type = n => {
          return search.at(n).node.getAttribute('type');
        };
        value = n => {
          return search.at(n).node.value;
        };
      });

      it('renders all inputs', () => {
        expect(name(0)).toBe('name');
        expect(name(1)).toBe('age');
        expect(name(2)).toBe('email');
        expect(name(3)).toBe('address[0]');
        expect(name(4)).toBe('address[1]');
        expect(name(5)).toBe('role');
        expect(name(6)).toBe('name');
        expect(name(7)).toBe('age');
        expect(name(8)).toBe('email');
        expect(name(9)).toBe('address[0]');
        expect(name(10)).toBe('address[1]');
        expect(name(11)).toBe('role');
        expect(value(11)).toBe('wife');
      });

      it('renders input with correct type', () => {
        expect(name(2)).toBe('email');
        expect(type(2)).toBe('email');
      });

      it('renders nodes with value', () => {
        expect(name(5)).toBe('role');
        expect(value(5)).toBe('husband');

        expect(name(11)).toBe('role');
        expect(value(11)).toBe('wife');
      });

      it('renders input with 0 value', () => {
        expect(name(7)).toBe('age');
        expect(value(7)).toBe('0');
      });
    });

    it('renders lesser inputs when showAll=false', () => {
      component.setProps({ showAll: false });

      expect(component.props().showAll).toBe(false);
      var search = component.find(FormInput);
      expect(search.length).toBe(2);

      search = component.find('input');
      expect(search.length).toBe(3);
    });

    it('submit the form', () => {
      component.find('form').simulate('submit');
      expect(createActions).toBeCalled();
    });

    it('submit the form with values', () => {
      const name = 'garfield';
      component.setProps({ showAll: false, defaultValues: { name: name } });

      component.find('form').simulate('submit');
      expect(createActions.mock.calls[0][0]).toEqual({
        name: name,
        role: 'husband'
      });
    });

    it('passes the form node in onSubmit', () => {
      const grabContext = jest.fn();
      const onSubmit = jest.fn(function(e) {
        grabContext(e.target);
      });
      component.setProps({ onSubmit });

      const form = component.find('form');
      expect(form.length).toBe(1);
      form.simulate('submit');

      expect(onSubmit).toBeCalled();
      expect(grabContext).toBeCalledWith(form.node);
    });
  });
});
