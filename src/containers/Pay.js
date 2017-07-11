import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import styled from 'styled-components';
const Color = require('color');

const ACTION = 'https://money.yandex.ru/quickpay/confirm.xml';

const BASE_COLOR = Color('#1abc9c');


const Page = styled.div`
  background-color: ${BASE_COLOR.rotate(10).string()};
  display: flex;
  height: 100%;
`;

const Form = styled.form`
  border: 3px solid ${BASE_COLOR.rotate(300).string()};
  border-radius: 3px;
  background-color: ${BASE_COLOR.rotate(70).string()};
  margin: auto;
  width: 500px;
  box-sizing: border-box;
`;

const Group = styled.div`
  margin: 1em;
`;

const Label = styled.label`
  font-size: 1.5em;
  color: ${BASE_COLOR.rotate(300).string()};
`;

const TextInput = styled.input`
  width: 100%;
  border: 2px solid ${BASE_COLOR.rotate(300).string()};
  font-size: 1.5em;
  padding: 6px 10px;
  color: ${BASE_COLOR.rotate(300).string()};
  box-sizing: border-box;
`;

const Textarea = styled.textarea`
  width: 100%;
  border: 2px solid ${BASE_COLOR.rotate(300).string()};
  font-size: 1.5em;
  padding: 6px 10px;
  color: ${BASE_COLOR.rotate(300).string()};
  box-sizing: border-box;
`;

const RadioButton = styled.label`
  color: ${BASE_COLOR.rotate(300).string()};
  display: block;
  box-sizing: border-box;
`;

const ButtonGroup = styled.div`
  box-sizing: border-box;
`;

const Buttom = styled.button`
  border-radius: 3px;
  font-size: 1.5em;
  padding: 0.25em 1em 0.5em;
  background: transparent;
  color: ${BASE_COLOR.rotate(300).string()};
  border: 2px solid ${BASE_COLOR.rotate(300).string()};
  box-sizing: border-box;
`;

class Pay extends Component {
  constructor(props) {
    super(props);

    this.state = {
        user: {
            ymaccount: '41001986932266'
        },
        widgetId: 1,
        defaultSum: 100,
        successURL: '',
        buttonText: 'Донатить',
        targets: 'Донатить', // назначение
        sumLabel: 'Сумма',
        commentLabel: 'Комментарий',
        paymentTypeLabel: 'Способ оплаты',
    }
  }

  render() {
    const {
      user,
      widgetId,
      defaultSum,
      successURL,
      buttonText,
      commentLabel,
      paymentTypeLabel,
      sumLabel,
      targets
    } = this.state;

    return (
        <Page>
            <Form method="POST" target="_blank" action={ACTION}>

                <input name="label" type="hidden" value={widgetId}/>
                <input name="receiver" type="hidden" value={user.ymaccount}/>

                <input name="quickpay-form" type="hidden" value="donate"/>
                <input name="is-inner-form" type="hidden" value="true"/>
                <input name="writable-sum" type="hidden" value="true"/>

                <input name="targets" type="hidden" value={targets}/>
                <input name="successURL" type="hidden" value={successURL}/>

                <Group>
                  <Label for="sum">{sumLabel}</Label>
                  <TextInput name="sum" id="sum" type="text" maxlength="10" value={defaultSum}/>
                </Group>

                <Group>
                  <Label for="comment">{commentLabel}</Label>
                  <Textarea name="comment" id="comment" maxlength="60"/>
                </Group>

                <Group>
                  <Label>{paymentTypeLabel}</Label>

                  <ButtonGroup>
                    <RadioButton>
                      <span>Картой</span>
                      <input type="radio" name="paymentType" checked="checked" id="AC" value="AC"/>
                    </RadioButton>

                    <RadioButton>
                      <span>Телефоном</span>
                      <input type="radio" name="paymentType" id="MC" value="MC"/>
                    </RadioButton>

                    <RadioButton>
                      <span>Яндекс-кошельком</span>
                      <input type="radio" name="paymentType" id="PC" value="PC"/>
                    </RadioButton>
                  </ButtonGroup>

                </Group>

                <Group>
                  <Buttom type="submit">{buttonText}</Buttom>
                </Group>

            </Form>
        </Page>
    );
  }
};

export default withRouter(Pay);
