import styled from "styled-components";
import {default as Animations} from '../Animations';

interface ViewProps {
  horizontal?: boolean;
  gap?: number;
  flex?: number;
  wrap?: boolean;
  centerContent?: boolean;
  scrollable?: boolean;
  ebonsaiShelf?: boolean;
  shadowEffect?: boolean;
  variant?: 'primary' | 'secondary' | 'tertiary' | 'quaternary' | 'quinary';
  animation?: 'slideBottomIn' | 'slideLeftIn' | 'slideRightIn' | 'slideTopIn';
  animationDuration?: number;
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

  ${props => props.shadowEffect ?  'transition: box-shadow 0.5s;' : ''};
  &:hover, &:focus {
    ${props => props.shadowEffect ?  'box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;' : ''}
  }
`;

export default View;
