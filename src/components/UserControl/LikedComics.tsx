import {ComicItem} from '@components';
import {Icon} from '@iconify/react';
import {LoadingPage} from '@pages';
import {Comic, ComicService} from '@services';
import {useMemo} from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import {useInfiniteQuery} from 'react-query';
import {useTheme} from 'styled-components';
import Text from '../Text';
import View from '../View';

function LikedComics() {
  const theme = useTheme();
  const query = useInfiniteQuery({
    queryKey: ['user', 'comis', 'favorited'],
    queryFn: ({ pageParam = 1 }) => ComicService.getFavoritedAsync({page: pageParam}),
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

  const comics = useMemo(() => query.data?.pages.flatMap(page => page.data), [query.data]);

  if (query.isLoading) {
    return <LoadingPage />;
  }

  return (
    <View gap={8} style={{overflow: 'hidden'}} animation="slideTopIn">
      <View horizontal gap={8} style={{alignItems: 'center'}}>
        <View style={{height: 100, width: 100}}>
          <Icon icon={'mingcute:heart-fill'} style={{height: 100, width: 100, color: theme.colors.red}} />
        </View>
        <View gap={4}>
          <Text variant="large-title">Yêu thích</Text>
          <Text variant="small" style={{color: theme.colors.tertiaryForeground}}>
            Bạn có những câu chuyện yêu thích mà muốn lưu giữ mãi mãi và dễ dàng tiếp cận mỗi khi muốn?
          </Text>
        </View>
      </View>
      <View scrollable gap={8} style={{padding: 2}}>
        {comics?.length === 0 ?
          null
          :
          <InfiniteScroll
            loadMore={() => query.fetchNextPage()}
            hasMore={query.hasNextPage}
            loader={<Text>Loading...</Text>}
          >
            <View gap={4} style={{alignContent: 'flex-start'}}>
              {comics?.map((item: Comic) => <ComicItem.Horizontal key={item.id} _data={item} variant="tertiary" _size="small" style={{flex: 1, margin: 0}}/>)}
            </View>
          </InfiniteScroll>
        }
      </View>
    </View>
  );
}

export default LikedComics;
