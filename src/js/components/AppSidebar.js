import React, { PropTypes } from 'react';
import { Link } from 'react-router';

const AppSidebar = ({ sidebar }) => {
  return (
    <aside className="main-sidebar">
      <div className="sidebar">
        <ul className="sidebar-menu">
          <li className="header">MAIN MENU</li>
          <li className="active"><a href="#"><i className="fa fa-file-text"></i> <span>Documents</span></a></li>
          <li><a href="#"><i className="fa fa-filter"></i> <span>Channels</span></a></li>
          <li><a href="#"><i className="fa fa-circle-o-notch"></i> <span>Changes Feeds</span></a></li>
          <li><a href="#"><i className="fa fa-user"></i> <span>Users</span></a></li>
          <li><a href="#"><i className="fa fa-cogs"></i> <span>Configuration</span></a></li>
        </ul>
      </div>
    </aside>
  );
}

AppSidebar.propTypes = { 
  sidebar: PropTypes.object
}

export default AppSidebar;
