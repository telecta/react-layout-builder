jest.unmock('../src/index');

import {builder, inputPropsLookup, inputValueLookup} from '../src/index';
import React from 'react';
import {mount} from 'enzyme';

describe('builder', () => {
    const {layout, section, col} = builder;
    it('{layout, section, col}', () =>{
        expect(layout).toBeDefined();
        expect(section).toBeDefined();
        expect(col).toBeDefined();
    });

    it('layout(...)', () => {
        const el = layout(
            <div key="1" className="section1" />,
            <div key="2" className="section2" />);

        const component = mount(React.createElement((props) => el, null));
        expect(component.find('.layout').length).toBe(1);
        expect(component.find('.layout').find('.section1').length).toBe(1);
        expect(component.find('.layout').find('.section2').length).toBe(1);
    });

    it('section(...)', () => {
        const heading = 'Section 1';
        const el = section(heading,
            [<div key="1" className="row1 col1"/>, <div key="3" className="row1 col2" />],
            [<div key="2" className="row2 col1"/>, <div key="4" className="row2 col2" />]);

        const component = mount(React.createElement((props) => el, null));
        expect(component.find('.section').length).toBe(1);
        expect(component.find('.section').text()).toMatch(heading);
        expect(component.find('.section').find('.columns').length).toBe(2);
        expect(component.find('.columns').at(0).find('.row1').length).toBe(2);
        expect(component.find('.columns').at(1).find('.row2').length).toBe(2);

        expect(component.find('.section').find('.col1').length).toBe(2);
        expect(component.find('.section').find('.col2').length).toBe(2);
    });

    it('col(...)', () => {
        const renderField = (name) => <input name={name} />;
        const el = col(renderField, 'col-xs-3', 'street', 'city', 'country');
        function Wrapper(props) { return <div>{el}</div>; }
        const component = mount(<Wrapper />);

        expect(component.find('.column').length).toBe(3);
        expect(component.find('.col-xs-3').length).toBe(3);

        expect(component.find('input[name="street"]').length).toBe(1);
        expect(component.find('input[name="city"]').length).toBe(1);
        expect(component.find('input[name="country"]').length).toBe(1);
    });

    describe('#inputPropsLookup', () => {
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

    describe('#inputValueLookup', () => {
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
