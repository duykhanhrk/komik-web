import {Button, Card, ComicItem, Input, PreText, Tag, Text, TextArea, View} from "@components";
import {ComicService} from "@services";
import {useMemo, useState} from "react";
import InfiniteScroll from "react-infinite-scroller";
import {useInfiniteQuery, useMutation} from "react-query";
import {useParams} from "react-router";
import {Review} from "@services";
import {useTheme} from "styled-components";
import moment from "moment";
import {Icon} from "@iconify/react";
import Modal from 'react-modal';
import { UseMutationResult } from "react-query";
import {useNotifications} from "reapop";
import { actCUDHelper } from "@helpers/CUDHelper";
import LoadingPage from "../LoadingPage";

function ReviewsArea() {
  const [modalMode, setModalMode] = useState<'create' | 'update' | 'loading' | 'close'>('close');
  const [review, setReview] = useState<Review>({title: '', content: ''});

  const theme = useTheme();
  const noti = useNotifications();
  const params = useParams();
  const comic_id = parseInt(params.comic_id!);

  const query = useInfiniteQuery({
    queryKey: ['app', 'comic', comic_id, 'reviews'],
    queryFn: ({ pageParam = 1 }) => ComicService.getReviewsAsync(comic_id, {page: pageParam}),
    getNextPageParam: (lastPage) => {
      if (lastPage.paginate.page >= lastPage.paginate.total_pages) {
        return null;
      }

      return lastPage.paginate.page + 1;
    }
  });

  const fetchUserReview = () => {
    setModalMode('loading');
    ComicService.getUserReviewAsync(comic_id)
      .then((data) => {
        if (data) {
          setReview(data.review);
          setModalMode('update');
        } else {
          setReview({title: '', content: ''});
          setModalMode('create');
        }
      })
      .catch((err) => {
        alert(err.message)
        setModalMode('close');
      });
  }

  const create: UseMutationResult = useMutation({
    mutationFn: () => ComicService.createReviewAsync(comic_id, review),
    onSettled: query.refetch
  });

  const update: UseMutationResult = useMutation({
    mutationFn: () => ComicService.updateReviewAsync(comic_id, review),
    onSettled: query.refetch
  });

  const remove: UseMutationResult = useMutation({
    mutationFn: () => ComicService.deleteReviewAsync(comic_id, review.id!),
    onSettled: query.refetch
  });

  const reviews = useMemo(() => query.data?.pages.flatMap(page => page.reviews), [query.data]);

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
              value={review.title}
              onChange={(e) => setReview({...review, title: e.target.value})}
            />
          </View>
          <View gap={8}>
            <TextArea
              variant="tertiary"
              placeholder="Nội dung"
              rows={12}
              cols={40}
              value={review.content}
              onChange={(e) => setReview({...review, content: e.target.value})}
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
            fetchUserReview();
          }}
        >
          <Icon icon="mingcute:pencil-2-line" height={24} width={24} style={{color: 'inhirit'}} />
        </Button>
      </View>
      <View gap={8} style={{height: 640, overflow: 'auto'}} scrollable>
        {reviews?.length !== 0 ?
        <InfiniteScroll
          loadMore={() => {}}
          hasMore={false}
          loader={<Text>Loading...</Text>}
        >
          <View gap={8}>
            {reviews?.map((item: Review) => (
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

export default ReviewsArea;
