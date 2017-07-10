import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import {
  invokeApig,
  s3Upload,
} from '../libs/awsLib';
import config from '../config.js';
import LoaderButton from '../components/LoaderButton';

class Widgets extends Component {
  constructor(props) {
    super(props);

    this.state = {
      widget: null,
    };
  }

  async componentDidMount() {
    try {
      const widget = await this.getWidget();

      this.setState({
        widget,
      });
    }
    catch(e) {
      console.error(e);
    }
  }

  getWidget() {
    return invokeApig({
      path: `/widgets/${this.props.match.params.id}`,
    }, this.props.userToken);
  }

  validateForm() {
    return this.state.widget && this.state.widget.name && this.state.widget.name.length > 0;
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

  saveWidget(widget) {
    return invokeApig({
      path: `/${this.props.match.params.id}`,
      method: 'put',
      body: widget,
    }, this.props.userToken);
  }

  handleSubmit = async (event) => {
    event.preventDefault();

    this.setState({
      isLoading: true,
    });

    try {
      await this.saveWidget({
        ...this.state.note,
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

  deleteWidget() {
    return invokeApig({
      path: `/${this.props.match.params.id}`,
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
      await this.deleteWidget();

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
        {this.state.widget && (
          <form onSubmit={this.handleSubmit}>
            <label htmlFor="name">Name</label>

            <input
              id="name"
              name="name"
              onChange={this.handleChange}
              value={this.state.widget.name}
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

export default withRouter(Widgets);

