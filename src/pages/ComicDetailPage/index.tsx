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
import ChaptersArea from "./ChaptersArea";
import ReviewsArea from "./ReviewsArea";

function ComicDetailPage() {
  const [comic, setComic] = useState<Comic>(ComicDefault);

  const theme = useTheme();
  const navigate = useNavigate();
  const noti = useNotifications();
  const params = useParams();
  const comic_id = parseInt(params.comic_id!);

  const query = useQuery({
    queryKey: ['app', 'comics', comic_id],
    queryFn: () => ComicService.getDetailAsync(comic_id),
    retry: 0
  });

  const like = useMutation({
    mutationFn: () => ComicService.favoriteAsync(comic_id, !comic.favorited),
    onSettled: query.refetch
  });

  const follow = useMutation({
    mutationFn: () => ComicService.followAsync(comic_id, !comic.followed),
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
          <ComicItem.Image style={{borderRadius: 8}} variant="medium" src={comic.image_url} animation="slideRightIn"/>
          <View flex={1} gap={8}>
            <Text variant='large-title' numberOfLines={2}>{comic.name}</Text>
            {comic.other_names !== '' && <Text variant="medium" numberOfLines={1}>{comic.other_names}</Text> }
            {comic.authors?.length !== 0 && <Text numberOfLines={1}><b>Tác giả: </b>{comic.authors?.map(author => author.firstname + ' ' + author.lastname).join(', ')}</Text> }
            {comic.status !== '' && <Text numberOfLines={1}><b>Trạng thái: </b>{comic.status === 'finished' ? 'hoàn thành' : 'đang tiến hành'}</Text> }
            <View horizontal wrap flex={1} gap={4} style={{alignContent: 'flex-start'}}>
              {comic.categories?.map((item: Category) => <Tag variant={{ct: 'secondary'}} key={item.id!.toString()}>{item.name}</Tag>)}
            </View>
            <View horizontal gap={8}>
              <Button
                shadowEffect
                variant="secondary"
                style={{flex: 1}}
                onClick={() => actCUDHelper(like, noti, 'update')}
                animation="slideBottomIn"
              >
                <Icon icon={comic.favorited ? 'mingcute:heart-fill' : 'mingcute:heart-line'} style={{marginRight: 8, height: 24, width: 24, color: theme.colors.red}} />
                <Text style={{color: comic.favorited ? theme.colors.red : theme.colors.foreground, display: 'flex', flexDirection: 'row', alignItems: 'center'}}>Yêu thích</Text>
              </Button>
              <Button
                shadowEffect
                variant="secondary"
                style={{flex: 1}}
                onClick={() => actCUDHelper(follow, noti, 'update')}
                animation="slideBottomIn"
              >
                <Icon icon={comic.followed ? 'mingcute:book-5-fill' : 'mingcute:book-5-line'} style={{marginRight: 8, height: 24, width: 24, color: theme.colors.blue}} />
                <Text style={{color: comic.followed ? theme.colors.blue : theme.colors.foreground, display: 'flex', flexDirection: 'row', alignItems: 'center'}}>Theo dõi</Text>
              </Button>
              {comic.reading_chapter &&
                <Button
                  shadowEffect
                  variant="secondary"
                  style={{flex: 1}}
                  animation="slideBottomIn"
                  onClick={() => {
                    if (comic.reading_chapter) {
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
          <Card shadowEffect animation="slideLeftIn">
            <Text variant="medium-title" numberOfLines={1}>Tóm tắt</Text>
            <PreText >{comic.description}</PreText>
          </Card>
        </View>
        <View gap={8}>
          <ChaptersArea />
          <ReviewsArea />
        </View>
      </Page.Content>
    </Page.Container>
  )
}

export default ComicDetailPage;
