import {useMutation, useQuery} from "react-query";
import {useTheme} from "styled-components";
import { useNavigate, useParams } from "react-router";
import {Category, Chapter, Comic, ComicDefault, ComicService} from "@services";
import {Button, Card, ComicItem, Page, PreText, Tag, Text, View} from "@components";
import {Icon} from "@iconify/react";
import LoadingPage from "../LoadingPage";
import ErrorPage from "../ErrorPage";
import InfiniteScroll from "react-infinite-scroller";
import {Link} from "react-router-dom";
import {useNotifications} from "reapop";
import {useEffect, useState} from "react";
import {actCUDHelper} from "@helpers/CUDHelper";

function ComicDetailPage() {
  const [comic, setComic] = useState<Comic>(ComicDefault);

  const theme = useTheme();
  const navigate = useNavigate();
  const noti = useNotifications();
  const { comic_id } = useParams();

  const query = useQuery({
    queryKey: ['app', 'comics', comic_id],
    queryFn: () => ComicService.getDetailAsync(parseInt(comic_id || '')),
    retry: 0
  });

  const like = useMutation({
    mutationFn: () => ComicService.likeAsync(parseInt(comic_id || '0'), !comic.liked),
    onSettled: query.refetch
  });

  const follow = useMutation({
    mutationFn: () => ComicService.followAsync(parseInt(comic_id || '0'), !comic.followed),
    onSettled: query.refetch
  });

  useEffect(() => {
    query.data && query.data.comic && setComic(query.data.comic);
  }, [query.data])

  if (query.isLoading) {
    return <LoadingPage />;
  }

  if (query.isError) {
    return <ErrorPage error={query.error} onButtonClick={() => query.refetch()} />;
  }

  return (
    <Page.Container>
      <Page.Content gap={16}>
        <View horizontal gap={8}>
          <ComicItem.Image style={{borderRadius: 8}} variant="medium" src={comic.image_url}/>
          <View flex={1} gap={8}>
            <Text variant='large-title' numberOfLines={2}>{comic.name}</Text>
            {comic.other_names !== '' && <Text variant="medium" numberOfLines={1}>{comic.other_names}</Text> }
            {comic.author !== '' && <Text numberOfLines={1}><b>Tác giả: </b>{comic.author}</Text> }
            {comic.status !== '' && <Text numberOfLines={1}><b>Trạng thái: </b>{comic.status === 'finished' ? 'hoàn thành' : 'đang tiến hành'}</Text> }
            <View horizontal wrap flex={1} gap={4} style={{alignContent: 'flex-start'}}>
              {comic.categories?.map((item: Category) => <Tag variant={{ct: 'secondary'}} key={item.id.toString()}>{item.name}</Tag>)}
            </View>
            <View horizontal gap={8}>
              <Button
                shadowEffect
                variant="secondary"
                style={{flex: 1}}
                onClick={() => actCUDHelper(like, noti, 'update')}
              >
                <Icon icon={query.data.comic.liked ? 'mingcute:heart-fill' : 'mingcute:heart-line'} style={{marginRight: 8, height: 24, width: 24, color: theme.colors.red}} />
                <Text style={{color: query.data.comic.liked ? theme.colors.red : theme.colors.foreground, display: 'flex', flexDirection: 'row', alignItems: 'center'}}>Yêu thích</Text>
              </Button>
              <Button
                shadowEffect
                variant="secondary"
                style={{flex: 1}}
                onClick={() => actCUDHelper(follow, noti, 'update')}
              >
                <Icon icon={query.data.comic.followed ? 'mingcute:book-5-fill' : 'mingcute:book-5-line'} style={{marginRight: 8, height: 24, width: 24, color: theme.colors.blue}} />
                <Text style={{color: query.data.comic.followed ? theme.colors.blue : theme.colors.foreground, display: 'flex', flexDirection: 'row', alignItems: 'center'}}>Xem sau</Text>
              </Button>
              {comic.chapters?.length !== 0 &&
                <Button
                  shadowEffect
                  variant="secondary"
                  style={{flex: 1}}
                  onClick={() => {
                    if (query.data.comic.reading_chapter) {
                      navigate(`/comics/${comic_id}/chapters/${query.data.comic.reading_chapter.id}`);
                    } else {
                      if (query.data.comic.chapters.length !== 0) {
                        navigate(`/comics/${comic_id}/chapters/${query.data.comic.chapters[0].id}`);
                      } else {
                        alert('Hiện tại không có chương nào');
                      }
                    }
                  }}
                >
                  <Icon icon={query.data.comic.reading_chapter ? 'mingcute:arrow-right-fill' : 'mingcute:arrow-right-line'} style={{marginRight: 8, height: 24, width: 24, color: theme.colors.yellow}} />
                  <Text style={{color: query.data.comic.reading_chapter ? theme.colors.yellow : theme.colors.foreground, display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                    {query.data.comic.reading_chapter ? 'Đọc tiếp' : 'Đọc ngay'}
                  </Text>
                </Button>
              }
            </View>
          </View>
        </View>
        <View gap={8}>
          <Card shadowEffect>
            <Text variant="medium-title" numberOfLines={1}>Tóm tắt</Text>
            <PreText >{comic.description}</PreText>
          </Card>
        </View>
        <View gap={8}>
          <Card shadowEffect>
            <Text variant="medium-title">Danh sách chương</Text>
            <View style={{height: 640, overflow: 'auto'}} scrollable>
              {comic.chapters?.length !== 0 ?
              <InfiniteScroll
                loadMore={() => {}}
                hasMore={false}
                loader={<Text>Loading...</Text>}
              >
                <View gap={4}>
                  {query.data.comic.chapters.map((item: Chapter) => (
                    <Link to={`/comics/${comic_id}/chapters/${item.id}`} style={{textDecoration: 'none'}}>
                      <Card horizontal style={{height: 40, alignItems: 'center'}}>
                        <Text variant="title" style={{flex: 1}}>{item.name}</Text>
                        {!item.free && <Icon icon="mingcute:vip-1-line" style={{height: 20, width: 20, color: theme.colors.themeColor}}/>}
                      </Card>
                    </Link>
                  ))}
                </View>
              </InfiniteScroll>
              :
              <View flex={1} centerContent>
                <Text variant="medium-title" style={{color: theme.colors.quinaryForeground}}>Không tìm thấy chương nào</Text>
              </View>
              }
            </View>
          </Card>
        </View>
      </Page.Content>
    </Page.Container>
  )
}

export default ComicDetailPage;
