import styled from "styled-components";
import {default as Animations} from '../Animations';

export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'quaternary' | 'quinary' | 'transparent';
  shadowEffect?: boolean;
  selected?: boolean;
  ebonsai?: boolean;
  square?: boolean;
  animation?: 'slideBottomIn' | 'slideLeftIn' | 'slideRightIn' | 'slideTopIn';
  animationDuration?: number;
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
      : props.variant === 'transparent' ? 'transparent'
      : props.theme.colors.themeBackground
  };

  ${props => props.ebonsai ? `
    height: 36px;
    width: ${props.square ? '36px' : '120px'};
    padding: 6px;
    background-color: transparent;
  ` : ''}

  animation: ${
    props => props.animation === 'slideBottomIn'
      ? Animations.slideBottomIn
      : props.animation === 'slideLeftIn'
      ? Animations.slideLeftIn
      : props.animation === 'slideRightIn'
      ? Animations.slideRightIn
      : props.animation === 'slideTopIn'
      ? Animations.slideTopIn
      : ''
  } ${
    props => props.animationDuration ? `${props.animationDuration}s` : '0.5s'
  } ease;

  ${props => props.selected ? 'box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;' : ''}

  ${props => props.shadowEffect ?  'transition: box-shadow 0.5s;' : ''};

  :hover {
    ${props => props.shadowEffect ?  'box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;' : 'opacity: 0.9;'}
  }

  :active {
    ${props => props.shadowEffect ?  'box-shadow: rgba(99, 99, 99, 0) 0px 0px 0px 0px;' : 'opacity: 1;'}
  }
`;

export default Button;
