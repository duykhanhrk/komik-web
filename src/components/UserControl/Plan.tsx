import {useUserProfileQuery} from '@hooks';
import {Icon} from '@iconify/react';
import {LoadingPage} from '@pages';
import {Purchase, PurchaseService} from '@services';
import moment from 'moment';
import Moment from 'moment';
import {useMemo} from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import {useInfiniteQuery} from 'react-query';
import {useNavigate} from 'react-router';
import {useTheme} from 'styled-components';
import Button from '../Button';
import Card from '../Card';
import Tag from '../Tag';
import Text from '../Text';
import View from '../View';

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
        <View scrollable style={{padding: 2}}>
            <InfiniteScroll
                loadMore={() => query.fetchNextPage()}
                hasMore={query.hasNextPage}
                loader={<Text>Loading...</Text>}
            >
                <View gap={4}>
                    {purchases?.map((item: Purchase) => (
                        <Card variant="tertiary">
                            <Text variant="title">{item.plan.name}</Text>
                            <Text variant="small"><b>Ngày hiệu lực: </b>{moment(item.effective_at).format('DD-MM-YYYY HH:mm:ss')}</Text>
                            <Text variant="small"><b>Ngày hết hạn: </b>{moment(item.expires_at).format('DD-MM-YYYY HH:mm:ss')}</Text>
                            <View horizontal gap={4}>
                                <Tag variant={{ct: 'secondary'}} style={{gap: 8, color: theme.colors.idigo}}>
                                    <Icon icon={'mingcute:wallet-4-line'} style={{height: 16, width: 16, color: theme.colors.idigo}} />
                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}
                                </Tag>
                                <Tag variant={{ct: 'secondary'}} style={{gap: 8}}>
                                    <Icon icon={'mingcute:bank-card-line'} style={{height: 16, width: 16, color: theme.colors.foreground}} />
                                    {item.payment_method == 'card' ? 'Master/Visa' : 'Không rõ'}
                                </Tag>
                            </View>
                        </Card>
                    ))}
                </View>
            </InfiniteScroll>
        </View>
    );
}

function Plan() {
    const query = useUserProfileQuery();
    const navigate = useNavigate();
    const theme = useTheme();

    if (query.isLoading) {
        return <LoadingPage />;
    }

    return (
        <View gap={8} flex={1} animation="slideTopIn" style={{overflow: 'hidden'}}>
            <View horizontal gap={8} style={{alignItems: 'center'}}>
                <View style={{height: 100, width: 100}}>
                    <Icon icon={'mingcute:vip-1-fill'} style={{height: 100, width: 100, color: theme.colors.idigo}} />
                </View>
                <View gap={4}>
                    <Text variant="large-title">Gói</Text>
                    <Text variant="small" style={{color: theme.colors.tertiaryForeground}}>
                        {query.data.user.current_plan
                            ? <>Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi. Gói hiện tại của bạn có giá trị sử dụng đến <b>{moment(query.data.user.current_plan.expires_at).format('DD-MM-YYYY HH:mm:ss')}</b></>
                            : <>Bạn đã sẵn sàng bước chân vào cuộc hành trình mới đầy phấn khích với gói đăng ký độc đáo của chúng tôi?</>
                        }
                    </Text>
                </View>
            </View>
            { query.data.user.current_plan ? null
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
    );
}

export default Plan;
