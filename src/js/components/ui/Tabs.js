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

    const selectedTabId = this.resolveActiveTabId(tabs);
    if (!selectedTabId) {
      console.log("WARNING: Tabs component couldn't find an active tab.");
      return;
    }

    const routes = this.getRoutesFromTabs(tabs);

    this.setState(Object.assign({ }, this.state, {
      selectedTabId, routes
    }));
  }

  componentWillReceiveProps(nextProps) {
    // TODO: 
    // Currently assuming that the configuration will not change, which is
    // not correct. What should be done is comparing this.props.tabs and 
    // nextProps.tabs. If there are some changes, reset routes states.

    const { tabs } = nextProps;

    // Recalculate selected tab:
    let selectedTabId = this.resolveActiveTabId(tabs);
    if (!selectedTabId) {
      console.log("WARNING: Tabs component couldn't find an active tab.");
      return;
    }

    if (this.state.selectedTabId !== selectedTabId) {
      this.setState((prevState, currentProps) => {
        return Object.assign({ }, prevState, {
          selectedTabId
        })
      });
    }
  }

  resolveActiveTabId(tabs) {
    const { router } = this.context;

    let active = null;
    for (let tab of tabs) {
      if (router.isActive(tab.to, false)) {
        active = tab.id;
        break;
      }
    }
    return active;
  }

  getRoutesFromTabs(tabs) {
    const routes = { };
    for (let tab of tabs) {
      routes[tab.id] = tab.to;
    }
    return routes;
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
      <div className="nav-tabs-custom" style={{marginBottom: '0px'}}>
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
