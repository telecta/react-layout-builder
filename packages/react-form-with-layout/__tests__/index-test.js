jest.unmock('form-input-serialize');
jest.unmock('react-layout-builder');
jest.unmock('../src');

import React from 'react';
import FormWithLayout from '../src';
import { inputPropsLookup, formInputsSerialize } from 'form-input-serialize';

import {mount} from 'enzyme';

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


describe('ReactFormInput', function(){
    var FormInput,

        componentProps,
        createActions = jest.fn(),
        component;

    beforeEach(function(){
        FormInput = class FormField extends React.Component {
            render(){
                const props = this.props;
                return <input
                    className={props.className}
                    name={props.name}
                    type={props.type}
                    value={props.value|| ''} />;
            }
        };

        class FormOwner extends React.Component {
            constructor (props){
                super(props);
                this.state = {
                    defaultValues: {}
                };
                this._handleSubmit = this._handleSubmit.bind(this);
                this.renderButtons = this.renderButtons.bind(this);
            }

            render () {
                return <FormWithLayout {...this.props}
                    ref={c => this.createdForm = c}
                    defaultValues={this.state.defaultValues}

                    getFieldProps={this.getFieldProps}
                    renderLayout={this.getShortLayout}

                    renderField={(name, fieldProps) => <FormInput {...fieldProps}/>}

                    renderExpandedLayout={this.getFullLayout}
                    renderButtons={this.renderButtons} />;
            }

            getFieldProps (name){
                return inputPropsLookup(FIELDS, name);
            }

            getFullLayout (builder, props){
                let {layout, section, col} = builder;

                return layout(
                        section('main',
                            [ col(3, 'name', 'age'), col(6, 'email') ],
                            [ col(6, 'address[0]', 'address[1]') ]
                        ),
                        <input type='hidden' name={'role'} value={'husband'} key={'role-husband'}/>,
                        section('main',
                            [ col(3, 'name', 'age'), col(6, 'email') ],
                            [ col(6, 'address[0]', 'address[1]') ]
                        ),
                        <input type='hidden' name={'role'} value={'wife'} key={'role-wife'} />,
                    );
            }
            getShortLayout (builder, props) {
                const {layout, section, col} = builder;

                return layout(
                        section('husband',
                            [col(6, 'name', 'email')]
                        ),
                        <input type={'hidden'} name={'role'} value={'husband'} key={'role-husband'}/>,
                    );
            }

            renderButtons (props) {
                return (
                <button onClick={this._handleSubmit}>
                    Create
                </button>);
            }

            _handleSubmit (e) {
                let form = this.createdForm.form;

                if(e) e.preventDefault();
                let values = formInputsSerialize(form);
                createActions(values);
                this.setState({defaultValues: values});
            }
        }

        componentProps = { showAll: true }
        component = mount(<FormOwner {...componentProps} />);
    });

    describe('#create', ()=> {
        it('should generate form', function(){
            var search = component.find('form');
            expect(search.length).toBe(1);
        });

        it('should duplicate field refs if two same fields', function(){
            let form =  component.find('form');
            expect(form.find('.field-name')).toBeDefined();
            expect(form.find('.field-name')).toBeDefined();
        });

        it('should not duplicate field refs when updated', function(){
            let form = component.find('form');
            expect(form.find('.field').length).toBe(10);
            component.setProps({showAll: false});
            component.update();
            expect(form.find('.field').length).toBe(2);
        });

        it('should generate layout and section', function(){
            var search = component.find('.layout');
            expect(search.length).toBe(1);

            search = component.find('.section');
            expect(search.length).toBe(2);
        });

        it('should generate inputs', function(){
            var search = component.find(FormInput);
            expect(search.length).toBe(10);

            search = component.find('input');
            expect(search.length).toBe(12);

            const name = (n) => {
                return search.at(n).node.getAttribute('name');
            };
            const type = (n) => {
                return search.at(n).node.getAttribute('type');
            };
            const value = (n) => {
                return search.at(n).node.value;
            };

            expect(name(0)).toBe('name');
            expect(name(1)).toBe('age');

            expect(name(2)).toBe('email');
            expect(type(2)).toBe('email');

            expect(name(3)).toBe('address[0]');
            expect(name(4)).toBe('address[1]');

            expect(name(5)).toBe('role');
            expect(value(5)).toBe('husband');

            expect(name(6)).toBe('name');
            expect(name(7)).toBe('age');

            expect(name(8)).toBe('email');
            expect(type(8)).toBe('email');

            expect(name(9)).toBe('address[0]');
            expect(name(10)).toBe('address[1]');

            expect(name(11)).toBe('role');
            expect(value(11)).toBe('wife');
        });

        it('should generate lesser inputs when showAll=false', function(){
            component.setProps({showAll: false});

            expect(component.props().showAll).toBe(false);
            var search = component.find(FormInput);
            expect(search.length).toBe(2);

            search = component.find('input');
            expect(search.length).toBe(3);
        });

        it('should submit the form', () => {
            var search = component.find('button');
            expect(search.text()).toMatch('Create');
            expect(search.length).toBe(1);

            search.simulate('click');
            expect(createActions).toBeCalled();
            expect(createActions.mock.calls[0][0]).toEqual({role: ['husband', 'wife']});
        });

        xit('should submit the form with values', () => {
            const name = 'garfield';
            component.find('input[name="name"]').at(0).node.setAttribute('value', name);
            component.find('button').simulate('click');
            expect(createActions.mock.calls[0][0]).toEqual({name: name, role: ['husband', 'wife']});
        });

    });



});
