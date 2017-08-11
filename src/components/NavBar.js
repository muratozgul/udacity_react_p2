import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Menu, Icon, Dropdown } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { getAllCategories } from '../redux/categoryStore';
import { sortPosts } from '../redux/postStore';
import { openNewForm } from '../redux/postFormStore';

class NavBar extends Component {
  constructor(props) {
    super(props);
    this.sortOptions = [
      { field: 'voteScore', order: 'desc', text: 'Score: High to Low' },
      { field: 'voteScore', order: 'asc', text: 'Score: Low to High' },
      { field: 'timestamp', order: 'desc', text: 'Date: New to Old' },
      { field: 'timestamp', order: 'asc', text: 'Date: Old to New' }
    ];
  }

  componentDidMount() {
    this.props.dispatch(getAllCategories());
  }

  handleSort = (field, order) => {
    this.props.dispatch(sortPosts(field, order));
  };

  handleNewPost = () => {
    this.props.dispatch(openNewForm());
  };

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
        active={currentPath.startsWith(`/${pathName}`)}
        onClick={this.handleItemClick}
      />
    );
  }

  renderSortDropdown() {
    const { sortBy, sortOrder } = this.props;

    return (
      <Dropdown item text='Sort'>
        <Dropdown.Menu>
          {
            this.sortOptions.map(option => {
              const { field, order, text } = option;
              const isSelected = (field === sortBy) && (order === sortOrder);
              return (
                <Dropdown.Item key={`${field}-${order}`}
                  onClick={() => this.handleSort(field, order)}
                >
                  { isSelected ? <b>{text}</b> : text }
                </Dropdown.Item>
              );
            })
          }
        </Dropdown.Menu>
      </Dropdown>
    );
  }

  render() {
    const { pathNames } = this.props;
    const currentPath = _.get(this.props, 'location.pathname', '/');

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
        <Menu.Menu position='right'>
          <Menu.Item name={'newPost'} onClick={this.handleNewPost} />
          {this.renderSortDropdown()}
        </Menu.Menu>
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
    pathNames: state.category.categories,
    sortBy: state.post.sortBy,
    sortOrder: state.post.sortOrder
  };
};

export default withRouter(connect(mapStateToProps)(NavBar));
