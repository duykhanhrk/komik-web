import {useUserProfileQuery} from "@hooks"
import {Icon} from "@iconify/react";
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
    return null;
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
      <View horizontal gap={8} style={{alignItems: 'center'}}>
        <View style={{height: 100, width: 100}}>
          <Icon icon={'mingcute:vip-1-fill'} style={{height: 100, width: 100, color: theme.colors.idigo}} />
        </View>
        <View gap={4}>
          <Text variant="large-title">Gói</Text>
          <Text variant="small" style={{color: theme.colors.tertiaryForeground}}>
          {query.data.user.current_plan
            ? 'Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi. Gói hiện tại của bạn có giá trị sử dụng đến ' + Moment(query.data.user.current_plan.expires_at).format('DD/MM/YY HH:mm:ss')
            : 'Bạn đã sẵn sàng bước chân vào cuộc hành trình mới đầy phấn khích với gói đăng ký độc đáo của chúng tôi?'
          }
          </Text>

        </View>
      </View>
      { query.data.user.current_plan
      ?  null
      :
        <Button
          variant="primary"
          style={{columnGap: 8}}
          onClick={() => navigate('/plans')}
        >
          <Text style={{color: theme.colors.themeForeground}}>Đăng ký gói ngay</Text>
        </Button>
      }
      <History />
    </View>
  )
}

export default Plan;
