import {Button, Card, Input, Page, Text, TextArea, View} from "@components"
import {Icon} from "@iconify/react";
import {Plan, PlanMNService} from "@services";
import {useEffect, useMemo, useState} from "react";
import InfiniteScroll from "react-infinite-scroller";
import {useInfiniteQuery, useMutation, UseMutationResult} from "react-query";
import {useNotifications} from "reapop";
import { useTheme } from "styled-components";
import Modal from 'react-modal';
import LoadingPage from "../LoadingPage";
import ErrorPage from "../ErrorPage";
import { actCUDHelper, deleteConfirmHelper } from "@helpers/CUDHelper";
import PurchasesArea from "./PurchasesArea";

function PlanMNPage() {
  const [searchText, setSearchText] = useState<string>('');
  const [selectedItem, setSelectedItem] = useState<Plan | undefined>();
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
    queryKey: ['admin', 'plans'],
    queryFn: ({ pageParam = 1 }) => PlanMNService.getAllAsync({page: pageParam, query: searchText}),
    getNextPageParam: (lastPage) => {
      if (lastPage.paginate.page >= lastPage.paginate.total_pages) {
        return null;
      }

      return lastPage.paginate.page + 1;
    }
  });

  const create: UseMutationResult = useMutation({
    mutationFn: () => PlanMNService.createAsync(selectedItem!),
    onSettled: query.refetch
  })

  const update = useMutation({
    mutationFn: () => PlanMNService.updateAsync(selectedItem!),
    onSettled: query.refetch
  });

  const remove = useMutation({
    mutationFn: (id: number) => PlanMNService.deleteAsync(id),
    onSettled: query.refetch
  });

  useEffect(() => {
    query.refetch();
  }, [searchText])

  const plans = useMemo(() => query.data?.pages.flatMap(page => page.plans), [query.data]);

  if (query.isLoading) {
    return <LoadingPage />
  }

  if (query.isError) {
    return <ErrorPage onButtonClick={query.refetch} />
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
            <Text variant="title">Giá</Text>
            <Input
              type={'number'}
              variant="tertiary"
              placeholder="Giá"
              value={selectedItem?.price}
              onChange={(e) => selectedItem && setSelectedItem({...selectedItem, price: parseInt(e.target.value)})}
            />
          </View>
          <View gap={8}>
            <Text variant="title">Thời gian</Text>
            <Input
              type={'number'}
              variant="tertiary"
              placeholder="Thời gian"
              value={selectedItem?.value}
              onChange={(e) => selectedItem && setSelectedItem({...selectedItem, value: parseInt(e.target.value)})}
            />
          </View>
          <View gap={8}>
            <Text variant="title">Mô tả</Text>
            <TextArea
              variant="tertiary"
              placeholder="Mô tả"
              rows={6}
              cols={40}
              value={selectedItem?.description}
              onChange={(e) => selectedItem && setSelectedItem({...selectedItem, description: e.target.value})}
            />
          </View>
          <View horizontal gap={8}>
            {modalMode === 'update' &&
            <Button
              variant="primary"
              style={{gap: 8, flex: 1}}
              onClick={() => {
                deleteConfirmHelper({
                  noti,
                  onConfirm: async () => {
                    actCUDHelper(remove, noti, 'delete', selectedItem?.id).then(() => setModalMode('close'))
                  }
                })
              }}
            >
              <Icon icon={'mingcute:delete-2-line'} style={{height: 20, width: 20, color: theme.colors.themeForeground}} />
              <Text variant="inhirit">Xóa</Text>
            </Button>}
            <Button
              variant="primary"
              style={{gap: 8, flex: 1}}
              onClick={() => {
                modalMode === 'create' ?
                  actCUDHelper(create, noti, 'create').then(() => setModalMode('close'))
                :
                  actCUDHelper(update, noti, 'update').then(() => setModalMode('close'))
              }}
            >
              <Icon icon={'mingcute:save-line'} style={{height: 20, width: 20, color: theme.colors.themeForeground}} />
              <Text variant="inhirit">{modalMode === 'create' ? 'Tạo' : 'Cập nhật'}</Text>
            </Button>
            <Button variant="tertiary" style={{gap: 8, flex: 1}} onClick={() => setModalMode('close')}>
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
                setSelectedItem({id: 0, name: '', description: '', price: 0, value: 0});
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
            {plans?.map((item: Plan, index: number) => (
              <Card
                horizontal
                shadowEffect
                animation={"slideLeftIn"}
                style={{height: 40}}
                onClick={() => {
                  setSelectedItem(item);
                  setModalMode('update');
                }}
              >
                <View flex={1} style={{justifyContent: 'center'}}>
                  <Text variant="title">{item.name}</Text>
                </View>
              </Card>
            ))}
          </View>
        </InfiniteScroll>
        <PurchasesArea />
      </Page.Content>
    </Page.Container>
  )
}

export default PlanMNPage;
