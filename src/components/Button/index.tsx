import styled from "styled-components";

export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'quaternary' | 'quinary'
}

const Button = styled.button<ButtonProps>`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  height: ${props => props.theme.dimensions.size};
  outline: none;
  padding: ${props => props.theme.dimensions.margin};
  font-size: ${props => props.theme.dimensions.fontSize};
  border-style: none;
  border-radius: ${props => props.theme.dimensions.borderRadius};
  opacity: 1;
  color: ${
    props => !props.variant || props.variant === 'primary'?
      props.theme.colors.themeForeground
      : props.theme.colors.foreground
  };
  background-color: ${
    props => !props.variant || props.variant === 'primary' ? props.theme.colors.themeBackground
      : props.variant === 'secondary' ? props.theme.colors.secondaryBackground
      : props.variant === 'tertiary' ? props.theme.colors.tertiaryBackground
      : props.variant === 'quaternary' ? props.theme.colors.quaternaryBackground
      : props.variant === 'quinary' ? props.theme.colors.quinaryBackground
      : props.theme.colors.themeBackground
  };

  :hover {
    opacity: 0.9;
  }

  :active {
    opacity: 1;
  }
`;

export default Button;
