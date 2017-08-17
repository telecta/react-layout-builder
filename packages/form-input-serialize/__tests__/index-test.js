jest.unmock('../src');

import { inputPropsLookup, inputValueLookup } from '../src';

describe('#inputPropsLookup', () => {
  it('should lookup normal names', () => {
    const fields = {
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
    const fields = {
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
    const fields = {
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
    expect(inputPropsLookup(fields, 'address[0][city]').type).toBe(
      fields.address.fields.city.type
    );

    expect(inputPropsLookup(fields, 'address[0][city][3]')).toBeDefined();
    expect(inputPropsLookup(fields, 'address[0][city][3]').type).toBe(
      fields.address.fields.city.type
    );
  });
});

describe('#inputValueLookup', () => {
  it('should lookup normal values', () => {
    const values = {
      name: 'john',
      age: 11
    };
    expect(inputValueLookup(values, 'name')).toBe(values.name);
    expect(inputValueLookup(values, 'age')).toBe(values.age);
  });

  it('should return zero value', () => {
    const values = {
      zero: 0
    };
    expect(inputValueLookup(values, 'zero')).toBe(0);
  });

  it('should lookup array values', () => {
    const values = {
      country: ['Ireland', 'Fiji'],
      city: ['taipei', 'tiblisi']
    };

    expect(inputValueLookup(values, 'country[0]')).toBe(values.country[0]);
    expect(inputValueLookup(values, 'country[1]')).toBe(values.country[1]);

    expect(inputValueLookup(values, 'city[0]')).toBe(values.city[0]);
    expect(inputValueLookup(values, 'city[1]')).toBe(values.city[1]);
  });

  it('should lookup nested values', () => {
    const values = {
      shipping_address: [
        {
          city: 'queens'
        },
        {
          city: 'brooklyn'
        }
      ],
      billing_address: [
        {
          city: 'bangkok'
        },
        {
          city: 'delhi'
        }
      ]
    };
    expect(inputValueLookup(values, 'shipping_address[0][city]')).toBe(
      values.shipping_address[0].city
    );
    expect(inputValueLookup(values, 'shipping_address[1][city]')).toBe(
      values.shipping_address[1].city
    );

    expect(inputValueLookup(values, 'billing_address[0][city]')).toBe(
      values.billing_address[0].city
    );
    expect(inputValueLookup(values, 'billing_address[1][city]')).toBe(
      values.billing_address[1].city
    );
  });
});
