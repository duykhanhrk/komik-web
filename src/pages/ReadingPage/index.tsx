import {Button, Card, ComicItem, Page, Tag, Text, View} from "@components";
import {Icon} from "@iconify/react";
import {ComicService} from "@services";
import {useEffect, useMemo, useState} from "react";
import {useInfiniteQuery, useQuery} from "react-query";
import {useNavigate, useParams} from "react-router";
import {useTheme} from "styled-components";
import ErrorPage from "../ErrorPage";
import LoadingPage from "../LoadingPage";
import InfiniteScroll from "react-infinite-scroller";

function ControlPanel({hide, onHideChanged}: {hide: boolean, onHideChanged: (isHide: boolean) => void}) {
  const [isHide, setIsHide] = useState(hide);

  const theme = useTheme();
  const navigate = useNavigate();
  const params = useParams();
  const comic_id = parseInt(params.comic_id!);
  const chapter_id = parseInt(params.chapter_id!);

  useEffect(() => {
    setIsHide(hide);
  }, [hide])

  const query = useInfiniteQuery({
    queryKey: ['app', 'comic', comic_id, 'chapters'],
    queryFn: ({pageParam = 1}) => ComicService.getChaptersAsync(comic_id, {page: pageParam}),
    getNextPageParam: (lastPage) => {
      if (lastPage.paginate.page >= lastPage.paginate.total_pages) {
        return null;
      }

      return lastPage.paginate.page + 1;
    }
  });

  const chapters = useMemo(() => query.data?.pages.flatMap(page => page.chapters), [query.data]);

  if (query.isLoading) {
    return <LoadingPage />
  }

  if (query.isError) {
    return <ErrorPage />
  }

  return (
    <View gap={8} style={{display: isHide ? 'none' : 'flex', position: 'sticky', height: 'calc(100vh - 60px)', left: 0, bottom: 0, top: 60, width: 272, padding: '0px 8px 8px 8px', flexBasis: 272, flexShrink: 0}}>
      <Card horizontal ebonsai animation="slideRightIn">
        <View flex={1} horizontal gap={8}>
          <Button ebonsai variant="transparent" onClick={() => navigate(`/comics/${comic_id}`)} style={{gap: 8, width: 'auto'}}>
            <Icon icon={'mingcute:arrow-left-line'} style={{color: theme.colors.foreground, height: 24, width: 24}}/>
            <Text>Trở về</Text>
          </Button>
        </View>
        <Button
          ebonsai
          variant="transparent"
          style={{width: 36}}
          onClick={() => {
            let _isHide = !isHide;
            setIsHide(_isHide);
            onHideChanged(_isHide);
          }}
        >
          <Icon icon={'mingcute:layout-left-fill'} style={{color: theme.colors.foreground, height: 24, width: 24}}/>
        </Button>
      </Card>
      <Card flex={1} animation="slideRightIn">
        <View scrollable>
          <InfiniteScroll
                    loadMore={() => {}}
                    hasMore={false}
                    loader={<Text>Loading...</Text>}
          >
          {chapters!.map((item: any) => (
            <Card
              variant={item.id === chapter_id ? 'tertiary' : undefined}
              horizontal
              style={{height: 40, alignItems: 'center'}}
              onClick={() => navigate(`/comics/${comic_id}/chapters/${item.id}`)}
            >
              <Text variant="title" style={{flex: 1, color: item.id === chapter_id ? (item.free ? theme.colors.blue : theme.colors.idigo ) : theme.colors.foreground}}>{item.name}</Text>
              {!item.free && <Icon icon="mingcute:vip-1-line" style={{height: 20, width: 20, color: theme.colors.idigo}}/>}
            </Card>
          ))}
          </InfiniteScroll>
        </View>
      </Card>
    </View>
  );
}

function ReadingArea({hide, onHideChanged}: {hide?: boolean, onHideChanged: (isHide: boolean) => void}) {
  const [isHide, setIsHide] = useState(hide);

  const theme = useTheme();
  const navigate = useNavigate();
  const params = useParams();
  const comic_id = parseInt(params.comic_id!);
  const chapter_id = parseInt(params.chapter_id!);

  const query = useQuery({
    queryKey: ['app', 'comics', comic_id, 'chapters', chapter_id],
    queryFn: () => ComicService.getChapterDetailAsync(comic_id, chapter_id),
    retry: 0
  });

  useEffect(() => {
    setIsHide(hide);
  }, [hide]);

  return (
    <>
      {query.isLoading
        ? <LoadingPage />
        : query.isError
        ? <ErrorPage
            error={query.error}
            messages={['Bạn cần đăng ký gói để sử dụng nội dung này']}
            buttonText={'Mua gói ngay'}
            onButtonClick={() => navigate('/plans')}
          />
        : 
          <>
            {query.data.chapter.image_urls.length !== 0
            ? query.data.chapter.image_urls.map((item: string) => (
                <Card style={{padding: 0, backgroundColor: 'transparent'}} animation="slideTopIn">
                  <img src={item} />
                </Card>
              ))
            : <View flex={1} centerContent>
                <Text variant="large-title" style={{color: theme.colors.quinaryForeground}}>
                  Đang được cập nhật
                </Text>
              </View>
            }
          </>
      }
      <View horizontal centerContent gap={8} style={{display: isHide ? 'none' : 'flex', paddingTop: 8, position: 'sticky', bottom: 8, left: 0, right: 0}}>
        <Card ebonsai animation="slideTopIn">
          <Button disabled={!query.isSuccess || (query.isSuccess && query.data.chapter.previous_chapter === null)} ebonsai variant="secondary" style={{width: 120}} onClick={() => navigate(`/comics/${comic_id}/chapters/${query.data.chapter.previous_chapter.id}`)}>
            <Icon icon={'mingcute:arrow-left-line'} style={{color: theme.colors.foreground, height: 24, width: 24}}/>
          </Button>
          <Button
            ebonsai
            variant="secondary"
            style={{width: 120}}
            onClick={() => {
              let _isHide = !isHide;
              setIsHide(_isHide);
              onHideChanged(_isHide);
            }}
          >
            <Icon icon={'mingcute:layout-left-line'} style={{color: theme.colors.foreground, height: 24, width: 24}}/>
          </Button>
          <Button disabled={!query.isSuccess || (query.isSuccess && query.data.chapter.next_chapter === null)} ebonsai variant="secondary" style={{width: 120}} onClick={() => navigate(`/comics/${comic_id}/chapters/${query.data.chapter.next_chapter.id}`)}>
            <Icon icon={'mingcute:arrow-right-line'} style={{color: theme.colors.foreground, height: 24, width: 24}}/>
          </Button>
        </Card>
      </View>
    </>
  )
}

function ReadingPage() {
  const [isHideControlPanel, setIsHideControlPanel] = useState(false);

  return (
    <View flex={1} horizontal>
      <ControlPanel hide={isHideControlPanel} onHideChanged={(isHide) => setIsHideControlPanel(isHide)}/>
      <Page.Container>
        <Page.Content style={{gap: 0}}>
          <ReadingArea  hide={!isHideControlPanel} onHideChanged={() => setIsHideControlPanel(!isHideControlPanel)}/>
        </Page.Content>
      </Page.Container>
    </View>
  );
}

export default ReadingPage;
