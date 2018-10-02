import React from 'react';
import {Link} from 'react-router-dom';
import {
  Nav,
  Button,
  Navbar,
  NavItem,
  NavDropdown,
  MenuItem
} from 'react-bootstrap'
////import SignIn from './SignIn';
require("react-bootstrap/lib/NavbarHeader"); //
//<Navbar></Navbar>;
class NavB extends React.Component {
  render() {
    return (
    <Navbar>
      <Navbar.Header>
        <Navbar.Brand>
          <a href="#home">Accountability</a>
        </Navbar.Brand>
      </Navbar.Header>
      <Nav>
        <NavItem eventKey={1} href="#">
          Link
        </NavItem>
        <NavItem eventKey={2} href="#">
          Link
        </NavItem>
      </Nav>
    </Navbar>)
  }
}

export default NavB;
