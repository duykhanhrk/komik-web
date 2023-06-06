import {Button, Card, ComicItem, Input, PreText, Tag, Text, TextArea, View} from "@components";
import {ComicService} from "@services";
import {useMemo, useState} from "react";
import InfiniteScroll from "react-infinite-scroller";
import {useInfiniteQuery, useMutation} from "react-query";
import {useParams} from "react-router";
import { Comment } from "@services";
import {useTheme} from "styled-components";
import moment from "moment";
import {Icon} from "@iconify/react";
import Modal from 'react-modal';
import { UseMutationResult } from "react-query";
import {useNotifications} from "reapop";
import { actCUDHelper } from "@helpers/CUDHelper";
import LoadingPage from "../LoadingPage";

function CommentsArea() {
  const theme = useTheme();
  const { comic_id } = useParams();
  const [modalMode, setModalMode] = useState<'create' | 'update' | 'loading' | 'close'>('close');
  const [comment, setComment] = useState<Comment>({title: '', content: ''});
  const noti = useNotifications();

  const query = useInfiniteQuery({
    queryKey: ['app', 'comic', comic_id, 'comments'],
    queryFn: ({ pageParam = 1 }) => ComicService.getCommentsAsync(parseInt(comic_id || ''), {page: pageParam}),
    getNextPageParam: (lastPage) => {
      if (lastPage.paginate.page >= lastPage.paginate.total_pages) {
        return null;
      }

      return lastPage.paginate.page + 1;
    }
  });

  const fetchUserComment = () => {
    setModalMode('loading');
    ComicService.getUserCommentAsync(parseInt(comic_id || ''))
      .then((data) => {
        if (data) {
          setComment(data.comment);
          setModalMode('update');
        } else {
          setComment({title: '', content: ''});
          setModalMode('create');
        }
      })
      .catch((err) => {
        alert(err.message)
        setModalMode('close');
      });
  }

  const create: UseMutationResult = useMutation({
    mutationFn: () => ComicService.createCommentAsync(parseInt(comic_id || ''), comment),
    onSettled: query.refetch
  });

  const update: UseMutationResult = useMutation({
    mutationFn: () => ComicService.updateCommentAsync(parseInt(comic_id || ''), comment),
    onSettled: query.refetch
  });

  const remove: UseMutationResult = useMutation({
    mutationFn: () => ComicService.deleteCommentAsync(parseInt(comic_id || ''), comment.id!),
    onSettled: query.refetch
  });

  const comments = useMemo(() => query.data?.pages.flatMap(page => page.comments), [query.data]);

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

  return (
    <Card shadowEffect>
      <Modal
        isOpen={modalMode !== 'close'}
        onRequestClose={() => setModalMode('close')}
        style={customStyles}
      >
        {modalMode === 'loading' ?
          <LoadingPage />
        :
        <View gap={16} animation="slideTopIn">
          <View gap={8}>
            <Input
              variant="tertiary"
              placeholder="Tiêu đề"
              value={comment.title}
              onChange={(e) => setComment({...comment, title: e.target.value})}
            />
          </View>
          <View gap={8}>
            <TextArea
              variant="tertiary"
              placeholder="Nội dung"
              rows={12}
              cols={40}
              value={comment.content}
              onChange={(e) => setComment({...comment, content: e.target.value})}
            />
          </View>
          <View horizontal gap={8}>
            {modalMode === 'update' &&
            <Button
              variant="primary"
              style={{gap: 8, flex: 1}}
              onClick={() => actCUDHelper(remove, noti, 'delete').then(() => setModalMode('close'))}
            >
              <Icon icon={'mingcute:delete-2-line'} style={{height: 20, width: 20, color: theme.colors.themeForeground}} />
              <Text variant="inhirit">Xóa</Text>
            </Button>
            }
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
        }
      </Modal>
      <View horizontal>
        <Text variant="medium-title" style={{flex: 1}}>Đánh giá</Text>
        <Button
          variant="secondary"
          square
          onClick={() => {
            fetchUserComment();
          }}
        >
          <Icon icon="mingcute:pencil-2-line" height={24} width={24} style={{color: 'inhirit'}} />
        </Button>
      </View>
      <View gap={8} style={{height: 640, overflow: 'auto'}} scrollable>
        {comments?.length !== 0 ?
        <InfiniteScroll
          loadMore={() => {}}
          hasMore={false}
          loader={<Text>Loading...</Text>}
        >
          <View gap={8}>
            {comments?.map((item: Comment) => (
              <View horizontal gap={8} style={{alignItems: 'center'}}>
                <img src={item?.user?.avatar_url} style={{height: 40, width: 40, borderRadius: 20}} />
                <Card flex={1} variant="tertiary">
                  <View flex={1} gap={8}>
                    <View horizontal>
                      <Tag variant={{ct: "quaternary"}}>{ item?.user?.firstname !== '' || item.user.lastname !== '' ? item?.user?.lastname + ' ' + item?.user?.firstname : item?.user?.username}</Tag>
                      <View flex={1}></View>
                      <Tag>{moment(item?.updated_at).format('DD-MM-YYYY HH:MM:ss')}</Tag>
                    </View>
                    <Text variant="title">{item?.title}</Text>
                    <PreText>{item?.content}</PreText>
                  </View>
                </Card>
              </View>
            ))}
          </View>
        </InfiniteScroll>
        :
        <View flex={1} centerContent>
          <Text variant="medium-title" style={{color: theme.colors.quinaryForeground}}>Không tìm thấy đánh giá nào</Text>
        </View>
        }
      </View>
    </Card>
  )
}

export default CommentsArea;
