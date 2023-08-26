import {Button, Card, ComicItem, Input, Page, Tag, Text, TextArea, View} from '@components';
import {Icon} from '@iconify/react';
import {Comic, ComicMNService} from '@services';
import {useEffect, useMemo, useState} from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import {useInfiniteQuery, useMutation, UseMutationResult} from 'react-query';
import {useNotifications} from 'reapop';
import {useTheme} from 'styled-components';
import LoadingPage from '../LoadingPage';
import ErrorPage from '../ErrorPage';
import {actCUDHelper} from '@helpers/CUDHelper';
import {useNavigate} from 'react-router';
import ComicModal from './ComicModal';

function ComicMNPage() {
    const [searchText, setSearchText] = useState<string>('');
    const [modalMode, setModalMode] = useState<'create' | 'update' | 'close'>('close');

    const theme = useTheme();
    const noti = useNotifications();
    const navigate = useNavigate();

    const query = useInfiniteQuery({
        queryKey: ['admin', 'comics'],
        queryFn: ({ pageParam = 1 }) => ComicMNService.getAllAsync({page: pageParam, query: searchText}),
        getNextPageParam: (lastPage) => {
            if (lastPage.paginate.page >= lastPage.paginate.total_pages) {
                return null;
            }

            return lastPage.paginate.page + 1;
        }
    });

    useEffect(() => {
        query.refetch();
    }, [searchText]);

    const comics = useMemo(() => query.data?.pages.flatMap(page => page.comics), [query.data]);

    if (query.isLoading) {
        return <LoadingPage />;
    }

    if (query.isError) {
        return <ErrorPage onButtonClick={query.refetch} />;
    }

    return (
        <Page.Container>
            <ComicModal mode={modalMode} query={query} onModeChange={(value) => setModalMode(value)} />
            <Page.Content gap={0}>
                <View style={{position: 'sticky', top: 0, marginTop: -8, paddingTop: 8, paddingBottom: 8, backgroundColor: theme.colors.background}} horizontal>
                    <View horizontal flex={1}>
                        <Button
                            variant="secondary"
                            style={{width: 120}}
                            shadowEffect
                            onClick={() => {
                                setModalMode('create');
                            }}
                        >
                            <Icon icon={'mingcute:add-line'} style={{height: 20, width: 20, color: 'inhirit'}} />
                            <Text variant="inhirit" style={{marginLeft: 8}}>Thêm</Text>
                        </Button>
                    </View>
                    <View horizontal>
                        <Input
                            shadowEffect
                            placeholder="Tìm kiếm"
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                        />
                    </View>
                </View>
                <InfiniteScroll
                    pageStart={0}
                    loadMore={() => query.fetchNextPage()}
                    hasMore={query.hasNextPage}
                    loader={<Text>Loading...</Text>}
                    useWindow={false}
                    getScrollParent={() => document.getElementById('rootScrollable')}
                >
                    <View gap={8} wrap style={{justifyContent: 'center'}}>
                        {comics?.map((item: Comic, index: number) => (
                            <Card
                                horizontal
                                shadowEffect
                                key={item.id!.toString()}
                                onClick={() => navigate(`/admin/comics/${item.id}`)}
                                animation={'slideLeftIn'}
                            >
                                <View flex={1} style={{justifyContent: 'center'}}>
                                    <View horizontal gap={8}>
                                        <ComicItem.Image src={item.image_url} style={{borderRadius: 8}} />
                                        <View flex={1} gap={4}>
                                            <View horizontal gap={8} style={{alignItems: 'center'}}>
                                                <Text numberOfLines={1} variant="medium-title">{item.name}</Text>
                                                {!item.active &&
                          <Tag style={{gap: 8}}>
                              <Icon icon={'mingcute:eye-close-line'} style={{height: 16, width: 16, color: theme.colors.foreground}} />
                            Đang ẩn
                          </Tag>
                                                }
                                                {item.up_coming &&
                          <Tag style={{gap: 8}}>
                              <Icon icon={'mingcute:alarm-2-line'} style={{height: 16, width: 16, color: theme.colors.foreground}} />
                            Sắp ra mắt
                          </Tag>
                                                }
                                            </View>
                                            <View horizontal>
                                                <Tag numberOfLines={1}>{item.other_names}</Tag>
                                            </View>
                                            <View horizontal>
                                                <Tag>{item.status === 'finished' ? 'Hoàn thành' : 'Đang tiến hành'}</Tag>
                                            </View>
                                            <View horizontal gap={4}>
                                                <Tag style={{gap: 8}}>
                                                    <Icon icon={'mingcute:heart-line'} style={{height: 16, width: 16, color: theme.colors.red}} />
                                                    {item.favorites}
                                                </Tag>
                                                <Tag style={{gap: 8}}>
                                                    <Icon icon={'mingcute:eye-2-line'} style={{height: 16, width: 16, color: theme.colors.green}} />
                                                    {item.views}
                                                </Tag>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </Card>
                        ))}
                    </View>
                </InfiniteScroll>
            </Page.Content>
        </Page.Container>
    );
}

export default ComicMNPage;
