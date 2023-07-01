import styled from "styled-components";
import {default as Animations} from '../Animations';

interface GridProps {
  flow?: 'column' | 'row';
  gap?: number;
  centerContent?: boolean;
  scrollable?: boolean;
  ebonsaiShelf?: boolean;
  variant?: 'primary' | 'secondary' | 'tertiary' | 'quaternary' | 'quinary';
  animation?: 'slideBottomIn' | 'slideLeftIn' | 'slideRightIn' | 'slideTopIn';
  animationDuration?: number;
  templateColumns?: string;
  templateRows?: string;
}

const Grid = styled.div<GridProps>`
  display: grid;
  grid-auto-flow: ${props => props.flow ? props.flow : 'row'};
  grid-template-columns: ${props => props.templateColumns ? props.templateColumns : 'none'};
  grid-template-rows: ${props => props.templateRows ? props.templateRows : 'none'};
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
  ${props => props.gap ? `grid-gap: ${props.gap}px;`  : ''};
  ${props => props.centerContent ?
    `align-items: center;
    justify-content: center;`
    :
    ''
  }
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
  ${props => props.scrollable ? 'overflow: auto;' : ''}
  ${props => props.ebonsaiShelf ? 'padding: 8px; gap: 8px;' : ''}
`;

export default Grid;
