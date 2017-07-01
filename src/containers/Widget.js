import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import {
  invokeApig,
} from '../libs/awsLib';

class Widget extends Component {
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
    });
  }

  render() {
    return (
      <div>
        {this.state.widget && (<div>
            <div>{this.state.widget.name}</div>
        </div>)}
      </div>
    );
  }
}

export default withRouter(Widget);

