import {Button, Card, Input, Tag, Text, View} from '@components';
import {useTheme} from 'styled-components';
import {useInfiniteQuery} from 'react-query';
import {Chapter, ComicMNService} from '@services';
import {useEffect, useMemo, useState} from 'react';
import LoadingPage from '../LoadingPage';
import ErrorPage from '../ErrorPage';
import {Icon} from '@iconify/react';
import InfiniteScroll from 'react-infinite-scroller';
import ChapterImagesModal from './ChapterImagesModal';
import ChapterInfoModal from './ChapterInfoModal';

function ChaptersSection({comic_id}: {comic_id: number}) {
  const [searchText, setSearchText] = useState<string>('');
  const [modalMode, setModalMode] = useState<'create' | 'update' | 'images' | 'close'>('close');
  const [selectedItem, setSelectedItem] = useState<Chapter>({name: '', free: false});

  const theme = useTheme();

  const query = useInfiniteQuery({
    queryKey: ['admin', comic_id , 'chapters'],
    queryFn: ({ pageParam = 1 }) => ComicMNService.getAllChaptersAsync(comic_id, {page: pageParam, query: searchText}),
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

  const chapters = useMemo(() => query.data?.pages.flatMap(page => page.data), [query.data]);

  if (query.isLoading) {
    return <LoadingPage />;
  }

  if (query.isError) {
    return <ErrorPage error={query.error} />;
  }

  return (
    <View gap={8}>
      <ChapterImagesModal
        _data={selectedItem.image_urls}
        comic_id={comic_id}
        chapter_id={selectedItem.id!}
        open={modalMode === 'images'}
        onOpenChange={(open) => setModalMode(open ? 'images' : 'close')}
        onSaveSuccess={() => query.refetch()}
      />

      <ChapterInfoModal
        _data={selectedItem}
        mode={modalMode === 'create' ? 'create' : modalMode === 'update' ? 'update' : 'close'}
        onModeChange={(mode) => setModalMode(mode)}
        comic_id={comic_id}
        onSaveSuccess={() => query.refetch()}
      />

      <View horizontal>
        <View horizontal flex={1}>
          <Button
            variant="secondary"
            style={{width: 120}}
            onClick={() => {
              setSelectedItem({name: '', free: true});
              setModalMode('create');
            }}
          >
            <Icon icon={'mingcute:add-line'} style={{height: 20, width: 20, color: theme.colors.foreground}} />
            <Text style={{marginLeft: 8, color: theme.colors.foreground}}>Thêm</Text>
          </Button>
        </View>
        <View horizontal>
          <Input
            variant="secondary"
            placeholder="Tìm kiếm"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </View>
      </View>
      <View gap={8} style={{height: 640}} scrollable animation="slideLeftIn">
        {chapters?.length !== 0 ?
          <InfiniteScroll
            pageStart={0}
            loadMore={() => query.fetchNextPage()}
            hasMore={query.hasNextPage}
            loader={<Text>Loading...</Text>}
            useWindow={false}
          >
            <View gap={8} wrap style={{justifyContent: 'center'}}>
              {chapters?.map((item: Chapter) => (
                <Card
                  key={item.id}
                  variant="secondary"
                  horizontal
                >
                  <View flex={1} style={{justifyContent: 'center'}}>
                    <Text variant="title">{item.name}</Text>
                  </View>
                  <View horizontal gap={8}>
                    <Tag
                      variant={{ct: 'tertiary'}}
                      style={{gap: 8}}
                      onClick={() => {
                        setSelectedItem(item);
                        setModalMode('images');
                      }}
                    >
                      <Icon icon={'mingcute:pic-2-line'} style={{height: 16, width: 16, color: theme.colors.foreground}} />
                      <Text>{item.image_urls ? item.image_urls.length : 0}</Text>
                    </Tag>
                    <Tag
                      variant={{ct: 'secondary'}}
                      style={{width: 40}}
                      onClick={() => {
                        setSelectedItem(item);
                        setModalMode('update');
                      }}
                    >
                      <Icon icon={'mingcute:edit-line'} style={{height: 16, width: 16, color: theme.colors.foreground}} />
                    </Tag>
                  </View>
                </Card>
              ))}
            </View>
          </InfiniteScroll>
          :
          <View flex={1} centerContent>
            <Text variant="large-title" style={{color: theme.colors.quinaryForeground}}>Không có chương nào</Text>
          </View>
        }
      </View>
    </View>
  );
}

export default ChaptersSection;
