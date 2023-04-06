import styled from "styled-components";

export interface InputProps {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'quaternary' | 'quinary';
  shadowEffect?: boolean;
  flex?: number;
}

const Input = styled.input<InputProps>`
  ${props => props.flex ? `flex: ${props.flex};` : ''}
  height: 40px;
  outline: none;
  padding: 8px;
  font-size: 1.0em;
  border-style: none;
  border-radius: 8px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: ${
    props => props.variant && props.variant === 'primary'?
      props.theme.colors.themeForeground
      : props.theme.colors.foreground
  };
  background-color: ${
    props => !props.variant || props.variant === 'secondary' ? props.theme.colors.secondaryBackground
      : props.variant === 'primary' ? props.theme.colors.themeBackground
      : props.variant === 'tertiary' ? props.theme.colors.tertiaryBackground
      : props.variant === 'quaternary' ? props.theme.colors.quaternaryBackground
      : props.variant === 'quinary' ? props.theme.colors.quinaryBackground
      : props.theme.colors.themeBackground
  };
  ${props => props.shadowEffect ?  'transition: box-shadow 0.5s;' : ''};

  ::placeholder {
    color: ${props => props.theme.colors.quinaryForeground};
  }

  :-ms-input-placeholder {
    color: ${props => props.theme.colors.quinaryForeground};
  }

  ::-ms-input-placeholder {
    color: ${props => props.theme.colors.quinaryForeground};
  }

  &:hover, &:focus {
    ${props => props.shadowEffect ?  'box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;' : ''}
  }
`;

export default Input;
