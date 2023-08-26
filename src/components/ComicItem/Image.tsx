import styled from 'styled-components';
import { default as Animations } from '../Animations';

const Image = styled.img<{
  variant?: 'normal' | 'small' | 'medium' | 'large'
  animation?: 'slideBottomIn' | 'slideLeftIn' | 'slideRightIn' | 'slideTopIn';
  animationDuration?: number;
}>`
  object-fit: cover;
  height: ${
    props => !props.variant || props.variant === 'normal' ? '200px'
        : props.variant === 'small' ? '100px'
            : props.variant === 'medium' ? '300px'
                : props.variant === 'large' ? '400px'
                    : '200px'
};
  width: ${
    props => !props.variant || props.variant === 'normal' ? '150px'
        : props.variant === 'small' ? '75px'
            : props.variant === 'medium' ? '225px'
                : props.variant === 'large' ? '300px'
                    : '150px'
};
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
`;

export default Image;
