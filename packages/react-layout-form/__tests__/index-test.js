import assign from 'object.assign';

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

import {layoutForm} from '../src/index';
import {
    inputPropsLookup,
    inputValueLookup,
    formInputsSerialize
} from 'react-layout-builder';

import React from 'react';
import ReactDOM from 'react-dom';
import {mount} from 'enzyme';

describe('ReactFormInput', function(){
    var ReactTestUtils, $,

        FormInput,

        GeneratedForm,

        createActions,

        componentProps,
        component;

    beforeEach(function(){
        ReactTestUtils = require('react-addons-test-utils');
        $ = {
            renderIntoDocument: ReactTestUtils.renderIntoDocument,
            simulate: ReactTestUtils.Simulate,
            searchWithType: ReactTestUtils.scryRenderedComponentsWithType,
            searchWithTag: ReactTestUtils.scryRenderedDOMComponentsWithTag,
            searchWithClass: ReactTestUtils.scryRenderedDOMComponentsWithClass
        };

        FormInput = class FormField extends React.Component {
            render () {
                return <input ref="input" />;
            }
        };

        createActions = jest.genMockFn();

        GeneratedForm = layoutForm(class GeneratedForm extends React.Component{
            constructor (props, context){
                super(props, context);
                this.state = {
                    defaultValues: {}
                };
                this._handleSubmit = this._handleSubmit.bind(this);
            }

            render () {
                const Form = this.props.form;
                return <Form {...this.props}
                    ref="created-form"
                    defaultValues={this.state.defaultValues}

                    getFieldProps={this.getFieldProps}
                    renderLayout={this.getShortLayout}
                    renderField={(name, fieldProps) => <FormInput {...fieldProps}/>}

                    renderExpandedLayout={this.getShortLayout}
                    renderButtons={this.renderButtons} />;
            }

            getFieldProps (name){
                return inputPropsLookup(FIELDS, name);
            }

            getFullLayout (builder, props){
                let {layout, section, col} = builder;
                const hidden = (name, value) =>
                    <input type='hidden' name={name} value={value} />;

                return layout(
                        section('main',
                            [ col(3, 'name', 'age'), col(6, 'email') ],
                            [ col(6, 'address[0]', 'address[1]') ]
                        ),
                        hidden('role', 'husband'),
                        section('main',
                            [ col(3, 'name', 'age'), col(6, 'email') ],
                            [ col(6, 'address[0]', 'address[1]') ]
                        ),
                        hidden('role', 'wife')
                    );
            }
            getShortLayout (builder, props) {
                let {layout, section, col} = builder;
                const hidden = (name, value) =>
                    <input type='hidden' name={name} value={value} />;

                return layout(
                        section('husband',
                            col(6, 'name', 'email')
                        ),
                        hidden('role', 'husband'),
                        section('wife',
                            col(6, 'name', 'email')
                        ),
                        hidden('role', 'wife')
                    );
            }

            renderButtons (form) {
                return (
                <button onClick={this._handleSubmit}>
                    Create
                </button>);
            }

            _handleSubmit (e) {
                // let form = this.refs['created-form'].refs['form'];
                //
                // if(e) e.preventDefault();
                // let values = formInputsSerialize(form);
                // createActions(values);
                // this.setState({defaultValues: values});
            }
        });
        componentProps = { showAll: true };
        component = mount(<GeneratedForm {...componentProps}/>);
    });

    describe('#create', ()=> {
        it('should generate form and its refs', function(){
            var search = component.find('form');
            expect(search.length).toBe(1);
            // 
            // let form = component.refs['created-form'];
            // expect(form).toBeDefined();
            // expect(form.refs['form']).toBeDefined();
        });

        xit('should duplicate field refs if two same fields', function(){
            let form = component.refs['created-form'];
            expect(form.refs['field-name']).toBeDefined();
            expect(form.refs['field-name-1']).toBeDefined();
        });

        xit('should not duplicate field refs when updated', function(){
            let form = component.refs['created-form'];
            expect(Object.keys(form.refs).length).toBe(13);
            assign(componentProps, {showAll: true});
            component.forceUpdate();
            expect(Object.keys(form.refs).length).toBe(13);
        });

        xit('should generate layout and section', function(){
            var search = $.searchWithClass(component, 'layout');
            expect(search.length).toBe(1);

            search = $.searchWithClass(component, 'section');
            expect(search.length).toBe(4);
        });

        xit('should generate layout with custom renderLayout', function(){
            let renderLayout = jest.genMockFn();
            renderLayout.mockReturnValue(<div />);
            component = $.renderIntoDocument(
                <GeneratedForm {...componentProps} renderLayout={renderLayout}/>);

            expect(renderLayout).toBeCalled();
            var search = $.searchWithClass(component, 'layout');
            expect(search.length).toBe(0);
        });

        xit('should generate section with custom renderSection', function(){
            let renderSection = jest.genMockFn();
            renderSection.mockReturnValue(<div />);
            component = $.renderIntoDocument(
                <GeneratedForm {...componentProps} renderSection={renderSection}/>);

            expect(renderSection).toBeCalled();
            var search = $.searchWithClass(component, 'section');
            expect(search.length).toBe(0);
        });

        xit('should generate inputs', function(){
            var search = $.searchWithType(component, FormInput);
            expect(search.length).toBe(10);

            search = $.searchWithTag(component, 'input');
            expect(search.length).toBe(12);

            expect(ReactDOM.findDOMNode(search[0]).getAttribute('name')).toBe('name');
            expect(ReactDOM.findDOMNode(search[1]).getAttribute('name')).toBe('age');

            expect(ReactDOM.findDOMNode(search[2]).getAttribute('name')).toBe('email');
            expect(ReactDOM.findDOMNode(search[2]).getAttribute('type')).toBe('email');

            expect(ReactDOM.findDOMNode(search[3]).getAttribute('name')).toBe('address[0]');
            expect(ReactDOM.findDOMNode(search[4]).getAttribute('name')).toBe('address[1]');

            expect(ReactDOM.findDOMNode(search[5]).getAttribute('name')).toBe('role');
            expect(ReactDOM.findDOMNode(search[5]).getAttribute('value')).toBe('husband');

            expect(ReactDOM.findDOMNode(search[6]).getAttribute('name')).toBe('name');
            expect(ReactDOM.findDOMNode(search[7]).getAttribute('name')).toBe('age');

            expect(ReactDOM.findDOMNode(search[8]).getAttribute('name')).toBe('email');
            expect(ReactDOM.findDOMNode(search[8]).getAttribute('type')).toBe('email');

            expect(ReactDOM.findDOMNode(search[9]).getAttribute('name')).toBe('address[0]');
            expect(ReactDOM.findDOMNode(search[10]).getAttribute('name')).toBe('address[1]');

            expect(ReactDOM.findDOMNode(search[11]).getAttribute('name')).toBe('role');
            expect(ReactDOM.findDOMNode(search[11]).getAttribute('value')).toBe('wife');
        });

        xit('should generate lesser inputs when showAll=false', function(){
            assign(componentProps, {showAll: false});
            component = $.renderIntoDocument(<GeneratedForm {...componentProps}/>);

            expect(component.props.showAll).toBe(false);
            var search = $.searchWithType(component, FormInput);
            expect(search.length).toBe(4);

            search = $.searchWithTag(component, 'input');
            expect(search.length).toBe(6);
        });

        xit('should submit the form', () => {
            var search = $.searchWithTag(component, 'button');
            expect(search.length).toBe(1);

            $.simulate.click(search[0]);
            expect(createActions).toBeCalled();
            expect(createActions.mock.calls[0][0]).toEqual({role: ['husband', 'wife']});
        });

        xit('should submit the form with values', () => {
            var search = $.searchWithTag(component, 'input');
            let input = ReactDOM.findDOMNode(search[0]);
            expect(input.getAttribute('name')).toBe('name');

            let name = 'garfield';
            input.setAttribute('value', name);

            search = $.searchWithTag(component, 'button');
            expect(search.length).toBe(1);

            $.simulate.click(search[0]);
            expect(createActions).toBeCalled();
            expect(createActions.mock.calls[0][0]).toEqual({name: name, role: ['husband', 'wife']});
        });

    });

    xdescribe('#inputPropsLookup', () => {
        it('should lookup normal names', () => {
            let fields = {
                name: {
                    type: 'text'
                },
                age: {
                    type: 'text'
                }
            };
            expect(inputPropsLookup(fields, 'name')).toBeDefined();
            expect(inputPropsLookup(fields, 'name').type).toBe(fields.name.type);

            expect(inputPropsLookup(fields, 'age')).toBeDefined();
            expect(inputPropsLookup(fields, 'age').type).toBe(fields.age.type);
        });

        it('should lookup array names', () => {
            let fields = {
                name: {
                    type: 'text'
                },
                age: {
                    type: 'text'
                }
            };
            expect(inputPropsLookup(fields, 'name[1]')).toBeDefined();
            expect(inputPropsLookup(fields, 'name[1]').type).toBe(fields.name.type);

            expect(inputPropsLookup(fields, 'age[2]')).toBeDefined();
            expect(inputPropsLookup(fields, 'age[2]').type).toBe(fields.age.type);
        });

        it('should lookup nested names', () => {
            let fields = {
                address: {
                    type: 'nested',
                    fields: {
                        city: {
                            type: 'text'
                        }
                    }
                }
            };

            expect(inputPropsLookup(fields, 'address[0][city]')).toBeDefined();
            expect(inputPropsLookup(fields, 'address[0][city]').type)
                .toBe(fields.address.fields.city.type);

            expect(inputPropsLookup(fields, 'address[0][city][3]')).toBeDefined();
            expect(inputPropsLookup(fields, 'address[0][city][3]').type)
                .toBe(fields.address.fields.city.type);
        });
    });

    xdescribe('#inputValueLookup', () => {
        it('should lookup normal values', () => {
            let values = {
                name: 'john',
                age: 11
            };
            expect(inputValueLookup(values, 'name')).toBe(values.name);
            expect(inputValueLookup(values, 'age')).toBe(values.age);
        });

        it('should lookup array values', () => {
            let values = {
                country: {
                    0: 'Ireland',
                    1: 'Fiji'
                },
                city: [
                    'taipei',
                    'tiblisi'
                ]
            };

            expect(inputValueLookup(values, 'country[0]')).toBe(values.country[0]);
            expect(inputValueLookup(values, 'country[1]')).toBe(values.country[1]);

            expect(inputValueLookup(values, 'city[0]')).toBe(values.city[0]);
            expect(inputValueLookup(values, 'city[1]')).toBe(values.city[1]);
        });

        it('should lookup nested values', () => {
            let values = {
                shipping_address: {
                    0: {
                        city: 'queens'
                    },
                    1: {
                        city: 'brooklyn'
                    }
                },
                billing_address: [
                    {
                        city: 'bangkok'
                    },
                    {
                        city: 'delhi'
                    }
                ]
            };
            expect(inputValueLookup(values, 'shipping_address[0][city]'))
                .toBe(values.shipping_address[0].city);
            expect(inputValueLookup(values, 'shipping_address[1][city]'))
                .toBe(values.shipping_address[1].city);

            expect(inputValueLookup(values, 'billing_address[0][city]'))
                .toBe(values.billing_address[0].city);
            expect(inputValueLookup(values, 'billing_address[1][city]'))
                .toBe(values.billing_address[1].city);
        });
    });


});
