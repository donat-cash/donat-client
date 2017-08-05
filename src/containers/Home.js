import React, { Component } from 'react';
import {
  Link,
  withRouter,
} from 'react-router-dom';

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
    if (this.props.accessToken === null) {
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
      path: '/widgets',
    }, this.props.accessToken);
  }

  renderWidgetsList(widgets) {
    return widgets.map((widget) => (
      <li key={widget.widgetId}>
        <Link to={`/widgets/${widget.widgetId}`}>
          {widget.name}
        </Link>
      </li>
    ));
  }

  renderLander() {
    return (
      <div>
        <h1>Donat</h1>

        <p>A simple widgets for donation</p>
      </div>
    );
  }

  renderSettings() {
    return (
      <div>
        <h1>Settings</h1>

        <p>
          <Link to={`/users/${this.props.userId}`}>Your donation page</Link>
        </p>

        <h2>Your Widgets</h2>

        <Link to="/widgets/new">
          Create a new widget
        </Link>

        <ul>
          {
            this.state.isLoading
              ? <li>Loading</li>
              : this.renderWidgetsList(this.state.widgets)
          }
        </ul>
      </div>
    );
  }

  render() {
    return (
      <div>
        {
          this.props.accessToken === null
            ? this.renderLander()
            : this.renderSettings()
        }
      </div>
    );
  }
}

export default withRouter(Home);

