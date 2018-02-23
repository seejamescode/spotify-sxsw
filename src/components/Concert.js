import React, { Component } from "react";
import styled, { keyframes } from "styled-components";

const fadeIn = keyframes`
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
`;

const gradientColors = [
  "#f5e6ca",
  "#41bdd4",
  "#f2684b",
  "#f39ec3",
  "#20439B",
  "#9BB6DE"
];

const gradient = function() {
  const initialX = Math.random() * 100;
  const initialY = Math.random() * 100;

  return keyframes`
    0% {
      background-position: ${initialX}% ${initialY}%
    }
    50% {
      background-position: ${Math.random() * 100}% ${Math.random() * 100}%
    }
    100% {
      background-position: ${initialX}% ${initialY}%
    }
  `;
};

const Link = styled.a`
  animation: ${fadeIn} 1s ease-out;
  background: var(--color-blackMenu);
  height: 100%;
  padding: 2rem;
  position: relative;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const Skeleton = styled.div`
  animation: ${props => props.gradient} ${props => props.length}s ease infinite;
  background: linear-gradient(
    ${props => props.angle}deg,
    ${props => props.colorA},
    ${props => props.colorB},
    ${props => props.colorC},
    ${props => props.colorD}
  );
  background-size: 400% 400%;
  display: block;
  height: 0.75rem;
  margin-bottom: 0.5rem;
  width: ${props => (props.mobileOnly ? "100%" : props.right)};
  z-index: 1;

  &:nth-last-child(1) {
    margin-bottom: 0;
  }

  @media (min-width: 640px) {
    display: ${props => (props.mobileOnly ? "none" : null)};
  }
`;

const Title = styled.span`
  position: relative;
  z-index: 1;
`;

export default class Concert extends Component {
  state = {
    angle: Math.random() * 360,
    colorA: gradientColors[Math.floor(Math.random() * gradientColors.length)],
    colorB: gradientColors[Math.floor(Math.random() * gradientColors.length)],
    colorC: gradientColors[Math.floor(Math.random() * gradientColors.length)],
    colorD: gradientColors[Math.floor(Math.random() * gradientColors.length)],
    length: 1.5 + Math.random() * 1,
    right: `${Math.random() * 50 + 50}%`
  };

  render() {
    return (
      <Link href={this.props.link} rel="noopener noreferrer" target="_blank">
        {this.props.date && this.props.title ? (
          <Title
            dangerouslySetInnerHTML={{
              __html: `${this.props.date}${
                this.props.time ? `, ${this.props.time}` : ""
              }: ${this.props.title}`
            }}
          />
        ) : (
          <React.Fragment>
            <Skeleton
              angle={this.state.angle}
              colorA={this.state.colorA}
              colorB={this.state.colorB}
              colorC={this.state.colorC}
              colorD={this.state.colorD}
              length={this.state.length}
              gradient={gradient()}
              mobileOnly={true}
              right={0}
            />
            <Skeleton
              angle={this.state.angle}
              colorA={this.state.colorA}
              colorB={this.state.colorB}
              colorC={this.state.colorC}
              colorD={this.state.colorD}
              length={this.state.length}
              gradient={gradient()}
              mobileOnly={false}
              right={this.state.right}
            />
          </React.Fragment>
        )}
      </Link>
    );
  }
}
