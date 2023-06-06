import {keyframes} from 'styled-components';

const slideRightIn = keyframes`
  from {
    transform: translateX(-24px);
  }
  to {
    transform: translateX(0);
  }
`;

const slideLeftIn = keyframes`
  from {
    transform: translateX(24px);
  }
  to {
    transform: translateX(0);
  }
`;

const slideTopIn = keyframes`
  from {
    transform: translateY(24px);
  }
  to {
    transform: translateY(0);
  }
`;

const slideBottomIn = keyframes`
  from {
    transform: translateY(-48px);
  }
  to {
    transform: translateY(0);
  }
`;

const SilverSlideRightIn = keyframes`
  from {
    transform: translateX(-48px);
  }
  to {
    transform: translateX(0);
  }
`;

const SilverSlideLeftIn = keyframes`
  from {
    transform: translateX(48px);
  }
  to {
    transform: translateX(0);
  }
`;

const SilverSlideTopIn = keyframes`
  from {
    transform: translateY(48px);
  }
  to {
    transform: translateY(0);
  }
`;

const SilverSlideBottomIn = keyframes`
  from {
    transform: translateY(-48px);
  }
  to {
    transform: translateY(0);
  }
`;

export default {
  slideRightIn,
  slideLeftIn,
  slideTopIn,
  slideBottomIn,
  SilverSlideRightIn,
  SilverSlideLeftIn,
  SilverSlideTopIn,
  SilverSlideBottomIn
};
