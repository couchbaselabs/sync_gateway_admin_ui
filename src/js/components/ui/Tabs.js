import React, { PropTypes } from 'react';
import { Link, browserHistory } from 'react-router';
import classNames from 'classnames';

class Tabs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTab: null,
      lastRoutePath: { }
    };
    this.onTab = this.onTab.bind(this);
  }

  componentWillMount() {
    const { tabs } = this.props;

    if (!this.state.selectedTab) {
      const selectedTab = tabs.length > 0 ? tabs[0].id : null;
      this.setState(Object.assign({ }, this.state, { selectedTab }));
    }
  }

  onTab(tab, event) {
    event.preventDefault();

    const { selectedTab, lastRoutePath } = this.state;

    let destination = null;
    let lastPathToSave = null;

    if (tab.id === selectedTab) {
      destination = tab.to;
      lastPathToSave = tab.to;
    } else {
      destination = lastRoutePath[tab.id] || tab.to;
      lastPathToSave = window.location.pathname
    }

    const savedPath = Object.assign({ }, this.state.lastRoutePath, {
        [selectedTab]: lastPathToSave
    })

    this.setState(Object.assign({ }, this.state, { 
      selectedTab: tab.id, 
      lastRoutePath: savedPath 
    }));

    browserHistory.push(destination);
  }

  render() {
    const { tabs } = this.props;
    const tabLinks = tabs.map((tab) => {
      const classes = classNames({
        active: (tab.id === this.state.selectedTab)
      });
      return (
        <li key={tab.id} role="presentation" className={classes}>
          <a href="#" onClick={this.onTab.bind(this, tab)}>{tab.name}</a>
        </li>
      );
    });
    return (
      <div className="nav-tabs-custom">
        <ul className="nav nav-tabs">
          {tabLinks}
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

export default Tabs;