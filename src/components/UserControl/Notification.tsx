import {NotificationService, Notification} from "@services";
import {useMemo} from "react";
import {useInfiniteQuery} from "react-query";
import styled, {useTheme} from "styled-components";
import InfiniteScroll from 'react-infinite-scroller';
import Text from "../Text"
import View from "../View"
import {LoadingPage} from "@pages";
import Card from "../Card";
import {Icon} from "@iconify/react";
import Tag from "../Tag";
import moment from "moment";
import Grid from "../Grid";

function NotificationItem({_data}: {_data: Notification}) {
  const theme = useTheme();
  moment.locale('vi');

  return (
    <Card variant="tertiary" key={_data.id!.toString()} style={{gap: 8, height: 112}}>
      <Text numberOfLines={1} variant="title">{_data.message.title}</Text>
      <Text numberOfLines={2} variant="small">{_data.message.body}</Text>
      <View flex={1} horizontal gap={4} style={{alignItems: 'flex-end'}}>
        <Tag variant={{ct: 'secondary'}} style={{gap: 8, color: theme.colors.green, justifyContent: 'flex-end'}}>
          <Icon icon={'mingcute:time-line'} style={{height: 16, width: 16, color: theme.colors.green}} />
          {moment(_data.created_at).fromNow()}
        </Tag>
      </View>
    </Card>
  )
}

function Notifications() {
  const theme = useTheme();
  const query = useInfiniteQuery({
    queryKey: ['user', 'notifications'],
    queryFn: ({ pageParam = 1 }) => NotificationService.getAllAsync({page: pageParam, per_page: 10}),
    getNextPageParam: (lastPage) => {
      if (lastPage.paginate.page >= lastPage.paginate.total_pages) {
        return null;
      }

      return lastPage.paginate.page + 1;
    },
    onSuccess(data) {
      console.log(data);
    },
  });

  const notifications = useMemo(() => query.data?.pages.flatMap(page => page.notifications), [query.data]);

  if (query.isLoading) {
    return <LoadingPage />;
  }

  return (
    <View flex={1} gap={8} style={{overflow: 'hidden'}} animation="slideTopIn">
      <View horizontal gap={8} style={{alignItems: 'center'}}>
        <View style={{height: 100, width: 100}}>
          <Icon icon={'mingcute:notification-fill'} style={{height: 100, width: 100, color: theme.colors.green}} />
        </View>
        <View gap={4}>
          <Text variant="large-title">Thông báo</Text>
          <Text variant="small" style={{color: theme.colors.tertiaryForeground}}>
            Bạn muốn luôn cập nhật tin tức mới nhất, thông báo quan trọng và nhận thông báo ngay lập tức mỗi khi có sự kiện quan trọng? 
          </Text>
        </View>
      </View>
      <View flex={1} scrollable gap={8} style={{padding: 2}}>
        {notifications?.length === 0 ?
          null
        :
        <InfiniteScroll
          loadMore={() => query.fetchNextPage()}
          hasMore={query.hasNextPage}
          loader={<Text>Loading...</Text>}
        >
          <Grid gap={4} templateColumns="auto">
            {notifications?.map((item: Notification) => <NotificationItem _data={item} />)}
          </Grid>
        </InfiniteScroll>
        }
      </View>
    </View>
  )
}

export default Notifications;
