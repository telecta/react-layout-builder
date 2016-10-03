jest.unmock('../src');

import React from 'react';
import {layout, section, col} from '../src';
import {mount} from 'enzyme';

describe('builder', () => {
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
});
