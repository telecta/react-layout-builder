import React from 'react';

export const layout = (...children) => {
  return (
    <div className="layout">
      {children}
    </div>
  );
};

export const section = (key, name, ...rows) => {
  const renderedRows = rows.map((cols, index) => {
    return (
      <div key={`columns-${index}`} className="columns">
        {cols}
      </div>
    );
  });
  return (
    <div key={key} className="section">
      {name && name !== ''
        ? <h5>
            {name}
          </h5>
        : <div />}
      {renderedRows}
    </div>
  );
};

export const col = (renderField, className, ...fields) => {
  if (fields.length === 0) return <div className={`column ${className}`} />;

  return fields.map((field, index) => {
    return (
      <div key={`col-${index}`} className={`column ${className}`}>
        {typeof field === 'string' ? renderField(field) : field}
      </div>
    );
  });
};
