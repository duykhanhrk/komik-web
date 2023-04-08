import styled from "styled-components";

interface ViewProps {
  horizontal?: boolean;
  gap?: number;
  flex?: number;
  wrap?: boolean;
  centerContent?: boolean;
  scrollable?: boolean;
  variant?: 'primary' | 'secondary' | 'tertiary' | 'quaternary' | 'quinary';
}

const View = styled.div<ViewProps>`
  ${props => props.flex ? `flex: ${props.flex}` : ''};
  ${props => props.wrap ? 'flex-wrap: wrap' : ''};
  display: flex;
  color: ${
    props => props.variant && props.variant === 'primary'?
      props.theme.colors.themeForeground
      : props.theme.colors.foreground
  };
  background-color: ${
    props => !props.variant ? 'transparent'
      : props.variant === 'secondary' ? props.theme.colors.secondaryBackground
      : props.variant === 'primary' ? props.theme.colors.themeBackground
      : props.variant === 'tertiary' ? props.theme.colors.tertiaryBackground
      : props.variant === 'quaternary' ? props.theme.colors.quaternaryBackground
      : props.variant === 'quinary' ? props.theme.colors.quinaryBackground
      : 'transparent'
  };
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
