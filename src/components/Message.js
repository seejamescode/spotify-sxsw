import styled from "styled-components";

export default styled.p`
  background: var(--color-blackMenu);
  grid-row: ${props => (props.list ? "span 1" : "span 3")};
  margin: 0;
  max-width: initial !important;
  padding: 2rem;

  @media (min-width: 640px) {
    grid-row: ${props => (props.list ? "span 1" : "span 5")};
  }
`;
