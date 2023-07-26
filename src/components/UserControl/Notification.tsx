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

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  border-radius: 8px;
`;

const ItemContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 8px;
  border-bottom: 1px solid ${props => props.theme.colors.tertiaryBackground};
`;

function NotificationItem({_data}: {_data: Notification}) {
  return (
    <Card variant="tertiary" key={_data.id!.toString()} style={{gap: 4}}>
      <Text variant="title" numberOfLines={1}>{_data.message.title}</Text>
      <Text variant="small">{_data.message.body}</Text>
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
    <View scrollable animation="slideTopIn" gap={8}>
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
      {notifications?.length === 0 ?
        null
      :
      <InfiniteScroll
        loadMore={() => query.fetchNextPage()}
        hasMore={query.hasNextPage}
        loader={<Text>Loading...</Text>}
      >
        <View gap={4}>
          {notifications?.map((item: Notification) => <NotificationItem _data={item} />)}
        </View>
      </InfiniteScroll>
      }
    </View>
  )
}

export default Notifications;
