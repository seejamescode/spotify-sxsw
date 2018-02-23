import React, { Component } from "react";
import Message from "./Message";
import Section from "./Section";
import Track from "./Track";

export default class Tracks extends Component {
  render() {
    return (
      <Section
        list="true"
        hidden={!this.props.show}
        aria-hidden={this.props.show}
      >
        {this.props.searching ? (
          <Message list="true">
            This takes a while based on the size of your library. Large
            libraries take around half a minute.
          </Message>
        ) : null}
        {this.props.searched && this.props.tracks.length === 0 ? (
          <Message list="true">
            Sorry! It looks like no artists in your song library are coming to
            SXSW.
          </Message>
        ) : null}
        <React.Fragment>
          {this.props.searching || this.props.tracks.length > 0 ? (
            <Track {...this.props.tracks[0]} key={0} />
          ) : null}
          {this.props.searching || this.props.tracks.length > 1 ? (
            <Track {...this.props.tracks[1]} key={1} />
          ) : null}
          {this.props.searching || this.props.tracks.length > 2 ? (
            <Track {...this.props.tracks[2]} key={2} />
          ) : null}
          {this.props.searching || this.props.tracks.length > 3 ? (
            <Track {...this.props.tracks[3]} key={3} />
          ) : null}
          {this.props.searching || this.props.tracks.length > 4 ? (
            <Track {...this.props.tracks[4]} key={4} />
          ) : null}{" "}
          {this.props.tracks
            .slice(5, this.props.tracks.length - 1)
            .map((concert, index) => <Track {...concert} key={index} />)}
        </React.Fragment>
      </Section>
    );
  }
}
