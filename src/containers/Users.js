import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import styled from 'styled-components';
import Color from 'color';

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

class Users extends Component {
  render() {
    return (
      <Page>
        <Form method="post" target="_blank" action="https://money.yandex.ru/quickpay/confirm.xml">
          <input name="receiver" type="hidden" value={this.props.match.params.id}/>
          <input name="quickpay-form" type="hidden" value="donate"/>
          <input name="is-inner-form" type="hidden" value="true"/>
          <input name="writable-sum" type="hidden" value="true"/>
          <input name="targets" type="hidden" value="From donat.cash"/>

          <Group>
            <Label for="sum">Sum</Label>
            <TextInput name="sum" id="sum" type="text" maxlength="10"/>
          </Group>

          <Group>
            <Label for="comment">Message</Label>
            <Textarea name="comment" id="comment" maxlength="60"/>
          </Group>

          <Group>
            <ButtonGroup>
              <RadioButton>
                <span>Card</span>
                <input type="radio" name="paymentType" id="AC" value="AC" defaultChecked="checked"/>
              </RadioButton>

              <RadioButton>
                <span>Phone</span>
                <input type="radio" name="paymentType" id="MC" value="MC"/>
              </RadioButton>

              <RadioButton>
                <span>Yandex.Money</span>
                <input type="radio" name="paymentType" id="PC" value="PC"/>
              </RadioButton>
            </ButtonGroup>
          </Group>

          <Group>
            <Buttom type="submit">Donate</Buttom>
          </Group>
        </Form>
      </Page>
    );
  }
};

export default withRouter(Users);

