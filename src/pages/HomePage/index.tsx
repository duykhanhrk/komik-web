import {Category, CategoryService, Comic, ComicService} from '@services';
import { Carousel } from 'react-responsive-carousel';
import { useQuery } from 'react-query';
import { Button, Card, ComicItem, Page, Text, View } from '@components';
import { ScrollMenu, VisibilityContext } from 'react-horizontal-scrolling-menu';
import {useNavigate} from 'react-router';
import LoadingPage from '../LoadingPage';
import ErrorPage from '../ErrorPage';
import React from 'react';
import {Icon} from '@iconify/react';
import './index.scss';
import {Link} from 'react-router-dom';
import {useTheme} from 'styled-components';

function HomePage() {
  const navigate = useNavigate();
  const theme = useTheme();

  const categoryQuery = useQuery({
    queryKey: ['app', 'categories'],
    queryFn: CategoryService.getAllAsync
  });

  const readQuery = useQuery({
    queryKey: ['app', 'comics', 'read'],
    queryFn: () => ComicService.getReadAsync({per_page: 10})
  });

  const newestQuery = useQuery({
    queryKey: ['app', 'comics', 'newest'],
    queryFn: () => ComicService.getAllAsync({sort_by: 'last_updated_chapter_at-desc', per_page: 10})
  });

  const mostFavoriteQuery = useQuery({
    queryKey: ['app', 'comics', 'most_favorite'],
    queryFn: () => ComicService.getAllAsync({sort_by: 'likes-desc', per_page: 10})
  });

  const mostViewedQuery = useQuery({
    queryKey: ['app', 'comics', 'most_viewed'],
    queryFn: () => ComicService.getAllAsync({sort_by: 'views-desc', per_page: 10})
  });

  const upComingQuery = useQuery({
    queryKey: ['app', 'comics', 'up_coming'],
    queryFn: () => ComicService.getUpComingAsync({per_page: 10})
  });

  if (newestQuery.isLoading || readQuery.isLoading || categoryQuery.isLoading || upComingQuery.isLoading || mostFavoriteQuery.isLoading || mostViewedQuery.isLoading) {
    return <LoadingPage />
  }

  if (newestQuery.isError || readQuery.isError || categoryQuery.isError || upComingQuery.isError || mostFavoriteQuery.isError || mostViewedQuery.isError) {
    return <ErrorPage onButtonClick={() => {
      categoryQuery.refetch();
      readQuery.refetch();
      newestQuery.refetch();
      mostFavoriteQuery.refetch();
      mostViewedQuery.refetch();
      upComingQuery.refetch();
    }}/>
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
          >
            {newestQuery.data.comics.map((item: Comic) => <ComicItem.Slide shadowEffect _data={item} style={{margin: 8}} />)}
          </Carousel>
        </Card>

        <ScrollMenu
          LeftArrow={LeftArrow}
          RightArrow={RightArrow}
          scrollContainerClassName={'scroll-menu-container'}
        >
          {categoryQuery.data.categories.map((item : Category) => (
            <Card
              key={item.id.toString()}
              shadowEffect
              style={{marginLeft: 4, marginRight: 4, marginTop: 8, marginBottom: 8, height: 56, width: 180, justifyContent: 'center', alignItems: 'center'}}
              onClick={() => navigate(`/comics?category_id=${item.id}`)}
              animation="slideLeftIn"
            >
              <Text>{item.name}</Text>
            </Card>
           ))}
        </ScrollMenu>

        {readQuery.data.comics.length !== 0 &&
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
                {readQuery.data.comics.map((item : Comic) => <ComicItem.Horizontal shadowEffect _data={item} style={{width: 440}}/>)}
              </ScrollMenu>
            </Card>
        </View>
        }

        {upComingQuery.data.comics.length !== 0 &&
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
                {upComingQuery.data.comics.map((item : Comic) => <ComicItem.Horizontal shadowEffect _data={item} style={{width: 440}}/>)}
              </ScrollMenu>
            </Card>
        </View>
        }

        <View gap={8}>
          <View horizontal style={{marginLeft: 8, marginRight: 8, alignItems: 'center'}}>
            <Text variant='large-title' style={{flex: 1}}>Mới cập nhật</Text>
            <Link style={{textDecoration: 'none', color: theme.colors.themeColor, fontWeight: 'bold'}} to={'/comics?sort_by=last_updated_chapter_at-desc'}>Xem thêm</Link>
          </View>
          <Card style={{paddingLeft: 0, paddingRight: 0}} animation="slideLeftIn">
            <ScrollMenu
              LeftArrow={LeftArrow}
              RightArrow={RightArrow}
              scrollContainerClassName={'scroll-menu-container'}
              itemClassName={'scroll-menu-item'}
            >
              {newestQuery.data.comics.map((item : Comic) => <ComicItem.Vertical shadowEffect _data={item}/>)}
            </ScrollMenu>
          </Card>
        </View>

        <View gap={8}>
          <View horizontal style={{marginLeft: 8, marginRight: 8, alignItems: 'center'}}>
            <Text variant='large-title' style={{flex: 1}}>Được yêu thích nhất</Text>
            <Link style={{textDecoration: 'none', color: theme.colors.themeColor, fontWeight: 'bold'}} to={'/comics?sort_by=likes-desc'}>Xem thêm</Link>
          </View>
          <Card style={{paddingLeft: 0, paddingRight: 0}}>
            <ScrollMenu
              LeftArrow={LeftArrow}
              RightArrow={RightArrow}
              scrollContainerClassName={'scroll-menu-container'}
              itemClassName={'scroll-menu-item'}
            >
              {mostFavoriteQuery.data.comics.map((item : Comic) => <ComicItem.Horizontal shadowEffect _data={item} style={{width: 440}}/>)}
            </ScrollMenu>
          </Card>
        </View>

        <View gap={8}>
          <View horizontal style={{marginLeft: 8, marginRight: 8, alignItems: 'center'}}>
            <Text variant='large-title' style={{flex: 1}}>Được xem nhiều nhất</Text>
            <Link style={{textDecoration: 'none', color: theme.colors.themeColor, fontWeight: 'bold'}} to={'/comics?sort_by=views-desc'}>Xem thêm</Link>
          </View>
          <Card style={{paddingLeft: 0, paddingRight: 0}}>
            <ScrollMenu
              LeftArrow={LeftArrow}
              RightArrow={RightArrow}
              scrollContainerClassName={'scroll-menu-container'}
              itemClassName={'scroll-menu-item'}
            >
              {mostViewedQuery.data.comics.map((item : Comic) => <ComicItem.Slide shadowEffect style={{width: 1024}} _data={item}/>)}
            </ScrollMenu>
          </Card>
        </View>
      </Page.Content>
    </Page.Container>
  )
}

export default HomePage;
