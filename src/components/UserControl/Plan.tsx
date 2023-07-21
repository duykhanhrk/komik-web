import {useUserProfileQuery} from "@hooks"
import {LoadingPage} from "@pages";
import {Purchase, PurchaseService} from "@services";
import Moment from 'moment';
import {useMemo} from "react";
import InfiniteScroll from "react-infinite-scroller";
import {useInfiniteQuery} from "react-query";
import {useNavigate} from "react-router";
import {useTheme} from "styled-components";
import Button from "../Button";
import Card from "../Card";
import Text from "../Text";
import View from "../View"

function History() {
  const theme = useTheme();
  const query = useInfiniteQuery({
    queryKey: ['user', 'plan'],
    queryFn: ({ pageParam = 1 }) => PurchaseService.getAllAsync({page: pageParam, per_page: 10}),
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

  const purchases = useMemo(() => query.data?.pages.flatMap(page => page.purchases), [query.data]);

  if (query.isLoading) {
    return <LoadingPage />;
  }

  if (purchases?.length === 0) {
    return (
      <View centerContent flex={1}>
        <Text style={{color: theme.colors.quinaryForeground}}>Không có nội dung</Text>
      </View>
    )
  }

  return (
    <View scrollable style={{height: 320}}>
      <InfiniteScroll
        loadMore={() => query.fetchNextPage()}
        hasMore={query.hasNextPage}
        loader={<Text>Loading...</Text>}
      >
        <View gap={4}>
          {purchases?.map((item: Purchase) => (
            <Card variant="tertiary">
              <Text variant="title">{item.plan.name}</Text>
              <Text><b>Ngày có hiệu lực: </b>{Moment(item.effective_date).format('DD/MM/YY HH:mm:ss')}</Text>
              <Text><b>Ngày có hết hạn: </b>{Moment(item.expires_date).format('DD/MM/YY HH:mm:ss')}</Text>
              <Text><b>{'Tổng tiền: '}</b>{item.price.toString() + 'đ'}</Text>
              <Text><b>{'Phương thức TT: '}</b>{item.payment_method == 'card' ? 'Thẻ Master/Visa' : 'Không rõ'}</Text>
            </Card>
          ))}
        </View>
      </InfiniteScroll>
    </View>
  )
}

function Plan() {
  const query = useUserProfileQuery();
  const navigate = useNavigate();
  const theme = useTheme();

  if (query.isLoading) {
    return <LoadingPage />;
  }


  return (
    <View gap={8} flex={1} animation="slideTopIn">
      { query.data.user.current_plan ?
        <>
          <Text variant="title">Gói hiện tại</Text>
          <Card variant="tertiary">
            <Text><b>Ngày đăng ký: </b>{Moment(query.data.user.current_plan.effective_date).format('DD/MM/YYYY HH:mm:ss')}</Text>
            <Text><b>Ngày hết hạn: </b>{Moment(query.data.user.current_plan.expiry_date).format('DD/MM/YYYY HH:mm:ss')}</Text>
          </Card>
        </>
      :
        <Button
          variant="primary"
          style={{columnGap: 8}}
          onClick={() => navigate('/plans')}
        >
          <Text style={{color: theme.colors.themeForeground}}>Đăng ký gói ngay</Text>
        </Button>
      }
      <Text variant="title">Lịch sử đăng ký gói</Text>
      <History />
    </View>
  )
}

export default Plan;
