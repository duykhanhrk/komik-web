import {ComicItem, Text, View} from "@components";
import {Comic, ComicService} from "@services";
import {useEffect, useMemo, useState} from "react";
import InfiniteScroll from "react-infinite-scroller";
import {useInfiniteQuery} from "react-query";
import {useSearchParams} from "react-router-dom";
import {useTheme} from "styled-components";
import ErrorPage from "../ErrorPage";
import LoadingPage from "../LoadingPage";

function ComicsList() {
  const theme = useTheme();

  const [searchParams] = useSearchParams();

  let paramable = searchParams.get('category_id');
  const _categoryId = paramable === null ? undefined : paramable;
  paramable = searchParams.get('sort_by');
  const _sortBy = paramable === null ? 'last_updated_chapter_at-desc' : paramable;
  paramable = searchParams.get('query');
  const _searchText = paramable === null ? undefined : paramable;

  const [categoryId, setCategoryId] = useState<string | undefined>();
  const [searchText, setSearchText] = useState<string | undefined>();
  const [sortBy, setSortBy] = useState<string | undefined>();

  useEffect(() => {
    setCategoryId(_categoryId);
    setSortBy(_sortBy);
    setSearchText(_searchText);
  }, [searchParams])

  const query = useInfiniteQuery({
    queryKey: ['comics', {categoryId, sortBy, searchText}],
    queryFn: ({ pageParam = 1 }) => ComicService.getAllAsync({page: pageParam, category_ids: categoryId, sort_by: sortBy, query: searchText}),
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
    }}/>
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
  )
}

export default ComicsList;
