import React from 'react';

const SearchBar = (props) => {
  return (
    <div>
      <form>
        <input type="text" placeholder="Search..." name="search" onChange={props.onSearch} />
      </form>
    </div>
  );
};

export default SearchBar;