import styled from "styled-components";

export default styled.section`
  display: ${props => (props.hidden ? null : "grid")};
  grid-gap: ${props => (props.list ? 0 : "2rem")};
  grid-template-columns: ${props =>
    props.list ? "100%" : "repeat(auto-fit, 18rem)"};
  grid-auto-rows: 2rem;
  grid-auto-rows: ${props =>
    props.list ? "minmax(2rem, min-content)" : "2rem"};
  justify-content: center;
  height: ${props => (props.hidden ? 0 : null)};

  @media (min-width: 640px) {
    justify-content: flex-start;
  }

  visibility: ${props => (props.hidden ? "hidden" : null)};
`;
