import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Modal, Form, Button } from 'semantic-ui-react';
import {
  closeForm, submitForm, formChange, discardForm
} from '../redux/postFormStore';

class PostForm extends Component {
  handleClose = () => {
    this.props.dispatch(closeForm());
  }

  handleDiscard = () => {
    this.props.dispatch(discardForm());
  };

  handleSubmit = () => {
    this.props.dispatch(submitForm());
  }

  handleChange = (e, { name, value }) => {
    this.props.dispatch(formChange(name, value));
  }

  renderForm() {
    const { submitting, author, category, title, body, formType } = this.props;
    const categories = this.props.categories.map(c => {
      return { key: c, text: _.upperFirst(c), value: c };
    });

    return (
      <Form loading={submitting}>
        <Form.Group widths='equal'>
          <Form.Input label='Username' placeholder='Username'
            name='author' value={author} onChange={this.handleChange}
            disabled={formType === 'edit'}
          />
          <Form.Select label='Category' options={categories}
            name='category' value={category} placeholder='Category'
            onChange={this.handleChange}
            disabled={formType === 'edit'}
          />
        </Form.Group>
        <Form.Input label='Title' placeholder='Title'
          name='title' value={title} onChange={this.handleChange}
        />
        <Form.TextArea label='Content' name='body' onChange={this.handleChange}
          value={body} placeholder='What is on your mind?'
        />
      </Form>
    );
  }

  render() {
    const { visible, submitDisabled, formType } = this.props;
    return (
      <Modal dimmer='blurring' open={visible} onClose={this.handleDiscard}>
        <Modal.Header>
          { formType === 'edit' ? 'Edit Post' : 'Create a New Post' }
        </Modal.Header>
        <Modal.Content>
          {this.renderForm()}
        </Modal.Content>
        <Modal.Actions>
          <Button color='black' onClick={this.handleDiscard}
            content='Discard'
          />
          <Button positive icon='checkmark' labelPosition='right'
            onClick={this.handleSubmit}
            content={ formType === 'edit' ? 'Update' : 'Post' }
            disabled={submitDisabled} />
        </Modal.Actions>
      </Modal>
    );
  }
};

PostForm.propTypes = {
  submitDisabled: PropTypes.bool,
  visible: PropTypes.bool,
  submitting: PropTypes.bool,
  submitError: PropTypes.object,
  categories: PropTypes.arrayOf(PropTypes.string),
  author: PropTypes.string,
  category: PropTypes.string,
  title: PropTypes.string,
  body: PropTypes.string,
  formType: PropTypes.oneOf(['new', 'edit'])
};

PostForm.defaultProps = {
  submitDisabled: true,
  visible: false,
  submitting: false,
  submitError: null,
  categories: [],
  formType: 'new'
};

const mapStateToProps = (state, ownProps) => {
  const { visible, submitting, submitError, formType, postData } = state.postForm;
  const { categories } = state.category;
  const requiredFields = ['title', 'body'];
  if (formType === 'new') {
    requiredFields.push('author', 'category');
  }
  const submitDisabled = requiredFields.some(field => {
    const value = postData[field];
    return !(_.isString(value) && _.trim(value).length > 0);
  });

  return {
    formType,
    submitDisabled,
    visible,
    submitting,
    submitError,
    ...postData,
    categories
  };
};

export default connect(mapStateToProps)(PostForm);
