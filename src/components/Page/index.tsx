import styled from "styled-components";

const Container = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;

  @media (min-width: 1295px) {
    align-items: center;
  }
`;

interface ContentProps {
  gap?: number;
}

const Content = styled.div<ContentProps>`
  flex: 1;
  display: flex;
  flex-direction: column;
  width: 1366px;
  max-width: auto;
  flex-grow: 1;
  gap: ${props => props.gap || 8}px;
  padding: 8px;

  @media (min-width: 1381px) {
    width: 1366px;
  }
`;

export default { Container, Content };
