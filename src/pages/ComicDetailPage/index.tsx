import {useQuery} from "react-query";
import {useTheme} from "styled-components";
import { useParams } from "react-router";
import {Category, Chapter, Comic, ComicService} from "@services";
import {Button, Card, ComicItem, Page, Tag, Text, View} from "@components";
import {Icon} from "@iconify/react";
import LoadingPage from "../LoadingPage";
import ErrorPage from "../ErrorPage";
import InfiniteScroll from "react-infinite-scroller";
import {Link} from "react-router-dom";

function ComicDetailPage() {
  const theme = useTheme();
  const { comic_id } = useParams();
  const query = useQuery({
    queryKey: ['comic', comic_id],
    queryFn: () => ComicService.getDetailAsync(parseInt(comic_id || '')),
    retry: 0
  });

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
          <ComicItem.Image style={{borderRadius: 8}} variant="medium" src={_data.image}/>
          <View flex={1} gap={8}>
            <Text variant='large-title' numberOfLines={2}>{_data.name}</Text>
            {_data.other_names !== '' && <Text variant="medium" numberOfLines={1}>{_data.other_names}</Text> }
            {_data.author !== '' && <Text numberOfLines={1}><b>Tác giả: </b>{_data.author}</Text> }
            {_data.status !== '' && <Text numberOfLines={1}><b>Trạng thái: </b>{_data.status}</Text> }
            <View horizontal wrap flex={1} gap={4} style={{alignContent: 'flex-start'}}>
              {_data.categories?.map((item: Category) => <Tag variant={{ct: 'secondary'}} key={item.id.toString()}>{item.name}</Tag>)}
            </View>
            <View horizontal gap={8}>
              <Button shadowEffect variant="secondary" style={{flex: 1}}>
                <Icon icon={query.data.comic.liked ? 'mingcute:heart-fill' : 'mingcute:heart-line'} style={{marginRight: 8, height: 24, width: 24, color: theme.colors.red}} />
                <Text style={{color: query.data.comic.liked ? theme.colors.red : theme.colors.foreground, display: 'flex', flexDirection: 'row', alignItems: 'center'}}>Yêu thích</Text>
              </Button>
              <Button shadowEffect variant="secondary" style={{flex: 1}}>
                <Icon icon={query.data.comic.followed ? 'mingcute:book-5-fill' : 'mingcute:book-5-line'} style={{marginRight: 8, height: 24, width: 24, color: theme.colors.blue}} />
                <Text style={{color: query.data.comic.followed ? theme.colors.blue : theme.colors.foreground, display: 'flex', flexDirection: 'row', alignItems: 'center'}}>Xem sau</Text>
              </Button>
              <Button shadowEffect variant="secondary" style={{flex: 1}}>
                <Icon icon={query.data.comic.reading_chapter ? 'mingcute:arrow-right-fill' : 'mingcute:arrow-right-line'} style={{marginRight: 8, height: 24, width: 24, color: theme.colors.yellow}} />
                <Text style={{color: query.data.comic.followed ? theme.colors.yellow : theme.colors.foreground, display: 'flex', flexDirection: 'row', alignItems: 'center'}}>Đọc tiếp</Text>
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
