import React, { Component } from "react";
import styled from "styled-components";

const Button = styled.a`
  background: var(--color-green);
  border-radius: 1.5rem;
  color: var(--color-white);
  display: inline-block;
  grid-row-start: 4;
  height: 2.25rem;
  margin-top: 2rem;
  padding: 0.5rem 2rem 0.5rem;
  text-align: center;
  text-decoration: none;
  width: 12.05rem;

  :hover {
    background: var(--color-greenHover);
    transform: scale(1.02);
  }

  @media (min-width: 640px) {
    grid-row-start: 4;
  }
`;

export default class Login extends Component {
  render() {
    return <Button href="./auth/spotify">Login with Spotify</Button>;
  }
}
