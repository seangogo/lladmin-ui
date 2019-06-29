import React from 'react';

const OmpIcon = props => {
  const { type, onClick, className, ...restProps } = props;
  return <i className={`ompIcon ${type} ${className}`} onClick={onClick} {...restProps} />;
};

export default OmpIcon;
