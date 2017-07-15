import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import {
  invokeApig,
  s3Upload,
} from '../libs/awsLib';
import config from '../config.js';
import LoaderButton from '../components/LoaderButton';

class NewWidget extends Component {
  constructor(props) {
    super(props);

    this.file = null;

    this.state = {
      isLoading: null,
      name: '',
    };
  }

  validateForm() {
    return this.state.name.length > 0;
  }

  handleChange = ({ target }) => {
    this.setState({
      [target.id]: target.value,
    });
  }

  handleFileChange = ({ target }) => {
    this.file = target.files[0];
  }

  handleSubmit = async (event) => {
    event.preventDefault();

    if (this.file && this.file.size > config.MAX_ATTACHMENT_SIZE) {
      console.error('Please pick a file smaller than 5MB');

      return;
    }

    this.setState({
      isLoading: true,
    });

    try {
      const uploadedFilename = this.file
        ? (await s3Upload(this.file, this.props.userToken)).Location
        : null;

      await this.createWidget({
        name: this.state.name,
        attachment: uploadedFilename,
      });

      this.props.history.push('/');
    }
    catch(e) {
      console.error(e);

      this.setState({
        isLoading: false
      });
    }
  }

  createWidget(widget) {
    return invokeApig({
      path: '/widgets',
      method: 'post',
      body: widget,
    }, this.props.userToken);
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label htmlFor="name">Name</label>

        <input
          id="name"
          name="name"
          value={this.state.name}
          onChange={this.handleChange}
        />

        <label htmlFor="file">Background</label>

        <input
          id="file"
          name="file"
          type="file"
          value={this.state.file}
          onChange={this.handleFileChange}
        />

        <LoaderButton
          type="submit"
          disabled={!this.validateForm()}
          isLoading={this.state.isLoading}
          text="Create"
          loadingText="Creating…"
        />
      </form>
    );
  }
}

export default withRouter(NewWidget);

