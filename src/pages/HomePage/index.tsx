import {Comic, ComicService} from '@services';
import { Carousel } from 'react-responsive-carousel';
import {useQuery} from 'react-query';
import styled, {useTheme} from 'styled-components';
import { ComicItem, Text } from '@components';
import { ScrollMenu, VisibilityContext } from 'react-horizontal-scrolling-menu';

const Container = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;

  @media (min-width: 1295px) {
    align-items: center;
  }
`;

const ScrollMenuContainer = styled.div`
  overflow: hidden;
  overflow-x: hidden;

  &::-webkit-scrollbar {
    backgruond-color: blue
  }

  -ms-overflow-style: none;
  scrollbar-width: none;
`;

function HomePage() {
  const theme = useTheme();

  const query = useQuery({
    queryKey: 'newest',
    queryFn: () => ComicService.getAllAsync({sort_by: 'updated_at-desc', per_page: 10})
  });

  if (query.isLoading) {
    return <div>Loading...</div>
  }

  return (
    <Container>
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        maxWidth: 1280,
        flexGrow: 1
      }}>
        <Carousel
          showThumbs={false}
          showStatus={false}
          showArrows={false}
          swipeable={true}
          showIndicators={true}
        >
          {query.data.comics.map((item: Comic) => <ComicItem.Slide _data={item} />)}
         </Carousel>

        <ScrollMenuContainer>
        <ScrollMenu>
          {query.data.comics.map((item : Comic) => (
            <div style={{display: 'flex', flexDirection: 'column', gap: 8}}>
              <img src={item.image} style={{height: 300}} />
              <Text numberOfLines={1} style={{textAlign: 'center'}}>{item.name}</Text>
            </div>
          ))}
        </ScrollMenu>
        </ScrollMenuContainer>
      </div>
    </Container>
  )
}

export default HomePage;
