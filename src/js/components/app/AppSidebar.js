import React, { PropTypes } from 'react';
import { Link } from 'react-router';

const AppSidebar = (props) => {
  return (
    <aside className="main-sidebar">
      <div className="sidebar">
        <ul className="sidebar-menu">
          <li className="header">MAIN MENU</li>
          <li className="active">
            <Link to="/databases">
              <i className="fa fa-database"></i> <span>Databases</span>
            </Link>
          </li>
        </ul>
      </div>
    </aside>
  );
}

export default AppSidebar;
