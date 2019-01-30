import React, { Component } from "react";
import Concert from "./Concert";
import Message from "./Message";
import Section from "./Section";

export default class Concerts extends Component {
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
        {this.props.searched && this.props.concerts.length === 0 ? (
          <Message list="true">
            Sorry! It looks like concerts for artists in your song library are
            scheduled yet.
          </Message>
        ) : null}
        <React.Fragment>
          {this.props.searching || this.props.concerts.length > 0 ? (
            <Concert {...this.props.concerts[0]} key={0} />
          ) : null}
          {this.props.searching || this.props.concerts.length > 1 ? (
            <Concert {...this.props.concerts[1]} key={1} />
          ) : null}
          {this.props.searching || this.props.concerts.length > 2 ? (
            <Concert {...this.props.concerts[2]} key={2} />
          ) : null}
          {this.props.searching || this.props.concerts.length > 3 ? (
            <Concert {...this.props.concerts[3]} key={3} />
          ) : null}
          {this.props.searching || this.props.concerts.length > 4 ? (
            <Concert {...this.props.concerts[4]} key={4} />
          ) : null}{" "}
          {this.props.concerts
            .slice(5, this.props.concerts.length - 1)
            .map((concert, index) => (
              <Concert {...concert} key={index} />
            ))}
        </React.Fragment>
      </Section>
    );
  }
}
