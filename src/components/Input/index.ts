import styled from "styled-components";

export interface InputProps {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'quaternary' | 'quinary';
}

const Input = styled.input<InputProps>`
  height: 40px;
  outline: none;
  padding: 8px;
  font-size: 1.0em;
  border-style: none;
  border-radius: 8px;
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

  ::placeholder { /* Chrome, Firefox, Opera, Safari 10.1+ */
    color: ${props => props.theme.colors.quinaryForeground};
  }

  :-ms-input-placeholder { /* Internet Explorer 10-11 */
    color: ${props => props.theme.colors.quinaryForeground};
  }

  ::-ms-input-placeholder { /* Microsoft Edge */
    color: ${props => props.theme.colors.quinaryForeground};
  }
`;

export default Input;
