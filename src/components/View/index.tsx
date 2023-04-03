import styled from "styled-components";

interface ViewProps {
  horizontal?: boolean;
  gap?: number;
  flex?: number;
  wrap?: boolean;
  centerContent?: boolean;
  scrollable?: boolean;
}

const View = styled.div<ViewProps>`
  ${props => props.flex ? `flex: ${props.flex}` : ''};
  ${props => props.wrap ? 'flex-wrap: wrap' : ''};
  display: flex;
  flex-direction: ${props => props.horizontal ? 'row' : 'column'};
  ${props => props.gap ? `gap: ${props.gap}px;`  : ''};
  ${props => props.centerContent ?
    `align-items: center;
    justify-content: center;`
    :
    ''
  }
  ${props => props.scrollable ? 'overflow: auto;' : ''}
`;

export default View;
