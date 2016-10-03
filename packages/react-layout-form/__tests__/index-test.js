jest.unmock('../src/index');
jest.unmock('react-layout-builder');

import React from 'react';
import {
    inputPropsLookup
} from 'react-layout-builder';

import {mount} from 'enzyme';

import {layoutForm} from '../src/index';

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

        GeneratedForm,

        componentProps,
        component;

    beforeEach(function(){
        FormInput = function FormField(props) {
            return <input ref="input" name={props.name} value={props.value} />;
        };

        GeneratedForm = layoutForm(class FormOwner extends React.Component {
            constructor (props){
                super(props);
                this.state = {
                    defaultValues: {}
                };
                this._handleSubmit = this._handleSubmit.bind(this);
            }

            render () {
                const Form = this.props.form;
                return <div />
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
                console.log('getFieldProps', name);
                return inputPropsLookup(FIELDS, name);
            }

            // getFullLayout (builder, props){
            //     console.log('getFullLayout', name);
            //     let {layout, section, col} = builder;
            //     const hidden = (name, value) =>
            //         <input type='hidden' name={name} value={value} />;
            //
            //     return layout(
            //             section('main',
            //                 [ col(3, 'name', 'age'), col(6, 'email') ],
            //                 [ col(6, 'address[0]', 'address[1]') ]
            //             ),
            //             hidden('role', 'husband'),
            //             section('main',
            //                 [ col(3, 'name', 'age'), col(6, 'email') ],
            //                 [ col(6, 'address[0]', 'address[1]') ]
            //             ),
            //             hidden('role', 'wife')
            //         );
            // }
            getShortLayout (builder, props) {
                console.log('getShortLayout');
                const {layout, section, col} = builder;
                const hidden = (name, value) =>
                    <input type='hidden' name={name} value={value} />;

                return layout(
                        section('husband',
                            [col(6, 'name', 'email')]
                        ),
                        hidden('role', 'husband'),
                        section('wife',
                            [col(6, 'name', 'email')]
                        ),
                        hidden('role', 'wife')
                    );
            }

            renderButtons (props) {
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

        // xit('should duplicate field refs if two same fields', function(){
        //     let form = component.refs['created-form'];
        //     expect(form.refs['field-name']).toBeDefined();
        //     expect(form.refs['field-name-1']).toBeDefined();
        // });
        //
        // xit('should not duplicate field refs when updated', function(){
        //     let form = component.refs['created-form'];
        //     expect(Object.keys(form.refs).length).toBe(13);
        //     assign(componentProps, {showAll: true});
        //     component.forceUpdate();
        //     expect(Object.keys(form.refs).length).toBe(13);
        // });
        //
        // xit('should generate layout and section', function(){
        //     var search = $.searchWithClass(component, 'layout');
        //     expect(search.length).toBe(1);
        //
        //     search = $.searchWithClass(component, 'section');
        //     expect(search.length).toBe(4);
        // });
        //
        // xit('should generate layout with custom renderLayout', function(){
        //     let renderLayout = jest.genMockFn();
        //     renderLayout.mockReturnValue(<div />);
        //     component = $.renderIntoDocument(
        //         <GeneratedForm {...componentProps} renderLayout={renderLayout}/>);
        //
        //     expect(renderLayout).toBeCalled();
        //     var search = $.searchWithClass(component, 'layout');
        //     expect(search.length).toBe(0);
        // });
        //
        // xit('should generate section with custom renderSection', function(){
        //     let renderSection = jest.genMockFn();
        //     renderSection.mockReturnValue(<div />);
        //     component = $.renderIntoDocument(
        //         <GeneratedForm {...componentProps} renderSection={renderSection}/>);
        //
        //     expect(renderSection).toBeCalled();
        //     var search = $.searchWithClass(component, 'section');
        //     expect(search.length).toBe(0);
        // });
        //
        // xit('should generate inputs', function(){
        //     var search = $.searchWithType(component, FormInput);
        //     expect(search.length).toBe(10);
        //
        //     search = $.searchWithTag(component, 'input');
        //     expect(search.length).toBe(12);
        //
        //     expect(ReactDOM.findDOMNode(search[0]).getAttribute('name')).toBe('name');
        //     expect(ReactDOM.findDOMNode(search[1]).getAttribute('name')).toBe('age');
        //
        //     expect(ReactDOM.findDOMNode(search[2]).getAttribute('name')).toBe('email');
        //     expect(ReactDOM.findDOMNode(search[2]).getAttribute('type')).toBe('email');
        //
        //     expect(ReactDOM.findDOMNode(search[3]).getAttribute('name')).toBe('address[0]');
        //     expect(ReactDOM.findDOMNode(search[4]).getAttribute('name')).toBe('address[1]');
        //
        //     expect(ReactDOM.findDOMNode(search[5]).getAttribute('name')).toBe('role');
        //     expect(ReactDOM.findDOMNode(search[5]).getAttribute('value')).toBe('husband');
        //
        //     expect(ReactDOM.findDOMNode(search[6]).getAttribute('name')).toBe('name');
        //     expect(ReactDOM.findDOMNode(search[7]).getAttribute('name')).toBe('age');
        //
        //     expect(ReactDOM.findDOMNode(search[8]).getAttribute('name')).toBe('email');
        //     expect(ReactDOM.findDOMNode(search[8]).getAttribute('type')).toBe('email');
        //
        //     expect(ReactDOM.findDOMNode(search[9]).getAttribute('name')).toBe('address[0]');
        //     expect(ReactDOM.findDOMNode(search[10]).getAttribute('name')).toBe('address[1]');
        //
        //     expect(ReactDOM.findDOMNode(search[11]).getAttribute('name')).toBe('role');
        //     expect(ReactDOM.findDOMNode(search[11]).getAttribute('value')).toBe('wife');
        // });
        //
        // xit('should generate lesser inputs when showAll=false', function(){
        //     assign(componentProps, {showAll: false});
        //     component = $.renderIntoDocument(<GeneratedForm {...componentProps}/>);
        //
        //     expect(component.props.showAll).toBe(false);
        //     var search = $.searchWithType(component, FormInput);
        //     expect(search.length).toBe(4);
        //
        //     search = $.searchWithTag(component, 'input');
        //     expect(search.length).toBe(6);
        // });
        //
        // xit('should submit the form', () => {
        //     var search = $.searchWithTag(component, 'button');
        //     expect(search.length).toBe(1);
        //
        //     $.simulate.click(search[0]);
        //     expect(createActions).toBeCalled();
        //     expect(createActions.mock.calls[0][0]).toEqual({role: ['husband', 'wife']});
        // });
        //
        // xit('should submit the form with values', () => {
        //     var search = $.searchWithTag(component, 'input');
        //     let input = ReactDOM.findDOMNode(search[0]);
        //     expect(input.getAttribute('name')).toBe('name');
        //
        //     let name = 'garfield';
        //     input.setAttribute('value', name);
        //
        //     search = $.searchWithTag(component, 'button');
        //     expect(search.length).toBe(1);
        //
        //     $.simulate.click(search[0]);
        //     expect(createActions).toBeCalled();
        //     expect(createActions.mock.calls[0][0]).toEqual({name: name, role: ['husband', 'wife']});
        // });

    });



});
