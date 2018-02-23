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

const Card = styled.div`
  animation: ${fadeIn} 1s ease-out;
  grid-row: span 5;
  position: relative;
`;

const Image = styled.img`
  height: 100%;
  left: 0;
  object-fit: cover;
  object-position: center;
  position: absolute;
  top: 0;
  width: 100%;
  z-index: 0;
`;

const Link = styled.a`
  align-items: flex-end;
  animation: ${props => props.gradient} ${props => props.length}s ease infinite;
  background: linear-gradient(
    ${props => props.angle}deg,
    ${props => props.colorA},
    ${props => props.colorB},
    ${props => props.colorC},
    ${props => props.colorD}
  );
  background-size: 400% 400%;
  display: flex;
  height: 100%;
  padding: 2rem;
  position: relative;
  text-decoration: none;

  &:before {
    background: linear-gradient(transparent, black 75%);
    background-size: 1px 200%;
    content: "";
    height: 100%;
    left: 0;
    position: absolute;
    top: 0;
    transition: background 0.75s ease;
    width: 100%;
    z-index: 1;
  }

  &:hover {
    text-decoration: underline;

    &:before {
      background-position: ${props =>
        props.href !== undefined ? "200%" : null};
    }
  }
`;

const Picture = styled.picture`
  opacity: ${props => (props.showImages ? 1 : 0)};
  transition: opacity 0.75s ease-out;
`;

const Title = styled.span`
  max-width: 10rem;
  position: relative;
  z-index: 1;
`;

const Toggle = styled.button`
  background: var(--color-white);
  border: none;
  bottom: 2rem;
  cursor: pointer;
  height: 2rem;
  padding: 0;
  position: absolute;
  right: 2rem;
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

export default class Artist extends Component {
  state = {
    angle: Math.random() * 360,
    colorA: gradientColors[Math.floor(Math.random() * gradientColors.length)],
    colorB: gradientColors[Math.floor(Math.random() * gradientColors.length)],
    colorC: gradientColors[Math.floor(Math.random() * gradientColors.length)],
    colorD: gradientColors[Math.floor(Math.random() * gradientColors.length)],
    length: 4 + Math.random() * 4,
    playing: false,
    showImages: false
  };

  componentDidMount() {
    if (this.props.images !== undefined) {
      this.setState({ showImages: true });
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.images === undefined && this.props.images !== undefined) {
      setTimeout(() => {
        this.setState({ showImages: true });
      }, 1000);
    }
  }

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
      <Card>
        {this.props.mp3 && this.props.mp3 !== null ? (
          <React.Fragment>
            {this.state.playing ? (
              <audio
                autoPlay={true}
                src={this.props.mp3}
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
        ) : null}
        <Link
          angle={this.state.angle}
          colorA={this.state.colorA}
          colorB={this.state.colorB}
          colorC={this.state.colorC}
          colorD={this.state.colorD}
          length={this.state.length}
          gradient={gradient()}
          href={this.props.spotify_url}
          rel="noopener noreferrer"
          target="_blank"
        >
          {this.props.images ? (
            <Picture showImages={this.state.showImages}>
              {this.props.images.map(
                (image, index) =>
                  index === this.props.images - 1 ? null : (
                    <source
                      key={image.url}
                      srcSet={image.url}
                      media={
                        index < this.props.images.length - 1
                          ? `(max-width: ${image.width}px)`
                          : `(min-width: ${
                              this.props.images[index - 1].width
                            }px)`
                      }
                    />
                  )
              )}
              <Image
                showImages={this.state.showImages}
                src={
                  this.props.images[this.props.images.length - 1] &&
                  this.props.images[this.props.images.length - 1].url
                    ? this.props.images[this.props.images.length - 1].url
                    : null
                }
                alt={this.props.name}
              />
            </Picture>
          ) : null}
          <Title>{this.props.name}</Title>
        </Link>
      </Card>
    );
  }
}
