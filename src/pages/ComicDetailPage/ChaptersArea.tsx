import {Button, Card, ComicItem, Input, PreText, Tag, Text, TextArea, View} from "@components";
import {ComicService} from "@services";
import {useMemo, useState} from "react";
import InfiniteScroll from "react-infinite-scroller";
import {useInfiniteQuery, useMutation} from "react-query";
import {useParams} from "react-router";
import {Chapter} from "@services";
import {useTheme} from "styled-components";
import {Icon} from "@iconify/react";
import { Link } from "react-router-dom";
import moment from "moment";

function ChaptersArea() {
  const theme = useTheme();
  const params = useParams();
  const comic_id = parseInt(params.comic_id!);

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

  return (
    <View gap={8}>
      <View horizontal>
        <Text variant="large-title" style={{flex: 1}}>Danh sách chương</Text>
      </View>
      <View gap={8} style={{maxHeight: 640, overflow: 'auto'}} scrollable>
        {chapters?.length !== 0 ?
        <InfiniteScroll
          loadMore={() => query.fetchNextPage()}
          hasMore={query.hasNextPage}
          loader={<Text>Loading...</Text>}
        >
          <View gap={4}>
            {chapters?.map((item: Chapter) => (
              <View gap={4} animation="slideRightIn">
                <Link to={`/comics/${comic_id}/chapters/${item.id}`} style={{textDecoration: 'none'}}>
                  <Card horizontal style={{alignItems: 'center'}} shadowEffect>
                    <Text variant="title" style={{flex: 1}}>{item.name}</Text>
                    {item.read &&
                    <Tag variant={{ct: "tertiary"}} style={{gap: 8, color: theme.colors.green}}>
                      <Icon icon={'mingcute:eye-2-line'} style={{height: 16, width: 16, color: theme.colors.green}} />
                      Đã đọc
                    </Tag>
                    }
                    {!item.free &&
                    <Tag variant={{ct: "tertiary"}} style={{gap: 8, color: theme.colors.idigo}}>
                      <Icon icon="mingcute:vip-1-line" style={{height: 16, width: 16, color: theme.colors.idigo}}/>
                      Gói
                    </Tag>
                    }
                    <Tag variant={{ct: "secondary"}}>{moment(item?.created_at).format('DD-MM-YYYY HH:MM:ss')}</Tag>
                  </Card>
                </Link>
              </View>
            ))}
          </View>
        </InfiniteScroll>
        :
        <View flex={1} centerContent>
          <Text variant="medium-title" style={{color: theme.colors.quinaryForeground}}>Không tìm thấy đánh giá nào</Text>
        </View>
        }
      </View>
    </View>
  )
}

export default ChaptersArea;
