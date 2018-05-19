jest.unmock('react-form-utils');
jest.unmock('react-layout-builder');
jest.unmock('../src');

import 'raf/polyfill';
import React from 'react';
import PropTypes from 'prop-types';
import FormWithLayout from '../src';
import { inputPropsLookup, formSerialize } from 'react-form-utils';

import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import toJSON from 'enzyme-to-json';

Enzyme.configure({ adapter: new Adapter() });

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
      value={props.value === null ? undefined : props.value}
      onChange={jest.fn()}
    />
  );
};
FormInput.propTypes = {
  name: PropTypes.string,
  type: PropTypes.string,
  className: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
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
            'second',
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
          section('husband', 'husband', [col(6, 'name', 'email')]),
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

    componentProps = { showAll: true, values: { age: 0 } };
    component = mount(<FormOwner {...componentProps} />);
  });

  describe('#create', () => {
    it('renders form', () => {
      expect(component.find('form').length).toBe(1);
    });

    it('renders two same fields', () => {
      const form = component.find('form');
      expect(form.find('input[name="name"]').length).toBe(2);
    });

    it('renders same number of fields when updated', () => {
      const form = component.find('form');

      expect(form.find('input[type="text"]').length).toBe(8);
      expect(form.find('input[type="email"]').length).toBe(2);
      expect(form.find('input[type="hidden"]').length).toBe(2);

      component.update();
      expect(form.find('input[type="text"]').length).toBe(8);
      expect(form.find('input[type="email"]').length).toBe(2);
      expect(form.find('input[type="hidden"]').length).toBe(2);
    });

    it('renders 1 layout and 2 sections', () => {
      expect(component.find('.layout').length).toBe(1);
      expect(component.find('.section').length).toBe(2);
    });

    describe('renders inputs', () => {
      beforeAll(() => {
        var search = component.find(FormInput);
        expect(search.length).toBe(10);

        search = component.find('input');
        expect(search.length).toBe(12);
      });

      it('renders all inputs', () => {
        expect(toJSON(component.find(FormInput))).toMatchSnapshot();
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
      component.setProps({ showAll: false, values: { name: name } });

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
      expect(grabContext).toBeCalledWith(form.instance());
    });
  });
});
