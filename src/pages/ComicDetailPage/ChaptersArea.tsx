import {Button, Card, ComicItem, Input, PreText, Tag, Text, TextArea, View} from "@components";
import {ComicService} from "@services";
import {useMemo, useState} from "react";
import InfiniteScroll from "react-infinite-scroller";
import {useInfiniteQuery, useMutation} from "react-query";
import {useParams} from "react-router";
import {Chapter} from "@services";
import {useTheme} from "styled-components";
import moment from "moment";
import {Icon} from "@iconify/react";
import Modal from 'react-modal';
import { UseMutationResult } from "react-query";
import {useNotifications} from "reapop";
import { actCUDHelper } from "@helpers/CUDHelper";
import LoadingPage from "../LoadingPage";
import { Link } from "react-router-dom";

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
    <Card shadowEffect animation="slideRightIn">
      <View horizontal>
        <Text variant="medium-title" style={{flex: 1}}>Danh sách chương</Text>
      </View>
      <View gap={8} style={{height: 640, overflow: 'auto'}} scrollable>
        {chapters?.length !== 0 ?
        <InfiniteScroll
          loadMore={() => {}}
          hasMore={false}
          loader={<Text>Loading...</Text>}
        >
          <View gap={8}>
            {chapters?.map((item: Chapter) => (
              <View gap={4}>
                {chapters.map((item: Chapter) => (
                  <Link to={`/comics/${comic_id}/chapters/${item.id}`} style={{textDecoration: 'none'}}>
                    <Card horizontal style={{height: 40, alignItems: 'center'}}>
                      <Text variant="title" style={{flex: 1}}>{item.name}</Text>
                      {!item.free && <Icon icon="mingcute:vip-1-line" style={{height: 20, width: 20, color: theme.colors.themeColor}}/>}
                    </Card>
                  </Link>
                ))}
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
    </Card>
  )
}

export default ChaptersArea;
