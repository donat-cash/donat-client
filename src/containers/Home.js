import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import { invokeApig } from '../libs/awsLib';

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      widgets: [],
    };
  }

  async componentDidMount() {
    if (this.props.userToken === null) {
      return;
    }

    this.setState({
      isLoading: true,
    });

    try {
      const widgets = await this.widgets();

      this.setState({
        widgets,
      });
    }
    catch(e) {
      console.error(e);
    }

    this.setState({
      isLoading: false,
    });
  }

  widgets() {
    return invokeApig({
      path: '/',
    }, this.props.userToken);
  }

  renderWidgetsList(widgets) {
    return widgets.map((widget) => (
      <li key={widget.widgetId}>
        <a
          href={`/widgets/${widget.widgetId}`}
          onClick={this.handleWidgetClick}
        >
          {`Created: ${(new Date(widget.createdAt)).toLocaleString()}`}
        </a>
      </li>
    ));
  }

  handleWidgetClick = (event) => {
    event.preventDefault();

    this.props.history.push(event.currentTarget.getAttribute('href'));
  }

  renderLander() {
    return (
      <div>
        <h1>Donat</h1>
        <p>A simple widgets for donation</p>
      </div>
    );
  }

  renderWidgets() {
    return (
      <div>
        <h1>Your Widgets</h1>
        <ul>
          <li>
            <a
              key="new"
              href="/widgets/new"
              onClick={this.handleWidgetClick}
            >
              Create a new widget
            </a>
          </li>
          {!this.state.isLoading && this.renderWidgetsList(this.state.widgets)}
        </ul>
      </div>
    );
  }

  render() {
    return (
      <div>
        {
          this.props.userToken === null
            ? this.renderLander()
            : this.renderWidgets()
        }
      </div>
    );
  }
}

export default withRouter(Home);

