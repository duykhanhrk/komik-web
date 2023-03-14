import {ComicItem} from "@components";
import {LoadingPage} from "@pages";
import {Comic, ComicService} from "@services";
import {useMemo} from "react";
import InfiniteScroll from "react-infinite-scroller";
import {useInfiniteQuery} from "react-query";
import Text from "../Text";
import View from "../View";

function FollowedComics() {
  const query = useInfiniteQuery({
    queryKey: ['user', 'comis', 'followed'],
    queryFn: ({ pageParam = 1 }) => ComicService.getFollowedAsync({page: pageParam}),
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

  return (
    <View scrollable>
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

export default FollowedComics;
