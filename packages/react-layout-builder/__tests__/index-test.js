/* eslint no-console: 0 */
jest.unmock('../src');

import 'raf/polyfill';
import React from 'react';
import { layout, section, col } from '../src';

import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

describe('builder', () => {
  it('{layout, section, col}', () => {
    expect(layout).toBeDefined();
    expect(section).toBeDefined();
    expect(col).toBeDefined();
  });

  it('layout(...)', () => {
    const el = layout(
      <div key="1" className="section1" />,
      <div key="2" className="section2" />
    );

    const component = mount(React.createElement(props => el, null));
    expect(component.find('.layout').length).toBe(1);
    expect(component.find('.layout').find('.section1').length).toBe(1);
    expect(component.find('.layout').find('.section2').length).toBe(1);
  });

  it('section(...)', () => {
    const heading = 'Section 1';
    const el = section(
      'section-1',
      heading,
      [
        <div key="1" className="row1 col1" />,
        <div key="3" className="row1 col2" />
      ],
      [
        <div key="2" className="row2 col1" />,
        <div key="4" className="row2 col2" />
      ]
    );

    const component = mount(React.createElement(props => el, null));
    expect(component.find('.section').length).toBe(1);
    expect(component.find('.section').text()).toMatch(heading);
    expect(component.find('.section').find('.columns').length).toBe(2);
    expect(component.find('.columns').at(0).find('.row1').length).toBe(2);
    expect(component.find('.columns').at(1).find('.row2').length).toBe(2);

    expect(component.find('.section').find('.col1').length).toBe(2);
    expect(component.find('.section').find('.col2').length).toBe(2);
  });

  it('col(...)', () => {
    const renderField = name => <input name={name} />;
    const el = col(renderField, 'col-xs-3', 'street', 'city', 'country');
    function Wrapper(props) {
      return (
        <div>
          {el}
        </div>
      );
    }
    const component = mount(<Wrapper />);

    expect(component.find('.column').length).toBe(3);
    expect(component.find('.col-xs-3').length).toBe(3);

    expect(component.find('input[name="street"]').length).toBe(1);
    expect(component.find('input[name="city"]').length).toBe(1);
    expect(component.find('input[name="country"]').length).toBe(1);
  });

  describe('stacking sections', () => {
    beforeAll(() => {
      spyOn(console, 'error');
    });

    it('layout with many sections', () => {
      const heading = 'Section 1';
      const section1 = section(
        'section-1',
        heading,
        [
          <div key="1" className="row1 col1" />,
          <div key="3" className="row1 col2" />
        ],
        [
          <div key="2" className="row2 col1" />,
          <div key="4" className="row2 col2" />
        ]
      );
      const section2 = section(
        'section-2',
        <i>hello</i>,
        [
          <div key="2" className="row1 col1" />,
          <div key="3" className="row1 col2" />
        ],
        [
          <div key="3" className="row2 col1" />,
          <div key="4" className="row2 col2" />
        ]
      );

      const layout1 = layout(section1, section2);

      mount(React.createElement(props => layout1, null));
      expect(console.error).not.toHaveBeenCalled();
    });

    it('sections with many col', () => {
      const renderField = name => <input name={name} />;
      const el = col(renderField, 'col-xs-3', 'street', 'city', 'country');
      const another = col(renderField, 'col-xs-4', 'street', 'city', 'country');

      const heading = 'Section 1';
      const section1 = layout(
        section(
          'section-1',
          heading,
          [el, another, another, el],
          [el, another, el]
        ),
        section('section-2', heading, [el, el, another], [el, another, el])
      );

      mount(React.createElement(props => section1, null));
      expect(console.error).not.toHaveBeenCalled();
    });
  });
});
