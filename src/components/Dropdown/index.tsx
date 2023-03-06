import styled from "styled-components";

const Container = styled.div`
  position: relative;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  border-radius: 8px;
  background-color: ${props => props.theme.colors.secondaryBackground};
  overflow: hidden;
  padding: 8px;
`;

const Item = styled.div`
  display: flex;
  flex-direction: row;
  height: 40px;
  align-items: center;
  justify-content: left;
  background-color: #0000FF;
`;

export default { Container, Content, Item };
