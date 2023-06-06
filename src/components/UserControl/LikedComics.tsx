import {ComicItem} from "@components";
import {LoadingPage} from "@pages";
import {Comic, ComicService} from "@services";
import {useMemo} from "react";
import InfiniteScroll from "react-infinite-scroller";
import {useInfiniteQuery} from "react-query";
import {useTheme} from "styled-components";
import Text from "../Text";
import View from "../View";

function LikedComics() {
  const theme = useTheme();
  const query = useInfiniteQuery({
    queryKey: ['user', 'comis', 'liked'],
    queryFn: ({ pageParam = 1 }) => ComicService.getLikedAsync({page: pageParam}),
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

  const comics = useMemo(() => query.data?.pages.flatMap(page => page.comics), [query.data]);

  if (query.isLoading) {
    return <LoadingPage />;
  }

  if (comics?.length === 0) {
    return (
      <View centerContent flex={1}>
        <Text style={{color: theme.colors.quinaryForeground}}>Không có nội dung</Text>
      </View>
    )
  }

  return (
    <View scrollable animation="slideTopIn">
      <InfiniteScroll
        loadMore={() => query.fetchNextPage()}
        hasMore={query.hasNextPage}
        loader={<Text>Loading...</Text>}
      >
        <View gap={4} style={{alignContent: 'flex-start'}}>
          {comics?.map((item: Comic) => <ComicItem.Horizontal _data={item} variant="tertiary" _size="small" style={{flex: 1, margin: 0}}/>)}
        </View>
      </InfiniteScroll>
    </View>
  )
}

export default LikedComics;
