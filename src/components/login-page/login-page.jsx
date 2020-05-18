import React from 'react';
import { Form, Button } from "react-bootstrap";

import firefighterAPI from "../../api/firefighter-api";

import "./login-page.scss";
import {saveCurrentUser} from "../../utils/user-authorization";

class LoginPage extends React.Component {
  state = {
    login: "",
    password: "",
    message: null
  };

  handleInputChange = event => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  };

  logIn = (e) => {
    e.preventDefault();
    const { login, password } = this.state;
    firefighterAPI
      .post(`/api/user/login`, { login, password })
      .then((response) => {
        if (response.status === 200) {
          saveCurrentUser(response.data);
          this.props.history.push("/");
        } else {
          this.setState({ message: response.data.message })
        }
      })
      .catch(reason => console.log(reason));
  };

  render() {
    const { login, password } = this.state;
    return (
      <Form className="login-form" onSubmit={ this.logIn }>
        <Form.Group controlId="formBasicEmail">
          <Form.Label>Логин</Form.Label>
          <Form.Control type="login" name="login" value={ login } onChange={ this.handleInputChange } />
        </Form.Group>

        <Form.Group controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" name="password" value={ password } onChange={ this.handleInputChange } />
        </Form.Group>
        <Button variant="primary" type="submit">
          Войти
        </Button>
      </Form>
    )
  }
}

export default LoginPage;