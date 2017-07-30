import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import {
  invokeApig,
  s3Upload,
} from '../libs/awsLib';
import config from '../config.js';
import LoaderButton from '../components/LoaderButton';

class Pages extends Component {
  constructor(props) {
    super(props);

    this.file = null;

    this.state = {
      page: null,
      name: '',
    };
  }

  async componentDidMount() {
    try {
      const page = await this.getPage();

      this.setState({
        page,
        name: page.name,
      });
    }
    catch(e) {
      console.error(e);
    }
  }

  getPage() {
    return invokeApig({
      path: `/pages/${this.props.match.params.id}`,
    }, this.props.userToken);
  }

  validateForm() {
    return this.state.name.length > 0;
  }

  formatFilename(str) {
    return str.length < 50
      ? str
      : `${str.substr(0, 20)}...${str.substr(str.length - 20, str.length)}`;
  }

  handleChange = ({ target }) => {
    this.setState({
      [target.id]: target.value,
    });
  }

  handleFileChange = ({ target }) => {
    this.file = target.files[0];
  }

  savePage(page) {
    return invokeApig({
      path: `/pages/${this.props.match.params.id}`,
      method: 'put',
      body: page,
    }, this.props.userToken);
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
      await this.savePage({
        ...this.state.page,
        name: this.state.name,
        attachment: this.file ? (await s3Upload(this.file, this.props.userToken)).Location : this.state.page.attachment,
      });

      this.props.history.push('/');
    }
    catch(e) {
      console.error(e);

      this.setState({
        isLoading: false,
      });
    }
  }

  deletePage() {
    return invokeApig({
      path: `/pages/${this.props.match.params.id}`,
      method: 'delete',
    }, this.props.userToken);
  }

  handleDelete = async (event) => {
    event.preventDefault();

    const confirmed = window.confirm('Are you sure you want to delete this note?');

    if (!confirmed) {
      return;
    }

    this.setState({
      isDeleting: true,
    });

    try {
      await this.deletePage();

      this.props.history.push('/');
    }
    catch(e) {
      console.error(e);

      this.setState({
        isDeleting: false,
      });
    }
  }

  render() {
    return (
      <div>
        {this.state.page && (
          <form onSubmit={this.handleSubmit}>
            <label htmlFor="name">Name</label>

            <input
              id="name"
              name="name"
              onChange={this.handleChange}
              value={this.state.name}
            />

            {this.state.widget.attachment && (
              <a
                target="_blank"
                rel="noopener noreferrer"
                href={this.state.page.attachment}
              >
                {this.formatFilename(this.state.page.attachment)}
              </a>
            )}

            {!this.state.page.attachment && (
              <label>Background</label>
            )}

            <input
              id="file"
              name="file"
              type="file"
              onChange={this.handleFileChange}
            />

            <LoaderButton
              type="submit"
              disabled={!this.validateForm()}
              isLoading={this.state.isLoading}
              text="Save"
              loadingText="Saving…"
            />

            <LoaderButton
              isLoading={this.state.isDeleting}
              onClick={this.handleDelete}
              text="Delete"
              loadingText="Deleting…"
            />
          </form>
        )}
      </div>
    );
  }
}

export default withRouter(Pages);

