import {Button, Card, ComicItem, Dropdown, Input, PreText, Tag, Text, TextArea, View} from "@components";
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

const evaluateOptions = [
  {label: 'Đồng ý', value: 1},
  {label: 'Không đồng ý', value: 2},
  {label: 'Sai phạm', value: 3}
]


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

  const evaluate = useMutation({
    mutationFn: ({review_id, point_of_view}: {review_id: number, point_of_view: number}) => ComicService.evaluateReviewAsync(comic_id, review_id, point_of_view),
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
    <View gap={8} style={{backgroundColor: 'transparent'}}>
      <Modal
        isOpen={modalMode !== 'close'}
        onRequestClose={() => setModalMode('close')}
        style={customStyles}
      >
        {modalMode === 'loading' ?
          <LoadingPage />
        :
        <View gap={8} style={{width: 520}}>
          <View horizontal gap={8} style={{alignItems: 'center'}} animation="slideBottomIn">
            <View style={{height: 120, width: 120}}>
              <Icon icon={'mingcute:comment-fill'} style={{height: 120, width: 120, color: theme.colors.yellow}} />
            </View>
            <View gap={4}>
              <Text variant="large-title">Đánh giá</Text>
              <Text variant="small" style={{color: theme.colors.tertiaryForeground}}>
                Hãy đánh giá truyện của bạn và truyền cảm hứng cho những người khác cùng thưởng thức và khám phá!
              </Text>
            </View>
          </View>
          <View gap={16} animation="slideLeftIn">
            <View gap={8}>
              <Input
                variant="tertiary"
                placeholder="Tiêu đề"
                value={review.title}
                style={{fontWeight: 'bold'}}
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
          </View>
          <View horizontal gap={8} animation="slideTopIn">
            {modalMode === 'update' &&
            <Button
              variant="tertiary"
              style={{gap: 8, flex: 1}}
              onClick={() => actCUDHelper(remove, noti, 'delete').then(() => setModalMode('close'))}
            >
              <Icon icon={'mingcute:delete-2-line'} style={{height: 20, width: 20, color: theme.colors.red}} />
              <Text style={{color: theme.colors.red}} variant="inhirit">Xóa</Text>
            </Button>
            }
            <Button
              variant="tertiary"
              style={{gap: 8, flex: 1}}
              onClick={() => {
                modalMode === 'create' ?
                  actCUDHelper(create, noti, 'create').then(() => setModalMode('close'))
                :
                  actCUDHelper(update, noti, 'update').then(() => setModalMode('close'))
              }}
            >
              <Icon icon={'mingcute:save-line'} style={{height: 20, width: 20, color: theme.colors.blue}} />
              <Text style={{color: theme.colors.blue}} variant="inhirit">{modalMode === 'create' ? 'Tạo' : 'Cập nhật'}</Text>
            </Button>
            <Button variant="tertiary" style={{gap: 8, flex: 1}} onClick={() => setModalMode('close')}>
              <Icon icon={'mingcute:close-line'} style={{height: 20, width: 20, color: theme.colors.foreground}} />
              <Text>Đóng</Text>
            </Button>
          </View>
        </View>
        }
      </Modal>
      <View horizontal style={{justifyContent: 'center'}}>
        <Text variant="large-title" style={{flex: 1}}>Đánh giá</Text>
        <Card ebonsaiSnippet>
          <Button
            variant="secondary"
            square
            ebonsai
            onClick={() => {
              fetchUserReview();
            }}
          >
            <Icon icon="mingcute:pencil-2-line" height={24} width={24} style={{color: 'inhirit'}} />
          </Button>
        </Card>
      </View>
      <View gap={8} style={{maxHeight: 640, overflowY: 'auto', overflowX: 'hidden'}} scrollable>
        {reviews?.length !== 0 ?
        <InfiniteScroll
          loadMore={() => {}}
          hasMore={false}
          loader={<Text>Loading...</Text>}
        >
          <View gap={8}>
            {reviews?.map((item: Review) => (
              <View horizontal gap={8} animation="slideLeftIn">
                <Card ebonsaiSnippet>
                  <img src={item?.user?.avatar_url} style={{height: 36, width: 36, borderRadius: 8}} />
                </Card>
                <Card flex={1} variant="secondary" shadowEffect>
                  <View flex={1} gap={8}>
                    <Text variant="title">{item?.title}</Text>
                    <PreText>{item?.content}</PreText>
                    <View horizontal gap={8}>
                      <View horizontal flex={1} gap={4} style={{justifyContent: 'flex-start', alignItems: 'flex-end'}}>
                        <Tag
                          variant={{ct: "secondary"}}
                          style={{gap: 8, width: 60}}
                          onClick={() => {
                            actCUDHelper(evaluate, noti, 'update', {review_id: item?.id, point_of_view: 1});
                          }}
                        >
                          <Icon icon={'mingcute:thumb-up-line'} style={{height: 16, width: 16, color: theme.colors.green}} />
                          {item.agreement_count || 0}
                        </Tag>
                        <Tag
                          variant={{ct: "secondary"}}
                          style={{gap: 8, width: 60}}
                          onClick={() => {
                            actCUDHelper(evaluate, noti, 'update', {review_id: item?.id, point_of_view: 2});
                          }}
                        >
                          <Icon icon={'mingcute:thumb-down-line'} style={{height: 16, width: 16, color: theme.colors.blue}} />
                          {item.disagreement_count || 0}
                        </Tag>
                        <Tag
                          variant={{ct: "secondary"}}
                          style={{gap: 8, width: 60}}
                          onClick={() => {
                            actCUDHelper(evaluate, noti, 'update', {review_id: item?.id, point_of_view: 3});
                          }}
                        >
                          <Icon icon={'mingcute:warning-line'} style={{height: 16, width: 16, color: theme.colors.red}} />
                          {item.transgression_count || 0}
                        </Tag>
                        {item.point_of_view && [1, 2, 3].includes(item.point_of_view) ? 
                          <Tag variant={{ct: "tertiary"}} style={{gap: 8}}>
                            {
                              item.point_of_view === 1
                              ?<Icon icon={'mingcute:thumb-up-fill'} style={{height: 16, width: 16, color: theme.colors.green}} />
                              : item.point_of_view === 2
                              ? <Icon icon={'mingcute:thumb-down-fill'} style={{height: 16, width: 16, color: theme.colors.blue}} />
                              : <Icon icon={'mingcute:warning-fill'} style={{height: 16, width: 16, color: theme.colors.red}} />
                            }
                            {
                              item.point_of_view === 1
                              ? <Text style={{color: theme.colors.green}}>Đồng ý</Text>
                              : item.point_of_view === 2
                              ? <Text style={{color: theme.colors.blue}}>Không đồng ý</Text> 
                              : <Text style={{color: theme.colors.red}}>Vi phạm</Text>
                            }
                          </Tag>
                          :
                          null
                        }
                        <View flex={1}></View>
                        <Tag variant={{ct: "tertiary"}}>{ item?.user?.firstname !== '' || item.user.lastname !== '' ? item?.user?.lastname + ' ' + item?.user?.firstname : item?.user?.username}</Tag>
                        <Tag variant={{ct: "secondary"}}>{moment(item?.updated_at).format('DD-MM-YYYY HH:MM:ss')}</Tag>
                      </View>
                    </View>
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
    </View>
  )
}

export default ReviewsArea;
