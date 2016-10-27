import React from 'react';

var layoutCount = 0;
export const layout = (...children) => {
    return <div key={`layout-${layoutCount++}`} className="layout">{children}</div>;
};

var sectionCount = 0;
export const section = (name, ...rows) => {
    const renderedRows = rows.map((cols, index) => {
        return <div key={`columns-${index}`} className="columns">{cols}</div>;
    });
    return (
        <div key={`section-${sectionCount++}`} className="section">
            {name && name !== ''? <h5>{name}</h5> : <div />}
            {renderedRows}
        </div>);
};

export const col = (renderField, type, ...fields) => {
    if(fields.length == 0)
        return <div className={`column ${type}`} />;

    return fields.map((field, index) => {

        return (
        <div key={`col-${index}`}
            className={`column ${type}`}>
            {typeof field === 'string' ? renderField(field) : field}
        </div>);
    });
};
