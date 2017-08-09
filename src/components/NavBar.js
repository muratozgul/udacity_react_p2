import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Menu, Icon } from 'semantic-ui-react';
import { connect } from 'react-redux';

class NavBar extends Component {
  handleItemClick = (e, { name }) => {
    if (this.props.pathNames.indexOf(name) > -1) {
      this.props.history.push(`/${name}`);
    } else {
      this.props.history.push('/');
    }
  }

  renderMenuItem(pathName, currentPath) {
    return (
      <Menu.Item name={pathName} key={pathName}
        active={pathName === currentPath}
        onClick={this.handleItemClick}
      />
    );
  }

  render() {
    const { pathNames } = this.props;
    const currentPath = _.get(this.props, 'match.params.category', '/');

    return (
      <Menu pointing secondary>
        <Menu.Item icon='home' name={'home'} key={'home'}
          active={'/' === currentPath}
          onClick={this.handleItemClick}
        />
        {
          pathNames.map(pathName => {
            return this.renderMenuItem(pathName, currentPath);
          })
        }
      </Menu>
    );
  }
};

NavBar.propTypes = {
  pathNames: PropTypes.arrayOf(PropTypes.string)
};

NavBar.defaultProps = {
  pathNames: []
};

const mapStateToProps = (state, ownProps) => {
  return {
    pathNames: state.category.categories
  };
};

export default withRouter(connect(mapStateToProps)(NavBar));
