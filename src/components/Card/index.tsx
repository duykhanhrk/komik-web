import styled from 'styled-components';
import {default as Animations} from '../Animations';

interface CardProps {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'quaternary' | 'quinary';
  ebonsai?: boolean;
  ebonsaiSnippet?: boolean;
  horizontal?: boolean;
  flex?: number;
  shadowEffect?: boolean;
  centerContent?: boolean | 'horizontal' | 'vertical';
  animation?: 'slideBottomIn' | 'slideLeftIn' | 'slideRightIn' | 'slideTopIn' | 'SilverSlideTopIn' | 'SilverSlideBottomIn' | 'SilverSlideLeftIn' | 'SilverSlideRightIn';
  animationDuration?: number;
  animationInfinite?: boolean;
  animationAlternate?: boolean;
}

const Card = styled.div<CardProps>`
  ${props => props.flex ? `flex: ${props.flex}` : ''};
  display: flex;
  gap: 8px;
  padding: 8px;
  border-radius: 8px;

  flex-direction: ${props => props.horizontal ? 'row' : 'column'};

  ${props => props.centerContent ?
    props.centerContent === 'horizontal' ? (props.horizontal ? 'align-items: center;' : 'justify-content: center;')
      : props.centerContent === 'vertical' ? (props.horizontal ? 'justify-content: center;' : 'align-items: center;')
        : 'align-items: center; justify-content: center;'
    : ''
}

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

  ${props => props.ebonsai || props.ebonsaiSnippet ? `
    padding: 4px;
    flex-direction: ${props.horizontal === false ? 'column' : 'row'};
    align-items: center;
    ${props.horizontal === false ? 'width: 44px;' : ''}
    ${props.horizontal === false ? '' : 'height: 44px;'}
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
          : props.animation === 'SilverSlideTopIn'
            ? Animations.SilverSlideTopIn
            : props.animation === 'SilverSlideBottomIn'
              ? Animations.SilverSlideBottomIn
              : props.animation === 'SilverSlideLeftIn'
                ? Animations.SilverSlideLeftIn
                : props.animation === 'SilverSlideRightIn'
                  ? Animations.SilverSlideRightIn
                  : ''
} ${
  props => props.animationDuration ? `${props.animationDuration}s` : '0.5s'
} ease ${props => props.animationInfinite ? 'infinite' : ''} ${props => props.animationAlternate ? 'alternate' : ''};

  ${props => props.shadowEffect || props.ebonsaiSnippet ?  'transition: box-shadow 0.5s;' : ''}

  &:hover {
    ${props => props.shadowEffect || props.ebonsaiSnippet ?  'box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;' : ''}
  }
`;

export default Card;
