## react-layout-builder

[![Build Status](https://travis-ci.org/blacktangent/react-layout-builder.svg?branch=master)](https://travis-ci.org/blacktangent/react-layout-builder)

`react-layout-builder` provides helper functions to build layout like a DSL.

```
$ yarn add react-layout-builder
```


### Example

```javascript
import React from 'react';
import {
  layout,
  section,
  col
} from 'react-layout-builder';

const PhotoAlbum = props => {
  const { images } = props;
  const three60s = images.filter(i => i.type == '360');

  const renderImage = (name) => {
    const image = images.find(i => i.name === name);
    return <img alt={image.title} src={image.url} />;
  }
  const grid = (className, ...images) =>
    col(renderImage, className, ...images.map(i => i.name));

  return layout(
    section('Photos',
        new Array( Math.ceil( images.length/3 ) )
        .map( _ =>
          grid(
            'grid-of-3',
            images.pop(),
            images.pop(),
            images.pop()
          )
        )
    ),
    section('360 Photos',
        three60s
        .map( p => grid('full-width', p) )
    ),
  <p key="copyright">Copyrighted by author</p>
  );

}
```

### Usage

#### `layout`
```js
/*
 * @param {node} mainHeader
 * @param {node} section
 * @return {node}
 * /
layout(mainHeader, ...sections)
// <div className="layout">{sections}</div>
```
#### `section`
```
/*
 * @param {node} sectionHeader
 * @param {node} row
 * @return {node}
 * /
section(sectionHeader, ...rows)
// <section className="section">{rows}</section>
```

#### `col`
```
/*
 * @param {string} className - the group identifier for all columns within.
 * @param {string} fieldName - the name for lookup with `getFieldProps`+`renderField`
 * @return {node}
 */
col(renderField, className, ...names)
// <div className={className}>
//  {names.map(name => renderField(name))}
// </className>

```
