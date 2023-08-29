import {CategoryService, Comic, ComicService} from '@services';
import {Carousel} from 'react-responsive-carousel';
import {useQuery} from 'react-query';
import {Button, Card, ComicItem, Grid, Page, Text, View} from '@components';
import {ScrollMenu, VisibilityContext } from 'react-horizontal-scrolling-menu';
import {useNavigate} from 'react-router';
import LoadingPage from '../LoadingPage';
import ErrorPage from '../ErrorPage';
import React from 'react';
import {Icon} from '@iconify/react';
import './index.scss';
import {Link} from 'react-router-dom';
import {useTheme} from 'styled-components';
import LazyLoad from 'react-lazyload';

const chunk = (arr: Array<any>, size: number) =>
  Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
    arr.slice(i * size, i * size + size)
  );

function HomePage() {
  const navigate = useNavigate();
  const theme = useTheme();

  const categoryQuery = useQuery({
    queryKey: ['app', 'categories'],
    queryFn: () => CategoryService.getAllAsync()
  });

  const readQuery = useQuery({
    queryKey: ['app', 'comics', 'read'],
    queryFn: () => ComicService.getReadAsync({per_page: 20})
  });

  const newestQuery = useQuery({
    queryKey: ['app', 'comics', 'newest'],
    queryFn: () => ComicService.getAllAsync({sort_by: 'last_updated_chapter_at-desc', per_page: 8})
  });

  const mostFavoriteQuery = useQuery({
    queryKey: ['app', 'comics', 'most_favorite'],
    queryFn: () => ComicService.getAllAsync({sort_by: 'favorites-desc', per_page: 6})
  });

  const mostViewedQuery = useQuery({
    queryKey: ['app', 'comics', 'most_viewed'],
    queryFn: () => ComicService.getAllAsync({sort_by: 'views-desc', per_page: 8})
  });

  const upComingQuery = useQuery({
    queryKey: ['app', 'comics', 'up_coming'],
    queryFn: () => ComicService.getUpComingAsync({per_page: 10})
  });

  if (newestQuery.isLoading || readQuery.isLoading || categoryQuery.isLoading || upComingQuery.isLoading || mostFavoriteQuery.isLoading || mostViewedQuery.isLoading) {
    return <LoadingPage />;
  }

  if (newestQuery.isError || readQuery.isError || categoryQuery.isError || upComingQuery.isError || mostFavoriteQuery.isError || mostViewedQuery.isError) {
    return <ErrorPage onButtonClick={() => {
      categoryQuery.refetch();
      readQuery.refetch();
      newestQuery.refetch();
      mostFavoriteQuery.refetch();
      mostViewedQuery.refetch();
      upComingQuery.refetch();
    }}/>;
  }

  function LeftArrow() {
    const { isFirstItemVisible, scrollPrev } =
    React.useContext(VisibilityContext);

    return (
      <Button shadowEffect style={{margin: 8, height: 'auto', width: 40}} disabled={isFirstItemVisible} onClick={() => scrollPrev()}>
        <Icon icon={'mingcute:left-line'} style={{height: 24, width: 24}} />
      </Button>
    );
  }

  function RightArrow() {
    const { isLastItemVisible, scrollNext } = React.useContext(VisibilityContext);

    return (
      <Button shadowEffect style={{margin: 8, height: 'auto', width: 40}} disabled={isLastItemVisible} onClick={() => scrollNext()}>
        <Icon icon={'mingcute:right-line'} style={{height: 24, width: 24}} />
      </Button>
    );
  }

  return (
    <Page.Container>
      <Page.Content gap={32}>
        <Card style={{backgroundColor: 'transparent', padding: 0}} animation="slideRightIn">
          <Carousel
            showThumbs={false}
            showStatus={false}
            showArrows={false}
            autoPlay={true}
            infiniteLoop={true}
          >
            {newestQuery.data?.data.map((item: Comic) => <ComicItem.Slide key={item.id} shadowEffect _data={item} style={{margin: 8}} />)}
          </Carousel>
        </Card>

        <ScrollMenu
          LeftArrow={LeftArrow}
          RightArrow={RightArrow}
          scrollContainerClassName={'scroll-menu-container'}
        >
          {chunk(categoryQuery.data!, 2).map((item: any) => (
            <View key={item.id}>
              <Card
                key={item[0].id.toString()}
                shadowEffect
                style={{marginLeft: 4, marginRight: 4, marginTop: 8, marginBottom: 4, height: 40, width: 180, justifyContent: 'center', alignItems: 'center'}}
                onClick={() => navigate(`/comics/categories?category_ids=${item[0].id}`)}
                animation="slideLeftIn"
              >
                <Text>{item[0].name}</Text>
              </Card>
              {item[1] &&
              <Card
                key={item[1].id.toString()}
                shadowEffect
                style={{marginLeft: 4, marginRight: 4, marginTop: 4, marginBottom: 8, height: 40, width: 180, justifyContent: 'center', alignItems: 'center'}}
                onClick={() => navigate(`/comics/categories?category_ids=${item[1].id}`)}
                animation="slideLeftIn"
              >
                <Text>{item[1].name}</Text>
              </Card>
              }
            </View>
          ))}
        </ScrollMenu>

        {readQuery.data?.data.length !== 0 &&
        <View gap={8}>
          <View horizontal style={{marginLeft: 8, marginRight: 8, alignItems: 'center'}}>
            <Text variant='large-title' style={{flex: 1}}>Đã đọc gần đây</Text>
          </View>
          <Card style={{paddingLeft: 0, paddingRight: 0}} animation="slideRightIn">
            <ScrollMenu
              LeftArrow={LeftArrow}
              RightArrow={RightArrow}
              scrollContainerClassName={'scroll-menu-container'}
              itemClassName={'scroll-menu-item'}
            >
              {readQuery.data!.data.map((item: Comic) => <ComicItem.Horizontal key={item.id} showNewChaptersTag shadowEffect _data={item} style={{width: 440}}/>)}
            </ScrollMenu>
          </Card>
        </View>
        }

        {upComingQuery.data!.data.length !== 0 &&
        <View gap={8}>
          <View horizontal style={{marginLeft: 8, marginRight: 8, alignItems: 'center'}}>
            <Text variant='large-title' style={{flex: 1}}>Sắp ra mắt</Text>
          </View>
          <Card style={{paddingLeft: 0, paddingRight: 0}} animation="slideLeftIn">
            <ScrollMenu
              LeftArrow={LeftArrow}
              RightArrow={RightArrow}
              scrollContainerClassName={'scroll-menu-container'}
              itemClassName={'scroll-menu-item'}
            >
              {upComingQuery.data!.data.map((item : Comic) => <ComicItem.Horizontal key={item.id} shadowEffect _data={item} style={{width: 440}}/>)}
            </ScrollMenu>
          </Card>
        </View>
        }

        <LazyLoad>
          <View gap={8}>
            <View horizontal style={{marginLeft: 8, marginRight: 8, alignItems: 'center'}}>
              <Text variant='large-title' style={{flex: 1}}>Mới cập nhật</Text>
              <Link style={{textDecoration: 'none', color: theme.colors.themeColor, fontWeight: 'bold'}} to={'/comics?sort_by=last_updated_chapter_at-desc'}>Xem thêm</Link>
            </View>
            <Grid templateColumns="auto auto" templateRows="auto auto auto auto" style={{paddingLeft: 0, paddingRight: 0, gap: 8}} animation="slideLeftIn">
              {newestQuery.data!.data.map((item : Comic) => (
                <ComicItem.Horizontal key={item.id} showFavorites showViews showLastUpdatedTag shadowEffect _data={item}/>
              ))}
            </Grid>
          </View>
        </LazyLoad>

        <LazyLoad>
          <View gap={8}>
            <View horizontal style={{marginLeft: 8, marginRight: 8, alignItems: 'center'}}>
              <Text variant='large-title' style={{flex: 1}}>Được yêu thích nhất</Text>
              <Link style={{textDecoration: 'none', color: theme.colors.themeColor, fontWeight: 'bold'}} to={'/comics?sort_by=likes-desc'}>Xem thêm</Link>
            </View>
            <View style={{paddingLeft: 0, paddingRight: 0, gap: 8}}>
              {mostFavoriteQuery.data!.data.map((item : Comic) => (
                <ComicItem.Horizontal key={item.id} showFavoritesTag shadowEffect _data={item} style={{width: '100%'}}/>
              ))}
            </View>
          </View>
        </LazyLoad>

        <LazyLoad>
          <View gap={8}>
            <View horizontal style={{marginLeft: 8, marginRight: 8, alignItems: 'center'}}>
              <Text variant='large-title' style={{flex: 1}}>Được xem nhiều nhất</Text>
              <Link style={{textDecoration: 'none', color: theme.colors.themeColor, fontWeight: 'bold'}} to={'/comics?sort_by=views-desc'}>Xem thêm</Link>
            </View>
            <Grid templateColumns="auto auto" templateRows="auto auto auto auto" style={{paddingLeft: 0, paddingRight: 0, gap: 8}} animation="slideLeftIn">
              {mostViewedQuery.data!.data.map((item : Comic) => <ComicItem.Horizontal key={item.id} showViewsTag shadowEffect _data={item}/>)}
            </Grid>
          </View>
        </LazyLoad>
      </Page.Content>
    </Page.Container>
  );
}

export default HomePage;
