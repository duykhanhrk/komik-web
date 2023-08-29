import {Comic} from '@services';
import {Link} from 'react-router-dom';
import styled from 'styled-components';
import Text from '../Text';
import Image from './Image';
import {default as Animations} from '../Animations';

interface VerticalProps extends React.HTMLProps<HTMLDivElement> {
  _data: Comic;
  shadowEffect?: boolean;
  animation?: 'slideBottomIn' | 'slideLeftIn' | 'slideRightIn' | 'slideTopIn';
  animationDuration?: number;
}

const Container = styled.div<{
  shadowEffect?: boolean;
  animation?: 'slideBottomIn' | 'slideLeftIn' | 'slideRightIn' | 'slideTopIn';
  animationDuration?: number;
}>`
  display: flex;
  flex-direction: column;
  background-color: ${props => props.theme.colors.secondaryBackground};
  gap: 8px;
  padding: 8px;
  border-radius: 8px;
  overflow: hidden;
  width: 241px;
  ${props => props.shadowEffect ?  'transition: box-shadow 0.5s;' : ''};
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
  &:hover {
    ${props => props.shadowEffect ?  'box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;' : ''}
  }
  @media (max-width: 720px) {
    width: 166px;
  }
`;

function Vertical(props: VerticalProps) {
  const { _data, style } = props;

  return (
    <Link key={_data.id!.toString()} to={`/comics/detail/${_data.id!}`} style={{textDecoration: 'none'}}>
      <Container
        shadowEffect={props.shadowEffect}
        animation={props.animation}
        animationDuration={props.animationDuration}
        key={_data.id?.toString()}
        style={style}
      >
        <Image style={{borderRadius: 8}} variant="medium" src={_data.image_url}/>
        <Text variant="title" numberOfLines={1} style={{textAlign: 'center'}}>{_data.name}</Text>
      </Container>
    </Link>
  );
}

export default Vertical;
