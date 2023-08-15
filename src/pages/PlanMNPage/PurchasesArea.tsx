import {Card, Tag, Text, View} from "@components";
import {Icon} from "@iconify/react";
import {Purchase, PurchaseMNService} from "@services";
import moment from "moment";
import {useMemo} from "react";
import InfiniteScroll from "react-infinite-scroller";
import {useInfiniteQuery} from "react-query";
import {useNotifications} from "reapop";
import {useTheme} from "styled-components";

function PurchasesArea() {
  const theme = useTheme();
  const noti = useNotifications();

  const query = useInfiniteQuery({
    queryKey: ['admin', 'purchases'],
    queryFn: ({ pageParam = 1 }) => PurchaseMNService.getAllAsync({page: pageParam}),
    getNextPageParam: (lastPage) => {
      if (lastPage.paginate.page >= lastPage.paginate.total_pages) {
        return null;
      }

      return lastPage.paginate.page + 1;
    }
  });

  const purchases = useMemo(() => query.data?.pages.flatMap(page => page.purchases), [query.data]);

  return (
    <View gap={8} style={{marginTop: 8}} animation="slideLeftIn">
      <Text variant="title">Giao dịch gần đây</Text>
      <InfiniteScroll
        pageStart={0}
        loadMore={() => query.fetchNextPage()}
        hasMore={query.hasNextPage}
        loader={<Text>Loading...</Text>}
        useWindow={false}
        getScrollParent={() => document.getElementById('rootScrollable')}
      >
        <View gap={8} wrap style={{justifyContent: 'center'}}>
          {purchases?.map((item: Purchase) => (
            <Card variant="secondary">
              <Text variant="title">{item.plan.name}</Text>
              <Text variant="small"><b>Ngày hiệu lực: </b>{moment(item.effective_at).format('DD-MM-YYYY HH:mm:ss')}</Text>
              <Text variant="small"><b>Ngày hết hạn: </b>{moment(item.expires_at).format('DD-MM-YYYY HH:mm:ss')}</Text>
              <View horizontal gap={4}>
                <Tag variant={{ct: 'tertiary'}} style={{gap: 8, color: theme.colors.idigo}}>
                  <Icon icon={'mingcute:wallet-4-line'} style={{height: 16, width: 16, color: theme.colors.idigo}} />
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}
                </Tag>
                <Tag variant={{ct: 'tertiary'}} style={{gap: 8}}>
                  <Icon icon={'mingcute:bank-card-line'} style={{height: 16, width: 16, color: theme.colors.foreground}} />
                  {item.payment_method == 'card' ? 'Master/Visa' : 'Không rõ'}
                </Tag>
                <View flex={1} />
                <Tag variant={{ct: 'tertiary'}} style={{gap: 8}}>
                  {item.owner?.username}
                </Tag>
              </View>
            </Card>
          ))}
        </View>
      </InfiniteScroll>
    </View>
  )
}

export default PurchasesArea;
