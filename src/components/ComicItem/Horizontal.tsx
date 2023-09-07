import {Comic} from '@services';
import {useNavigate} from 'react-router';
import {Link} from 'react-router-dom';
import styled, {useTheme} from 'styled-components';
import Text from '../Text';
import View from '../View';
import Image from './Image';
import {default as Animations} from '../Animations';
import Tag from '../Tag';
import {Icon} from '@iconify/react';
import moment from 'moment';

interface HorizontalProps extends React.HTMLProps<HTMLDivElement> {
  _data: Comic;
  variant?: 'primary' | 'secondary' | 'tertiary' | 'quaternary' | 'quinary';
  _size?: 'small' | 'normal' | 'medium' | 'large';
  shadowEffect?: boolean;
  animation?: 'slideBottomIn' | 'slideLeftIn' | 'slideRightIn' | 'slideTopIn';
  animationDuration?: number;
  showLastUpdatedTag?: boolean;
  showFavoritesTag?: boolean;
  showViewsTag?: boolean;
  showFavorites?: boolean;
  showViews?: boolean;
  showNewChaptersTag?: boolean;
}

const Container = styled.div<{
  variant?: 'primary' | 'secondary' | 'tertiary' | 'quaternary' | 'quinary',
  shadowEffect?: boolean;
  animation?: 'slideBottomIn' | 'slideLeftIn' | 'slideRightIn' | 'slideTopIn';
  animationDuration?: number;
}>`
  display: flex;
  flex-direction: row;
  padding: 8px;
  gap: 8px;
  border-radius: 8px;
  overflow: hidden;
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

  &:hover {
    ${props => props.shadowEffect ?  'box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;' : ''}
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
`;

const TextContainer = styled.div<{_size?: 'small' | 'normal' | 'medium' | 'large'}>`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: ${props => props._size === 'small' ? '4px' : '4px'};
`;

function Horizontal(props: HorizontalProps) {
  const {
    _data,
    style,
    showLastUpdatedTag,
    showFavoritesTag,
    showViewsTag,
    showFavorites,
    showViews,
    showNewChaptersTag
  } = props;
  const navigate = useNavigate();
  const theme = useTheme();
  moment.locale('vi');

  return (
    <Link to={`/comics/detail/${_data.slug}`} style={{textDecoration: 'none'}}>
      <Container
        key={_data.slug}
        style={style}
        onClick={() => navigate(`/comics/${_data.id}`)}
        variant={props.variant}
        shadowEffect={props.shadowEffect}
        animation={props.animation}
        animationDuration={props.animationDuration}
      >
        <View centerContent>
          <Image variant={props._size} style={{borderRadius: 8}} src={_data.image_url}/>
        </View>
        <TextContainer _size={props._size}>
          <Text variant="title" numberOfLines={2}>{_data.name}</Text>
          {<Text variant="small" numberOfLines={1}>{_data.other_names}</Text>}
          {<Text variant="small" numberOfLines={1}>{_data.authors?.map(author => author.lastname + ' ' + author.firstname).join(', ')}</Text>}
          {props._size !== 'small' && <Text variant="small" numberOfLines={4}>{_data.description}</Text>}
          <View horizontal gap={4} flex={1} style={{alignItems: 'flex-end'}}>
            {showNewChaptersTag && !!_data.new_chapters && _data.new_chapters > 0 &&
            <Tag variant={{ct: 'tertiary'}} style={{gap: 8, color: theme.colors.blue}}>
              <Icon icon={'mingcute:paper-line'} style={{height: 16, width: 16, color: theme.colors.blue}} />
              Có {_data.new_chapters} chương mới
            </Tag>
            }
            {showFavorites &&
            <Tag variant={{ct: 'secondary'}} style={{gap: 8}}>
              <Icon icon={'mingcute:heart-line'} style={{height: 16, width: 16, color: theme.colors.red}} />
              {_data.favorites}
            </Tag>
            }
            {showViews &&
            <Tag variant={{ct: 'secondary'}} style={{gap: 8}}>
              <Icon icon={'mingcute:eye-2-line'} style={{height: 16, width: 16, color: theme.colors.green}} />
              {_data.views}
            </Tag>
            }
            <View flex={1} />
            {showFavoritesTag &&
            <Tag variant={{ct: 'tertiary'}} style={{gap: 8, color: theme.colors.red}}>
              <Icon icon={'mingcute:heart-line'} style={{height: 16, width: 16, color: theme.colors.red}} />
              {_data.favorites}
            </Tag>
            }
            {showViewsTag &&
            <Tag variant={{ct: 'tertiary'}} style={{gap: 8, color: theme.colors.green}}>
              <Icon icon={'mingcute:eye-2-line'} style={{height: 16, width: 16, color: theme.colors.green}} />
              {_data.views}
            </Tag>
            }
            {showLastUpdatedTag &&
            <Tag variant={{ct: 'tertiary'}} style={{gap: 8, color: theme.colors.green}}>
              <Icon icon={'mingcute:time-line'} style={{height: 16, width: 16, color: theme.colors.green}} />
              {moment(_data.last_updated_chapter_at).fromNow()}
            </Tag>
            }
          </View>
        </TextContainer>
      </Container>
    </Link>
  );
}

export default Horizontal;
