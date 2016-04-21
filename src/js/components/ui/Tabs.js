import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import classNames from 'classnames';

class Tabs extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      selectedTabId: null,
      routes: null
    };
    this.onClick = this.onClick.bind(this);
  }

  componentWillMount() {
    const { tabs } = this.props;

    if (tabs.length === 0)
      return;

    let selectedTabId = null;
    const { router } = this.context;
    const routes = { };
    for (let tab of tabs) {
      if (router.isActive(tab.to, false))
        selectedTabId = tab.id;
      routes[tab.id] = tab.to;
    }

    if (!selectedTabId)
      console.log("WARNING: Tabs component couldn't find an active tab.");

    this.setState(Object.assign({ }, this.state, {
      selectedTabId: selectedTabId || tabs[0].id,
      routes
    }));
  }

  onClick(tab) {
    const { selectedTabId, routes } = this.state;

    let to;
    if (tab.id === selectedTabId)
      to = tab.to;
    else {
      // TODO: 
      // 1. We will need to handle baseURL when integrating with SG.
      // 2. We may also need to handle query.
      // 3. Check if there is a way to get the info from the router or history.
      to = window.location.pathname;
    }

    const newRoutes = Object.assign({ }, routes, {
      [selectedTabId]: to
    })

    this.setState(Object.assign({ }, this.state, { 
      selectedTabId: tab.id, 
      routes: newRoutes
    }));
  }

  render() {
    const { tabs } = this.props;
    const { selectedTabId, routes } = this.state;

    const tabItems = tabs.map((tab) => {
      const to = routes[tab.id];
      const classes = classNames({
        active: (tab.id === selectedTabId)
      });
      
      return (
        <li key={tab.id} role="presentation" className={classes}>
          <Link to={to} onClick={this.onClick.bind(this, tab)}>{tab.name}</Link>
        </li>
      );
    });

    return (
      <div className="nav-tabs-custom">
        <ul className="nav nav-tabs">
          {tabItems}
        </ul>
        {this.props.children}
      </div>
    );
  }
}

Tabs.propTypes = {
  tabs: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    to: PropTypes.string.isRequired,
    preseveLastRoute: PropTypes.bool
  })).isRequired,
  routes: PropTypes.array.isRequired,
  params: PropTypes.object.isRequired
};

Tabs.contextTypes = {
  router: PropTypes.object.isRequired
};

export default Tabs;
