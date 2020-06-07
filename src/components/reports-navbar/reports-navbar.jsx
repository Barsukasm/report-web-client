import React from "react";
import {Navbar, Nav, Button} from "react-bootstrap";
import firefighterAPI from "../../api/firefighter-api";
import {getCurrentUser, saveCurrentUser} from "../../utils/user-authorization";

class ReportsNavbar extends React.Component {
  exit = () => {
    const token = getCurrentUser().sessionToken;
    firefighterAPI
      .get(`/api/user/logoff`, {
        headers: {
          SessionToken: token
        }
      })
      .then(() => {
        saveCurrentUser(null);
        this.props.history.push("/login");
      })
      .catch(reason => {
        console.log(reason);
        saveCurrentUser(null);
        this.props.history.push("/login");
      });
  };

  render() {
    return (
      <Navbar bg="light">
        <Navbar.Brand href="/">На главную</Navbar.Brand>
        <Nav className="mr-auto">
          <Nav.Link href="/technicians">Техники</Nav.Link>
          <Nav.Link href="/payments">Оплаты</Nav.Link>
          <Nav.Link href="/debts">Долги</Nav.Link>
        </Nav>
        <Button variant="primary" onClick={ this.exit }>Выйти</Button>
      </Navbar>
    );
  }
}

export default ReportsNavbar;