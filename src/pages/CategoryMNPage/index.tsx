import {Button, Card, Input, Page, Text, TextArea, View} from '@components';
import {Icon} from '@iconify/react';
import {Category, CategoryMNService} from '@services';
import {useEffect, useMemo, useState} from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import {useInfiniteQuery, useMutation} from 'react-query';
import {useNotifications} from 'reapop';
import {useTheme} from 'styled-components';
import Modal from 'react-modal';
import LoadingPage from '../LoadingPage';
import ErrorPage from '../ErrorPage';
import {actCUDHelper, deleteConfirmHelper} from '@helpers/CUDHelper';

function CategoryMNPage() {
  const [searchText, setSearchText] = useState<string>('');
  const [selectedItem, setSelectedItem] = useState<Category | undefined>();
  const [modalMode, setModalMode] = useState<'create' | 'update' | 'close'>('close');

  const theme = useTheme();
  const noti = useNotifications();

  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      border: `0 solid ${theme.colors.secondaryBackground}`,
      borderRadius: 8,
      padding: 16,
      backgroundColor: theme.colors.secondaryBackground,
      overflow: 'hidden'
    },
    overlay: {
      backgroundColor: `${theme.colors.background}99`
    }
  };

  const query = useInfiniteQuery({
    queryKey: ['admin', 'categories'],
    queryFn: ({ pageParam = 1 }) => CategoryMNService.getAllAsync({page: pageParam, query: searchText}),
    getNextPageParam: (lastPage) => {
      if (lastPage.paginate.page >= lastPage.paginate.total_pages) {
        return null;
      }

      return lastPage.paginate.page + 1;
    }
  });

  const create = useMutation({
    mutationFn: () => CategoryMNService.createAsync(selectedItem!),
    onSettled: () => query.refetch()
  });

  const update = useMutation({
    mutationFn: () => CategoryMNService.updateAsync(selectedItem!),
    onSettled: () => query.refetch()
  });

  const remove = useMutation({
    mutationFn: (id: number) => CategoryMNService.deleteAsync(id),
    onSettled: () => query.refetch()
  });

  useEffect(() => {
    query.refetch();
  }, [searchText]);

  const categories = useMemo(() => query.data?.pages.flatMap(page => page.data), [query.data]);

  if (query.isLoading) {
    return <LoadingPage />;
  }

  if (query.isError) {
    return <ErrorPage onButtonClick={query.refetch} />;
  }

  return (
    <Page.Container>
      <Modal
        isOpen={modalMode !== 'close'}
        onRequestClose={() => setModalMode('close')}
        style={customStyles}
      >
        <View gap={16} animation="slideTopIn">
          <View gap={8}>
            <Text variant="title">Tên</Text>
            <Input
              variant="tertiary"
              placeholder="Tên"
              value={selectedItem?.name}
              onChange={(e) => selectedItem && setSelectedItem({...selectedItem, name: e.target.value})}
            />
          </View>
          <View gap={8}>
            <Text variant="title">Mô tả</Text>
            <TextArea
              variant="tertiary"
              placeholder="Mô tả"
              rows={12}
              cols={40}
              value={selectedItem?.description}
              onChange={(e) => selectedItem && setSelectedItem({...selectedItem, description: e.target.value})}
            />
          </View>
          <View horizontal gap={8}>
            {modalMode === 'update' &&
            <Button
              variant="delete"
              style={{gap: 8, flex: 1}}
              onClick={() => {
                deleteConfirmHelper({
                  noti,
                  onConfirm: async () => {
                    actCUDHelper(remove, noti, 'delete', selectedItem?.id).then(() => setModalMode('close'));
                  }
                });
              }}
            >
              <Icon icon={'mingcute:delete-2-line'} style={{height: 20, width: 20}} />
              <Text variant="inhirit">Xóa</Text>
            </Button>}
            <Button
              variant="create"
              style={{gap: 8, flex: 1}}
              onClick={() => {
                modalMode === 'create' ?
                  actCUDHelper(create, noti, 'create').then(() => setModalMode('close'))
                  :
                  actCUDHelper(update, noti, 'update').then(() => setModalMode('close'));
              }}
            >
              <Icon icon={'mingcute:save-line'} style={{height: 20, width: 20}} />
              <Text variant="inhirit">{modalMode === 'create' ? 'Tạo' : 'Cập nhật'}</Text>
            </Button>
            <Button variant="close" style={{gap: 8, flex: 1}} onClick={() => setModalMode('close')}>
              <Icon icon={'mingcute:close-line'} style={{height: 20, width: 20}} />
              <Text>Đóng</Text>
            </Button>
          </View>
        </View>
      </Modal>
      <Page.Content gap={0}>
        <View style={{position: 'sticky', top: 0, marginTop: -8, paddingTop: 8, paddingBottom: 8, backgroundColor: theme.colors.background}} horizontal>
          <View horizontal flex={1}>
            <Button
              shadowEffect
              style={{width: 120}}
              onClick={() => {
                setSelectedItem({id: 0, name: '', description: ''});
                setModalMode('create');
              }}
            >
              <Icon icon={'mingcute:add-line'} style={{height: 20, width: 20, color: theme.colors.foreground}} />
              <Text style={{marginLeft: 8, color: theme.colors.foreground}}>Thêm</Text>
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
            {categories?.map((item: Category) => (
              <Card
                key={item.id}
                horizontal
                shadowEffect
                onClick={() => {
                  setSelectedItem(item);
                  setModalMode('update');
                }}
                style={{height: 40, justifyContent: 'center'}}
                animation={'slideLeftIn'}
              >
                <View flex={1} style={{justifyContent: 'center'}}>
                  <Text variant="title">{item.name}</Text>
                </View>
              </Card>
            ))}
          </View>
        </InfiniteScroll>
      </Page.Content>
    </Page.Container>
  );
}

export default CategoryMNPage;
