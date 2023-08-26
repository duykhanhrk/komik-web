import {ComicItem, Text, View} from '@components';
import {Comic, ComicService} from '@services';
import {useEffect, useMemo, useState} from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import {useInfiniteQuery} from 'react-query';
import {matchPath, useLocation, useSearchParams} from 'react-router-dom';
import {useTheme} from 'styled-components';
import ErrorPage from '../ErrorPage';
import LoadingPage from '../LoadingPage';

function ComicsList() {
    const theme = useTheme();

    const { pathname } = useLocation();

    const isStars = matchPath('/comics/stars/*', pathname) || matchPath('/comics', pathname);
    const isSearching = matchPath('/comics/searching/*', pathname);
    const isCategories = matchPath('/comics/categories/*', pathname);
    const isReleaseDates = matchPath('/comics/release_dates/*', pathname);
    const isFilters = matchPath('/comics/filter/*', pathname);


    const [params, setParams] = useState<{
    category_ids?: Array<number>,
    query?: string,
    release_dates?: Array<string>,
    sort_by?: string
  }>({});

    const [searchParams] = useSearchParams();

    let paramable = searchParams.get('category_ids');

    const _categoryId = paramable === null ? undefined : paramable;
    paramable = searchParams.get('sort_by');
    const _sortBy = paramable === null ? 'last_updated_chapter_at-desc' : paramable;
    paramable = searchParams.get('query');
    const _searchText = paramable === null || isCategories ? undefined : paramable;

    useEffect(() => {
        let paramable = searchParams.get('category_ids');
        const category_ids = paramable === null || paramable === '' ? undefined : paramable.split(',').map(item => parseInt(item)).sort((a, b) => a - b);

        paramable = searchParams.get('release_dates');
        const release_dates = paramable === null || paramable === '' ? undefined : paramable.split(',').map(item => item).sort((a, b) => new Date(a).getFullYear() - new Date(b).getFullYear());

        paramable = searchParams.get('sort_by');
        const sort_by = paramable === null ? 'last_updated_chapter_at-desc' : paramable;

        paramable = searchParams.get('query');
        const query = paramable === null ? undefined : paramable;

        setParams({
            category_ids,
            query,
            release_dates,
            sort_by
        });
    }, [searchParams]);

    const query = useInfiniteQuery({
        queryKey: ['comics', params],
        queryFn: ({ pageParam = 1 }) => ComicService.getAllAsync({
            page: pageParam,
            category_ids:
        isReleaseDates || isStars ? undefined
            : isCategories ? (params.category_ids && params.category_ids.length > 0 ? `${params.category_ids.at(0)}` : undefined)
                : (params.category_ids && params.category_ids.length > 0 ? params.category_ids.join(',') : undefined),
            query: isSearching || isFilters ? params.query : undefined,
            release_dates:
        isCategories || isStars ? undefined
            : isReleaseDates ? (params.release_dates && params.release_dates.length > 0 ? `${params.release_dates.at(0)}` : undefined)
                : (params.release_dates && params.release_dates.length > 0 ? params.release_dates?.join(',') : undefined)
        }),
        getNextPageParam: (lastPage) => {
            if (lastPage.paginate.page >= lastPage.paginate.total_pages) {
                return null;
            }

            return lastPage.paginate.page + 1;
        }
    });

    const comics = useMemo(() => query.data?.pages.flatMap(page => page.comics), [query.data]);

    if (query.isLoading) {
        return <LoadingPage />;
    }

    if (query.isError) {
        return <ErrorPage error={query.error} onButtonClick={() => {
            query.refetch();
        }}/>;
    }

    return (
        <View flex={1} style={{flexShrink: 1, paddingBottom: 8}}>
            {comics?.length !== 0 ?
                <InfiniteScroll
                    pageStart={0}
                    loadMore={() => query.fetchNextPage()}
                    hasMore={query.hasNextPage}
                    loader={<Text>Loading...</Text>}
                    useWindow={false}
                    getScrollParent={() => document.getElementById('rootScrollable')}
                >
                    <View gap={8} horizontal wrap style={{justifyContent: 'flex-start'}}>
                        {comics?.map((item: Comic) => <ComicItem.Vertical shadowEffect _data={item} animation="slideLeftIn"/>)}
                    </View>
                </InfiniteScroll>
                :
                <View flex={1} gap={8} centerContent>
                    <Text variant="large-title" style={{color: theme.colors.quinaryForeground}}>Không có nội dung</Text>
                </View>
            }
        </View>
    );
}

export default ComicsList;
