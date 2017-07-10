import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';

const action = 'https://money.yandex.ru/quickpay/confirm.xml';

class Pay extends Component {
  constructor(props) {
    super(props);

    this.state = {
        user: {
            ymaccount: '41001986932266'
        }
    }
  }

  render() {
    return (
        <div>
            <form method="POST" target="_blank" action={action}>
                <input name="label" type="hidden" value=""/>
                <input name="receiver" type="hidden" value={this.state.user.ymaccount}/>
                <input name="quickpay-form" type="hidden" value="donate"/>
                <input name="is-inner-form" type="hidden" value="true"/>
                <input name="writable-sum" type="hidden" value="true"/>
                <input name="targets" type="hidden" value="Донат"/>
                <input name="successURL" type="hidden" value="123"/>

                <input name="sum" type="text" maxlength="10" value="123"/>

                <textarea name="comment" maxlength="60"></textarea>

                <input type="radio" name="paymentType" checked id="AC" value="AC"/>
                <input type="radio" name="paymentType" id="MC" value="MC"/>
                <input type="radio" name="paymentType" id="PC" value="PC"/>

                <button type="submit">Донатить</button>
            </form>
        </div>
    );
  }
};

export default withRouter(Pay);
