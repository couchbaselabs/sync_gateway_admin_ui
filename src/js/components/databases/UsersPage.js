import React, { PropTypes } from 'react';

const UsersPage = (props) => {
  return (
    <div>
      <h2>Users</h2>
      {props.children}
    </div>
  );
}
export default UsersPage;
