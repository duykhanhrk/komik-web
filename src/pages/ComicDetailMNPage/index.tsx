import {Button, Card, ComicItem, Input, Page, Tag, Text, TextArea, View} from "@components";
import {useTheme} from "styled-components";
import {useNavigate} from "react-router";
import {useNotifications} from "reapop";
import {useParams} from "react-router";
import {useInfiniteQuery, useMutation, useQuery, UseQueryResult} from "react-query";
import {Category, CategoryService, Chapter, Comic, ComicMNService} from "@services";
import {useEffect, useMemo, useRef, useState} from "react";
import AvatarEditor from "react-avatar-editor";
import {isAxiosError} from "axios";
import LoadingPage from "../LoadingPage";
import ErrorPage from "../ErrorPage";
import {actCUDHelper} from "@helpers/CUDHelper";
import {Icon} from "@iconify/react";
import InfiniteScroll from "react-infinite-scroller";
import Modal from 'react-modal';
import {updateLocale} from "moment";

function hexToRgb(hex: string): number[] | null {
  const regex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  const shortHex = hex.replace(regex, (_, r, g, b) => r + r + g + g + b + b);
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(shortHex);
  if (!result) {
    return null;
  }
  return [
    parseInt(result[1], 16),
    parseInt(result[2], 16),
    parseInt(result[3], 16),
  ];
}

function ImageSection({query}: {query: UseQueryResult<any, any>}) {
  const [image, setImage] = useState<File>();
  const [editorOpen, setEditorOpen] = useState<boolean>(false);

  const theme = useTheme();
  const fileInput = useRef<HTMLInputElement>(null);
  const editorRef = useRef<AvatarEditor>(null);

  const {notify} = useNotifications();
  
  useEffect(() => {
    if (query.data?.user) {
      fetch(query.data.comic.image_url)
        .then(response => response.arrayBuffer())
        .then(buffer => {
          const imageFile = new File([buffer], 'image.jpg', { type: 'image/jpeg' });
          setImage(imageFile);
      });
    }
  }, [query.data])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let _image = e.target.files?.[0] || null;
    if (!_image) return;
    setImage(_image);
    setEditorOpen(true);
  };
  

  const selectFile = () => {
    fileInput.current?.click();
  }

  return (
    <View gap={8}>
      {editorOpen ? 
        <View horizontal>
          <View gap={8}>
            <AvatarEditor
              ref={editorRef}
              image={image || ''}
              width={360}
              height={480}
              border={50}
              color={hexToRgb(theme.colors.background)?.concat([0.9])} // RGBA
              scale={1}
              rotate={0}
              style={{backgroundColor: theme.colors.background}}
            />
            <View horizontal gap={8}>
              <Button variant="tertiary" style={{flex: 1}} onClick={() => setEditorOpen(false)}>Hủy bỏ</Button>
              <Button
                variant="primary"
                onClick={() => {
                  if (editorRef.current) {
                    const canvas = editorRef.current.getImageScaledToCanvas();
                    canvas.toBlob((blob) => {
                      if (blob) {
                      const file = new File([blob], 'avatar.png', { type: 'image/png' });
                      const notification = notify({
                        title: 'Thực thi',
                        message: 'Đang tải cập nhật',
                        status: 'loading',
                        dismissible: false
                      });
                      ComicMNService.updateImageAsync(query.data.comic.id, file)
                        .then(() => {
                          query.refetch();
                          notification.title = 'Thành công'
                          notification.status = 'success';
                          notification.message = 'Cập nhật thành công';
                          notification.dismissible = true;
                          notification.dismissAfter = 3000;
                          notify(notification);
                        })
                        .catch((error) => {
                          if (isAxiosError(error) && error.response) {
                            notification.message = error.response.data.message;
                          } else {
                            notification.message = 'Có lỗi xảy ra, xin thử lại sau';
                          }

                          notification.title = 'Lỗi'
                          notification.status = 'error';
                          notification.dismissible = true;
                          notification.dismissAfter = 3000;

                          notify(notification);
                        });
                    }});
                    setEditorOpen(false);
                  }
                }}
                style={{flex: 1}}
              >Cập nhật</Button>
            </View>
          </View>
        </View>
        :
        <View horizontal>
          <View gap={8}>
            <input type="file" style={{ "display": "none" }} onChange={handleImageChange} ref={fileInput} />
            <ComicItem.Image style={{borderRadius: 8}} src={query.isSuccess ? query.data.comic.image_url : ''} />
            <Button variant="tertiary" onClick={selectFile}>Thay đổi</Button>
          </View>
        </View>
      }
    </View>
  )
}

function InfoSection({query}: {query: UseQueryResult<any, any>}) {
  const [comic, setComic] = useState<Comic | undefined>();

  const noti = useNotifications();

  const categoryQuery = useQuery({
    queryKey: ['categories'],
    queryFn: () => CategoryService.getAllAsync(),
  });

  useEffect(() => {
    if (query.data && query.data.comic) {
      setComic({...query.data.comic, category_ids: query.data.comic.categories.map((item: Comic) => item.id)});
    }
  }, [query.data]);

  const update = useMutation({
    mutationFn: () => ComicMNService.updateAsync(comic!),
    onSettled: query.refetch,
  })

  if (query.isLoading || categoryQuery.isLoading) {
    return <LoadingPage />
  }

  if (query.isError) {
    return <ErrorPage error={query.error} />
  }

  if (categoryQuery.isError) {
    return <ErrorPage error={categoryQuery.error} />
  }

  return (
    <View gap={8}>
      <View gap={8}>
        <View horizontal style={{alignItems: 'center'}}>
          <Text style={{width: 180}}>Tên</Text>
          <Input
            flex={1}
            variant="tertiary"
            type="text"
            value={comic?.name}
            placeholder="Họ"
            onChange={(e) => comic && setComic({...comic, name: e.target.value})}
          />
        </View>
        <View horizontal style={{alignItems: 'center'}}>
          <Text style={{width: 180}}>Tên khác</Text>
          <Input
            flex={1}
            variant="tertiary"
            type="text"
            value={comic?.other_names}
            placeholder="Tên"
            onChange={(e) => comic && setComic({...comic, other_names: e.target.value})}
          />
        </View>
        <View horizontal style={{alignItems: 'center'}}>
          <Text style={{width: 180}}>Tên tác giả</Text>
          <Input
            flex={1}
            variant="tertiary"
            type="text"
            value={comic?.author}
            placeholder="Tên"
            onChange={(e) => comic && setComic({...comic, author: e.target.value})}
          />
        </View>
        <View horizontal style={{alignItems: 'center'}}>
          <Text style={{width: 180}}>Trạng thái</Text>
          <Button
            variant="tertiary"
            style={{flex: 1}}
            onClick={() => comic && setComic({...comic, status: comic.status == 'finished' ? 'unfinished' : 'finished'})}
          >{comic?.status === 'finished' ? 'Đã hoàn thành' : 'Chưa hoàn thành'}</Button>
        </View>
        <View horizontal style={{alignItems: 'center'}}>
          <Text style={{width: 180}}>Mô tả</Text>
          <TextArea
            variant="tertiary"
            value={comic?.description}
            rows={12}
            placeholder="Mô tả"
            onChange={(e) => comic && setComic({...comic, description: e.target.value})}
            style={{flex: 1}}
          />
        </View>
        <View horizontal style={{alignItems: 'center'}}>
          <Text style={{width: 180}}>Thể loại</Text>
          <View flex={1} horizontal gap={4} wrap>
            {categoryQuery.data.categories.map((item: Category) => (
              <Tag
                variant={{ct: comic?.category_ids?.includes(item.id) ? 'primary' : 'tertiary'}}
                key={item.id}
                style={{width: 120}}
                onClick={() => comic && setComic({...comic, category_ids: !comic?.category_ids?.includes(item.id) ? comic?.category_ids?.concat([item.id]) : comic?.category_ids?.filter((id) => id !== item.id)})}
              >{item.name}</Tag>
            ))}
          </View>
        </View>
        <Button
          variant="primary"
          style={{marginLeft: 180}}
          onClick={() => actCUDHelper(update, noti, 'update')}
        >Cập nhật</Button>
      </View>
    </View>
  )
}

function ActionsSection({query}: {query: UseQueryResult<any, any>}) {
  const [comic, setComic] = useState<Comic | undefined>();

  const noti = useNotifications();
  const navigate = useNavigate();

  useEffect(() => {
    if (query.data && query.data.comic) {
      setComic(query.data.comic);
    }
  }, [query.data]);

  const update = useMutation({
    mutationFn: () => ComicMNService.activeAsync(comic?.id || 0, !comic?.active),
    onSettled: query.refetch
  })

  const remove = useMutation({
    mutationFn: () => ComicMNService.deleteAsync(comic?.id || 0)
  })

  if (query.isLoading) {
    return <LoadingPage />
  }

  if (query.isError) {
    return <ErrorPage error={query.error} />
  }

  return (
    <View gap={8}>
      <Button
        variant="primary"
        onClick={() => {
          actCUDHelper(update, noti, 'update');
        }}
        style={{gap: 8}}
      >
        <Icon icon={comic?.active ? 'mingcute:eye-close-line' : 'mingcute:eye-line'} style={{color: 'inhirit', height: 20, width: 20}}/>
        <Text variant="inhirit">{comic?.active ? 'Ẩn đi' : 'Công khai'}</Text>
      </Button>
      <Button
        variant="primary"
        onClick={() => {
          actCUDHelper(remove, noti, 'delete').then(() => navigate(-1));
        }}
        style={{gap: 8}}
      >
        <Icon icon={'mingcute:delete-2-line'} style={{color: 'inhirit', height: 20, width: 20}}/>
        <Text variant="inhirit">Xóa</Text>
      </Button>
    </View>
  )
}

function ChaptersSection({comic_id}: {comic_id: number}) {
  const [searchText, setSearchText] = useState<string>('');
  const [modalMode, setModalMode] = useState<'create' | 'update' | 'images' | 'close'>('close');
  const [selectedItem, setSelectedItem] = useState<Chapter>({name: '', free: false});
  const [insertAction, setInsertAction] = useState<{type: 'insert' | 'new' | 'replace', toIndex?: number}>({type: 'new', toIndex: 0})
  const [images, setImages] = useState<Array<File>>([]);

  const fileInput = useRef<HTMLInputElement>(null);

  const noti = useNotifications();
  const navigate = useNavigate();
  const theme = useTheme();

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
      backgroundColor: theme.colors.secondaryBackground
    },
    overlay: {
      backgroundColor: `${theme.colors.background}99`
    }
  };

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

  async function fetchImages(item: Chapter) {
    let imageFilesArray: Array<File> = [];
    if (item.image_urls) {
      for(let url of item.image_urls) {
        const res = await fetch(url);
        const buffer = await res.arrayBuffer();
        const file = new File([buffer], `image.jpg`, { type: 'image/jpeg' });
        imageFilesArray = imageFilesArray.concat([file]);
      }
    }
    console.log(images);
    setImages(imageFilesArray);
  }

  const create = useMutation({
    mutationFn: () => ComicMNService.createChapterAsync(comic_id, selectedItem!),
    onSettled: query.refetch
  })

  const update = useMutation({
    mutationFn: () => ComicMNService.updateChapterAsync(comic_id, selectedItem!),
    onSettled: query.refetch
  });

  const updateImages = useMutation({
    mutationFn: () => ComicMNService.updateChapterImagesAsync(comic_id, selectedItem.id || 0, images),
    onSettled: query.refetch
  });

  const remove = useMutation({
    mutationFn: (id: number) => ComicMNService.deleteChapterAsync(comic_id, id),
    onSettled: query.refetch
  });


  useEffect(() => {
    query.refetch();
  }, [searchText]);

  const chapters = useMemo(() => query.data?.pages.flatMap(page => page.chapters), [query.data]);

  if (query.isLoading) {
    return <LoadingPage />
  }

  if (query.isError) {
    return <ErrorPage error={query.error} />
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let file = e.target.files?.[0] || null;
    if (!file) return;
    if (insertAction.type === 'new') {
      setImages(images.concat([file]));
    } else if (insertAction.type === 'insert')  {
      images.splice(insertAction.toIndex || 0, 0, file);
      setImages(images);
    } else if (insertAction.type === 'replace') {
      images.splice(insertAction.toIndex || 0, 1, file);
      setImages(images);
    }
  };
  

  const selectFile = () => {
    fileInput.current?.click();
  }

  return (
    <View gap={8}>
      <Modal
        isOpen={modalMode === 'images'}
        onRequestClose={() => setModalMode('close')}
        style={customStyles}
      >
        <View gap={16}>
          <View gap={8}>
            <input type="file" style={{ "display": "none" }} onChange={handleImageChange} ref={fileInput} />
            <Button
              variant="tertiary"
              onClick={() => {
                setInsertAction({type: 'new'})
                selectFile();
              }}
            >Thêm</Button>
          </View>
          <View gap={8} horizontal wrap style={{width: 799, height: 784, borderRadius: 8, alignContent: 'flex-start'}} scrollable>
            {images && images.map((file, index) => (
              <Card variant="tertiary">
                <img src={URL.createObjectURL(file)} style={{width: 240, height: 240, borderRadius: 8}} />
                <Text>{index}</Text>
                <View horizontal gap={8}>
                  <Button
                    variant="quaternary"
                    style={{width: 40}}
                    onClick={() => {
                      setInsertAction({type: 'insert', toIndex: index})
                      selectFile();
                    }}
                  >
                    <Icon icon={'mingcute:add-line'} style={{height: 20, width: 20, color: theme.colors.foreground}} />
                  </Button>
                  <Card variant="quaternary" horizontal flex={1} style={{justifyContent: 'center', padding: 0, gap: 0}}>
                    <Button
                      variant="quaternary"
                      onClick={() => {
                        setInsertAction({type: 'replace', toIndex: index})
                        selectFile();
                      }}
                    >
                      <Icon icon={'mingcute:edit-2-line'} style={{height: 20, width: 20, color: theme.colors.foreground}} />
                    </Button>
                    <Button
                      variant="quaternary"
                      onClick={() => {
                        setImages(images.filter((_file, _index) => index !== _index));
                      }}
                    >
                      <Icon icon={'mingcute:delete-2-line'} style={{height: 20, width: 20, color: theme.colors.foreground}} />
                    </Button>
                  </Card>
                  <Button
                    variant="quaternary"
                    style={{width: 40}}
                    onClick={() => {
                      setInsertAction({type: 'insert', toIndex: index + 1})
                      selectFile();
                    }}
                  >
                    <Icon icon={'mingcute:add-line'} style={{height: 20, width: 20, color: theme.colors.foreground}} />
                  </Button>
                </View>
              </Card>

            ))}
          </View>
          <View horizontal gap={8}>
            <Button variant="tertiary" style={{flex: 1}} onClick={() => setModalMode('close')}>Đóng</Button>
            <Button
              variant="primary"
              style={{flex: 1}}
              onClick={() => {actCUDHelper(updateImages, noti, 'update').then(() => setModalMode('close'))}}
            >{modalMode === 'create' ? 'Tạo' : 'Cập nhật'}</Button>
          </View>
        </View>
      </Modal>
      <Modal
        isOpen={modalMode === 'create' || modalMode === 'update'}
        onRequestClose={() => setModalMode('close')}
        style={customStyles}
      >
        <View gap={16}>
          <View gap={8}>
            <Text variant="title">Tên</Text>
            <Input
              variant="tertiary"
              placeholder="Tên"
              value={selectedItem.name}
              onChange={(e) => setSelectedItem({...selectedItem, name: e.target.value})}
            />
          </View>
          <View gap={8}>
            <Text variant="title">Tên</Text>
            <Button
              variant="tertiary"
              onClick={() => setSelectedItem({...selectedItem, free: !selectedItem.free})}
            >
              {selectedItem?.free ? 'Miễn phí' : 'Tính phí'}
            </Button>
          </View>
          <View horizontal gap={8}>
            <Button variant="tertiary" style={{flex: 1}} onClick={() => setModalMode('close')}>Đóng</Button>
            <Button
              variant="primary"
              style={{flex: 1}}
              onClick={() => {
                modalMode === 'create' ?
                  actCUDHelper(create, noti, 'create').then(() => setModalMode('close'))
                :
                  actCUDHelper(update, noti, 'update').then(() => setModalMode('close'))
              }}
            >{modalMode === 'create' ? 'Tạo' : 'Cập nhật'}</Button>
          </View>
        </View>
      </Modal>
      <View horizontal>
        <View horizontal flex={1}>
          <Button
            variant="tertiary"
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
            variant="tertiary"
            placeholder="Tìm kiếm"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </View>
      </View>
      <View gap={8} style={{height: 640}} scrollable>
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
                variant="tertiary"
                horizontal
              >
                <View flex={1} style={{justifyContent: 'center'}}>
                  <Text variant="title">{item.name}</Text>
                </View>
                <View horizontal gap={8}>
                  <Button
                    variant="quaternary"
                    style={{gap: 8}}
                    onClick={() => {
                      setSelectedItem(item);
                      fetchImages(item);
                      setModalMode('images');
                    }}
                  >
                    <Icon icon={'mingcute:pic-2-line'} style={{height: 20, width: 20, color: theme.colors.foreground}} />
                    <Text>{item.image_urls ? item.image_urls.length : 0}</Text>
                  </Button>
                  <Button
                    variant="tertiary"
                    style={{width: 40}}
                    onClick={() => {
                      setSelectedItem(item);
                      setModalMode('update');
                    }}
                  >
                    <Icon icon={'mingcute:edit-line'} style={{height: 20, width: 20, color: theme.colors.foreground}} />
                  </Button>
                  <Button
                    variant="tertiary"
                    style={{width: 40}}
                    onClick={() => actCUDHelper(remove, noti, 'delete', item.id)}
                  >
                    <Icon icon={'mingcute:delete-2-line'} style={{height: 20, width: 20, color: theme.colors.foreground}} />
                  </Button>
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
  )
}

function ComicDetailMNPage() {
  const theme = useTheme();
  const navigate = useNavigate();
  const noti = useNotifications();
  const { comic_id } = useParams();

  const query = useQuery({
    queryKey: ['admin', 'comic', comic_id],
    queryFn: () => ComicMNService.getDetailAsync(parseInt(comic_id || '')),
    retry: 0
  });

  const remove = useMutation({
    mutationFn: () => ComicMNService.deleteAsync(parseInt(comic_id || ''))
  })

  return (
    <Page.Container>
      <Page.Content gap={16}>
        <Card shadowEffect>
          <Text variant="medium-title">Ảnh đại diện</Text>
          <ImageSection query={query} />
        </Card>
        <Card shadowEffect>
          <Text variant="medium-title">Thông tin</Text>
          <InfoSection query={query} />
        </Card>
        <Card>
          <Text variant="medium-title">Danh sách chương</Text>
          <ChaptersSection comic_id={parseInt(comic_id || '')} />
        </Card>
        <Card>
          <Text variant="medium-title">Hành động</Text>
          <ActionsSection query={query} />
        </Card>
      </Page.Content>
    </Page.Container>
  )
}

export default ComicDetailMNPage;
