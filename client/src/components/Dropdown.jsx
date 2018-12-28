import React from 'react';

const Dropdown = (props) => {
  return (
    <div>
    <select className>
      <option value="earliest">Earliest</option>
      <option value="latest">Latest</option>
    </select>
    </div>
  )
};

export default Dropdown;
