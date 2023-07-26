import {Button, Card, Input, Page, PreText, Tag, Text, View} from "@components"
import {Icon} from "@iconify/react";
import {Author, AuthorMNService} from "@services";
import {useEffect, useMemo, useState} from "react";
import InfiniteScroll from "react-infinite-scroller";
import {useInfiniteQuery, useMutation, UseMutationResult} from "react-query";
import {useNotifications} from "reapop";
import styled, { useTheme } from "styled-components";
import Modal from 'react-modal';
import LoadingPage from "../LoadingPage";
import ErrorPage from "../ErrorPage";
import { actCUDHelper } from "@helpers/CUDHelper";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './style.scss';
import moment from "moment";
import { useNavigate } from "react-router";

const Avatar = styled.img`
  height: 40px;
  width: 40px;
  border-radius: 8px;
`;

function AuthorPage() {
  const [searchText, setSearchText] = useState<string>('');
  const [selectedItem, setSelectedItem] = useState<Author | undefined>();
  const [modalMode, setModalMode] = useState<'create' | 'update' | 'close'>('close');

  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState<boolean>(false);
  const [verfiyPassword, setVerifyPassword] = useState<string>('');

  const theme = useTheme();
  const noti = useNotifications();
  const navigate = useNavigate();

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
    queryKey: ['admin', 'authors'],
    queryFn: ({ pageParam = 1 }) => AuthorMNService.getAllAsync({page: pageParam, query: searchText}),
    getNextPageParam: (lastPage) => {
      if (lastPage.paginate.page >= lastPage.paginate.total_pages) {
        return null;
      }

      return lastPage.paginate.page + 1;
    }
  });

  const create: UseMutationResult = useMutation({
    mutationFn: () => AuthorMNService.createAsync(selectedItem!),
    onSettled: query.refetch
  })

  const update = useMutation({
    mutationFn: () => AuthorMNService.updateAsync(selectedItem!),
    onSettled: query.refetch
  });

  useEffect(() => {query.refetch()}, [searchText])

  const authors = useMemo(() => query.data?.pages.flatMap(page => page.authors), [query.data]);

  if (query.isLoading) {
    return <LoadingPage />
  }

  if (query.isError) {
    return <ErrorPage onButtonClick={query.refetch} />
  }

  return (
    <Page.Container>
      <Modal
        isOpen={modalMode !== 'close' && !isVerifyModalOpen}
        onRequestClose={() => setModalMode('close')}
        style={customStyles}
      >
        <View gap={16} animation="slideTopIn">
          <View gap={16}>
            <View gap={16} horizontal>
              <View gap={8}>
                <Text variant="title">Tên</Text>
                <Input
                  variant="tertiary"
                  placeholder="Họ"
                  value={selectedItem?.lastname}
                  onChange={(e) => selectedItem && setSelectedItem({...selectedItem, lastname: e.target.value})}
                />
              </View>
              <View gap={8}>
                <Text variant="title">Họ</Text>
                <Input
                  variant="tertiary"
                  placeholder="Tên"
                  value={selectedItem?.firstname}
                  onChange={(e) => selectedItem && setSelectedItem({...selectedItem, firstname: e.target.value})}
                />
              </View>
            </View>
            <View gap={16} horizontal>
              <View gap={8}>
                <Text variant="title">Sinh nhật</Text>
                <Input
                  variant="tertiary"
                  placeholder="Sinh nhật"
                  type="date"
                  value={moment(selectedItem?.birthday).format('YYYY-MM-DD')}
                  onChange={(e) => selectedItem && setSelectedItem({...selectedItem, birthday: new Date(e.target.value)})}
                  style={{flex: 1}}
                />
              </View>
            </View>
          </View>
          <View horizontal gap={8}>
            <Button
              variant="primary"
              style={{flex: 1, gap: 8}}
              onClick={() => setIsVerifyModalOpen(true)}>
              <Icon icon={'mingcute:save-line'} style={{height: 20, width: 20, color: theme.colors.themeForeground}} />
              <Text variant="inhirit">{modalMode === 'create' ? 'Tạo' : 'Cập nhật'}</Text>
            </Button>
            <Button variant="tertiary" style={{flex: 1}} onClick={() => setModalMode('close')}>Đóng</Button>
          </View>
        </View>
      </Modal>
      <Modal
        isOpen={isVerifyModalOpen}
        onRequestClose={() => setIsVerifyModalOpen(false)}
        style={customStyles}
      >
        <View gap={16} animation="slideTopIn">
          <View gap={8}>
            <Text variant="title">Nhập mật khẩu để xác nhận</Text>
            <Input
              type="password"
              variant="tertiary"
              placeholder="Mật khẩu"
              value={verfiyPassword}
              onChange={(e) => setVerifyPassword(e.target.value)}
            />
          </View>
          <View horizontal gap={8}>
            <Button
              variant="primary"
              style={{flex: 1}}
              onClick={() => {
                modalMode === 'create' ?
                  actCUDHelper(create, noti, 'create').then(() => {
                    setIsVerifyModalOpen(false);
                    setVerifyPassword('');
                    setModalMode('close');
                  })
                :
                  actCUDHelper(update, noti, 'update').then(() => {
                    setIsVerifyModalOpen(false);
                    setVerifyPassword('');
                    setModalMode('close');
                  })
              }}
            >Xác nhận</Button>
            <Button variant="tertiary" style={{flex: 1}} onClick={() => {setIsVerifyModalOpen(false); setVerifyPassword('');}}>Hủy</Button>
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
                setSelectedItem({
                  firstname: '',
                  lastname: '',
                  introduction: '',
                  birthday: new Date()
                });
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
            {authors?.map((item: Author, index: number) => (
              <Card
                horizontal
                shadowEffect
                animation={index % 2 == 0 ? "slideLeftIn" : "slideRightIn"}
                onClick={() => {navigate(`/admin/authors/${item.id}`)}}
              >
                <View
                  horizontal
                  flex={1}
                  gap={8}
                  style={{alignItems: 'center'}}
                >
                  <Avatar src={item.image_url || theme.assets.defaultAvatar}/>
                  <View gap={4} style={{justifyContent: 'center'}}>
                    <Text variant="title">
                      {`${item.lastname} ${item.firstname}`}
                    </Text>
                  </View>
                </View>
                <View horizontal gap={8} style={{alignItems: 'center'}}>
                </View>
              </Card>
            ))}
          </View>
        </InfiniteScroll>
      </Page.Content>
    </Page.Container>
  )
}

export default AuthorPage;
