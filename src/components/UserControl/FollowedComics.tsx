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

function FollowedComics() {
  const theme = useTheme();

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

  const comics = useMemo(() => query.data?.pages.flatMap(page => page.data), [query.data]);

  if (query.isLoading) {
    return <LoadingPage />;
  }

  return (
    <View gap={8} style={{overflow: 'hidden'}} animation="slideTopIn">
      <View horizontal gap={8} style={{alignItems: 'center'}}>
        <View style={{height: 100, width: 100}}>
          <Icon icon={'mingcute:book-5-fill'} style={{height: 100, width: 100, color: theme.colors.blue}} />
        </View>
        <View gap={4}>
          <Text variant="large-title">Theo dõi</Text>
          <Text variant="small" style={{color: theme.colors.tertiaryForeground}}>
            Bạn có muốn không bỏ lỡ bất kỳ chương mới nào của truyện yêu thích không?
          </Text>
        </View>
      </View>
      <View scrollable gap={8} style={{padding: 2}}>
        {comics?.length === 0
          ?
          null
          :
          <InfiniteScroll
            loadMore={() => query.fetchNextPage()}
            hasMore={query.hasNextPage}
            loader={<Text>Loading...</Text>}
          >
            <View gap={4} style={{alignContent: 'flex-start'}}>
              {comics?.map((item: Comic) => <ComicItem.Horizontal key={item.id} _data={item} variant={'tertiary'} _size="small" style={{flex: 1, margin: 0}}/>)}
            </View>
          </InfiniteScroll>
        }
      </View>
    </View>
  );
}

export default FollowedComics;
