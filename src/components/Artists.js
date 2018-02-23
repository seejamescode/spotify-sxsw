import React, { Component } from "react";
import Artist from "./Artist";
import Message from "./Message";
import Section from "./Section";

export default class Artists extends Component {
  render() {
    return (
      <Section hidden={!this.props.show} aria-hidden={this.props.show}>
        {this.props.searching ? (
          <Message>
            This takes a while based on the size of your library. Large
            libraries take around half a minute.
          </Message>
        ) : null}
        {this.props.searched && this.props.artists.length === 0 ? (
          <Message>
            Sorry! It looks like no artists in your song library are coming to
            SXSW.
          </Message>
        ) : null}
        <React.Fragment>
          {this.props.searching || this.props.artists.length > 0 ? (
            <Artist
              images={this.props.artists[0].images}
              key={0}
              mp3={this.props.artists[0].mp3}
              name={this.props.artists[0].name}
              spotify_url={this.props.artists[0].spotify_url}
            />
          ) : null}
          {this.props.searching || this.props.artists.length > 1 ? (
            <Artist {...this.props.artists[1]} key={1} />
          ) : null}
          {this.props.searching || this.props.artists.length > 2 ? (
            <Artist {...this.props.artists[2]} key={2} />
          ) : null}
          {this.props.searching || this.props.artists.length > 3 ? (
            <Artist {...this.props.artists[3]} key={3} />
          ) : null}
          {this.props.searching || this.props.artists.length > 4 ? (
            <Artist {...this.props.artists[4]} key={4} />
          ) : null}{" "}
          {this.props.artists
            .slice(5, this.props.artists.length)
            .map((artist, index) => <Artist {...artist} key={index} />)}
        </React.Fragment>
      </Section>
    );
  }
}
