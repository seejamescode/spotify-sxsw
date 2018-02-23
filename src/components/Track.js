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
  align-items: center;
  animation: ${fadeIn} 1s ease-out;
  background: var(--color-blackMenu);
  display: ${props => (props.href ? "flex" : null)};
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
  flex: 1;
  position: relative;
  z-index: 1;
`;

const Toggle = styled.button`
  background: ${props => (props.hidden ? "transparent" : "var(--color-white)")};
  border: none;
  cursor: pointer;
  display: block;
  height: 2rem;
  margin-right: 2rem;
  padding: 0;
  width: 2rem;
  z-index: 2;

  div {
    border: 0;
    background: transparent;
    border-color: transparent transparent transparent var(--color-black);
    border-style: solid;
    border-width: ${props =>
      props.playing ? "0rem 0 0rem 1.25rem" : "0.625rem 0 0.625rem 1.25rem"};
    box-sizing: border-box;
    cursor: pointer;
    width: 0;
    height: 1.25rem;
    margin-left: 0.35rem;
    transition: 100ms all ease;
    width: 0;
  }

  &:hover div {
    border-color: transparent transparent transparent var(--color-green);
  }
`;

export default class Track extends Component {
  state = {
    angle: Math.random() * 360,
    colorA: gradientColors[Math.floor(Math.random() * gradientColors.length)],
    colorB: gradientColors[Math.floor(Math.random() * gradientColors.length)],
    colorC: gradientColors[Math.floor(Math.random() * gradientColors.length)],
    colorD: gradientColors[Math.floor(Math.random() * gradientColors.length)],
    length: 1.5 + Math.random() * 1,
    right: `${Math.random() * 50 + 50}%`
  };

  playSong = e => {
    e.preventDefault();
    let playing = true;
    if (this.state.playing) {
      playing = false;
    } else {
      const sounds = document.getElementsByTagName("audio");
      for (let i = 0; i < sounds.length; i++) {
        sounds[i].pause();
      }
    }
    this.setState({
      playing
    });
  };

  render() {
    return (
      <Link href={this.props.link} rel="noopener noreferrer" target="_blank">
        {this.props.preview_url && this.props.preview_url !== null ? (
          <React.Fragment>
            {this.state.playing ? (
              <audio
                autoPlay={true}
                src={this.props.preview_url}
                type="audio/mp3"
                onPause={() => {
                  this.setState({
                    playing: false
                  });
                }}
              />
            ) : null}
            <Toggle onClick={this.playSong} playing={this.state.playing}>
              <div />
            </Toggle>
          </React.Fragment>
        ) : (
          <Toggle hidden tabIndex={"-1"} />
        )}
        {this.props.name ? (
          <Title>
            {this.props.name} by{" "}
            {this.props.artists.map(artist => artist.name).join(", ")}
          </Title>
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
