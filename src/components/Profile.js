import React, { Component } from "react";
import styled from "styled-components";

const Container = styled.div`
  align-items: center;
  display: ${props => (props.loggedIn ? "flex" : "none")};
  grid-row-start: 4;
  margin-top: 2rem;

  p {
    margin-bottom: 0;
    margin-top: -0.25rem;
    padding-left: 0.5rem;
  }

  @media (min-width: 640px) {
    grid-row-start: 3;
    margin-top: 0;
  }
`;

const Pic = styled.img`
  border-radius: 50%;
  height: 2.5rem;
  width: 2.5rem;
`;

export default class Profile extends Component {
  render() {
    return (
      <Container loggedIn={this.props.loggedIn}>
        <Pic photo={this.props.photo.length > 0} src={this.props.photo} />
        <p>
          <small>
            {this.props.displayName}
            <br />
            <a href="./auth/spotify/logout">Logout</a>
          </small>
        </p>
      </Container>
    );
  }
}
