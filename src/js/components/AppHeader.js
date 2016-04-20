import React, { PropTypes } from 'react';
import { Link } from 'react-router';

const AppHeader = ({ displaySidebarButton }) => {
  return (
    <header className="main-header">
      <Link to="/" className="logo">
        <span className="logo-lg"><b>Sync</b> Gateway</span>
        <span className="logo-mini"><b>S</b>GW</span>
      </Link>
      <nav className="navbar navbar-static-top" role="navigation">
        {(()=>{
          if (displaySidebarButton)
            return (
              <a href="#" 
                 className="sidebar-toggle" 
                 data-toggle="offcanvas" 
                 role="button">
              </a>
            );
        })()}
        <div className="navbar-custom-menu">
          <ul className="nav navbar-nav">
            <li><a href="http://mobile.couchbase.com">Couchbase Mobile</a></li>
          </ul>
        </div>
      </nav>
    </header>
  );
}

AppHeader.propTypes = { displaySidebarButton: PropTypes.bool }
AppHeader.defaultProps = { displaySidebarButton: false }

export default AppHeader;