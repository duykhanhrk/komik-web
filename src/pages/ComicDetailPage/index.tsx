import {useMutation, useQuery} from "react-query";
import {useTheme} from "styled-components";
import { useNavigate, useParams } from "react-router";
import {Category, Chapter, Comic, ComicService} from "@services";
import {Button, Card, ComicItem, Page, Tag, Text, View} from "@components";
import {Icon} from "@iconify/react";
import LoadingPage from "../LoadingPage";
import ErrorPage from "../ErrorPage";
import InfiniteScroll from "react-infinite-scroller";
import {Link} from "react-router-dom";
import {useNotifications} from "reapop";
import {isAxiosError} from "axios";

function ComicDetailPage() {
  const theme = useTheme();
  const navigate = useNavigate();
  const {notify} = useNotifications();
  const { comic_id } = useParams();
  const query = useQuery({
    queryKey: ['comic', comic_id],
    queryFn: () => ComicService.getDetailAsync(parseInt(comic_id || '')),
    retry: 0
  });

  const like = useMutation({
    mutationFn: () => ComicService.likeAsync(parseInt(comic_id || '0'), !query.data.comic.liked),
    onSettled: query.refetch
  })

  const follow = useMutation({
    mutationFn: () => ComicService.followAsync(parseInt(comic_id || '0'), !query.data.comic.followed),
    onSettled: query.refetch
  })

  if (query.isLoading) {
    return <LoadingPage />;
  }

  if (query.isError) {
    return <ErrorPage error={query.error} onButtonClick={() => query.refetch()} />;
  }

  const _data: Comic = query.data.comic;

  return (
    <Page.Container>
      <Page.Content gap={16}>
        <View horizontal gap={8}>
          <ComicItem.Image style={{borderRadius: 8}} variant="medium" src={_data.image_url}/>
          <View flex={1} gap={8}>
            <Text variant='large-title' numberOfLines={2}>{_data.name}</Text>
            {_data.other_names !== '' && <Text variant="medium" numberOfLines={1}>{_data.other_names}</Text> }
            {_data.author !== '' && <Text numberOfLines={1}><b>Tác giả: </b>{_data.author}</Text> }
            {_data.status !== '' && <Text numberOfLines={1}><b>Trạng thái: </b>{_data.status}</Text> }
            <View horizontal wrap flex={1} gap={4} style={{alignContent: 'flex-start'}}>
              {_data.categories?.map((item: Category) => <Tag variant={{ct: 'secondary'}} key={item.id.toString()}>{item.name}</Tag>)}
            </View>
            <View horizontal gap={8}>
              <Button
                shadowEffect
                variant="secondary"
                style={{flex: 1}}
                onClick={() => {
                  const notification = notify({
                    title: 'Thực thi',
                    message: 'Đang tải cập nhật',
                    status: 'loading',
                    dismissible: false
                  });

                  like.mutateAsync()
                    .then(() => {
                      notification.title = 'Thành công'
                      notification.status = 'success';
                      notification.message = 'Cập nhật thành công';
                      notification.dismissible = true;
                      notification.dismissAfter = 3000;
                      notify(notification);
                    })
                    .catch((error) => {
                      if (isAxiosError(error) && error.response) {
                        notification.message = error.response.data.message;
                      } else {
                        notification.message = 'Có lỗi xảy ra, xin thử lại sau';
                      }

                      notification.title = 'Lỗi'
                      notification.status = 'error';
                      notification.dismissible = true;
                      notification.dismissAfter = 3000;

                      notify(notification);
                    });
                }}
              >
                <Icon icon={query.data.comic.liked ? 'mingcute:heart-fill' : 'mingcute:heart-line'} style={{marginRight: 8, height: 24, width: 24, color: theme.colors.red}} />
                <Text style={{color: query.data.comic.liked ? theme.colors.red : theme.colors.foreground, display: 'flex', flexDirection: 'row', alignItems: 'center'}}>Yêu thích</Text>
              </Button>
              <Button
                shadowEffect
                variant="secondary"
                style={{flex: 1}}
                onClick={() => {
                  const notification = notify({
                    title: 'Thực thi',
                    message: 'Đang tải cập nhật',
                    status: 'loading',
                    dismissible: false
                  });

                  follow.mutateAsync()
                    .then(() => {
                      notification.title = 'Thành công'
                      notification.status = 'success';
                      notification.message = 'Cập nhật thành công';
                      notification.dismissible = true;
                      notification.dismissAfter = 3000;
                      notify(notification);
                    })
                    .catch((error) => {
                      if (isAxiosError(error) && error.response) {
                        notification.message = error.response.data.message;
                      } else {
                        notification.message = 'Có lỗi xảy ra, xin thử lại sau';
                      }

                      notification.title = 'Lỗi'
                      notification.status = 'error';
                      notification.dismissible = true;
                      notification.dismissAfter = 3000;

                      notify(notification);
                    });
                }}
              >
                <Icon icon={query.data.comic.followed ? 'mingcute:book-5-fill' : 'mingcute:book-5-line'} style={{marginRight: 8, height: 24, width: 24, color: theme.colors.blue}} />
                <Text style={{color: query.data.comic.followed ? theme.colors.blue : theme.colors.foreground, display: 'flex', flexDirection: 'row', alignItems: 'center'}}>Xem sau</Text>
              </Button>
              <Button
                shadowEffect
                variant="secondary"
                style={{flex: 1}}
                onClick={() => {
                  if (query.data.comic.reading_chapter) {
                    navigate(`/comics/${comic_id}/chapters/${query.data.comic.reading_chapter.id}`);
                  } else {
                    if (query.data.comic.chapters.length !== 0) {
                      navigate(`/comics/${comic_id}/chapters/${query.data.comic.chapters[0]}`);
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
            </View>
          </View>
        </View>
        <View gap={8}>
          <Text variant="medium-title" numberOfLines={1}>Tóm tắt</Text>
          <Card shadowEffect>
            <Text numberOfLines={5}>{_data.description}</Text>
          </Card>
        </View>
        <View gap={8}>
          <Text variant="medium-title">Danh sách chương</Text>
          <Card shadowEffect>
            <View style={{maxHeight: '50vh', overflow: 'auto'}}>
              <InfiniteScroll
                loadMore={() => {}}
                hasMore={false}
                loader={<Text>Loading...</Text>}
              >
                <View gap={4}>
                  {query.data.comic.chapters.map((item: Chapter) => (
                    <Link to={`/comics/${comic_id}/chapters/${item.id}`}>
                      <Card>
                        <Text variant="title">{item.name}</Text>
                      </Card>
                    </Link>
                  ))}
                </View>
              </InfiniteScroll>
            </View>
          </Card>
        </View>
      </Page.Content>
    </Page.Container>
  )
}

export default ComicDetailPage;
