import {Button, Card, ComicItem, Input, Page, Text, TextArea, View} from "@components";
import { useTheme } from "styled-components";
import { useNavigate } from "react-router";
import { useNotifications } from "reapop";
import { useParams } from "react-router";
import { useMutation, useQuery, useQueryClient, UseQueryResult } from "react-query";
import {Category, CategoryMNService, CategoryService, Comic, ComicMNService} from "@services";
import {useEffect, useRef, useState} from "react";
import AvatarEditor from "react-avatar-editor";
import {isAxiosError} from "axios";
import LoadingPage from "../LoadingPage";
import ErrorPage from "../ErrorPage";
import {actCUDHelper} from "@helpers/CUDHelper";

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
    <Card>
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
    </Card>
  )
}

function InfoSection({query}: {query: UseQueryResult<any, any>}) {
  const [comic, setComic] = useState<Comic | undefined>();

  const noti = useNotifications();

  useEffect(() => {
    if (query.data && query.data.comic) {
      setComic(query.data.comic);
    }
  }, [query.data]);

  const update = useMutation({
    mutationFn: () => ComicMNService.updateAsync(comic!),
    onSettled: query.refetch,
  })

  if (query.isLoading) {
    return <LoadingPage />
  }

  if (query.isError) {
    return <ErrorPage error={query.error} />
  }

  return (
    <Card>
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
            onClick={(e) => comic && setComic({...comic, status: comic.status == 'finished' ? 'unfinished' : 'finished'})}
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
        <Button
          variant="primary"
          style={{marginLeft: 180}}
          onClick={() => actCUDHelper(update, noti, 'update')}
        >Cập nhật</Button>
      </View>
    </Card>
  )
}

function CategoriesSection({query}: {query: UseQueryResult<any, any>}) {
  const [comic, setComic] = useState<Comic | undefined>();

  const noti = useNotifications();

  useEffect(() => {
    if (query.data && query.data.comic) {
      setComic({...query.data.comic, category_ids: query.data.comic.categories.map((item: Comic) => item.id)});
    }
  }, [query.data]);

  const categoryQuery = useQuery({
    queryKey: ['categories'],
    queryFn: () => CategoryService.getAllAsync(),
  });

  const update = useMutation({
    mutationFn: () => ComicMNService.updateAsync(comic!),
    onSettled: query.refetch,
  })

  if (query.isLoading || categoryQuery.isLoading) {
    return <LoadingPage />
  }

  if (query.isError || categoryQuery.isError) {
    return <ErrorPage />
  }

  return (
    <Card>
      <View horizontal style={{alignItems: 'center'}}>
        <Text style={{width: 180}}>Thể loại</Text>
        <View horizontal gap={4} wrap>
          {categoryQuery.data.categories.map((item: Category) => (
            <Button
              variant={comic?.category_ids?.includes(item.id) ? 'primary' : 'tertiary'}
              key={item.id}
              style={{width: 120}}
              onClick={() => comic && setComic({...comic, category_ids: !comic?.category_ids?.includes(item.id) ? comic?.category_ids?.concat([item.id]) : comic?.category_ids?.filter((id) => id !== item.id)})}
            >{item.name}</Button>
          ))}
        </View>
      </View>
      <Button
        variant="primary"
        style={{marginLeft: 180}}
        onClick={() => actCUDHelper(update, noti, 'update')}
      >Cập nhật</Button>
    </Card>
  )
}

function ComicDetailMNPage() {
  const theme = useTheme();
  const navigate = useNavigate();
  const {notify} = useNotifications();
  const { comic_id } = useParams();

  const query = useQuery({
    queryKey: ['comic', comic_id],
    queryFn: () => ComicMNService.getDetailAsync(parseInt(comic_id || '')),
    retry: 0
  });

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
        <Card shadowEffect>
          <Text variant="medium-title">Thể loại</Text>
          <CategoriesSection query={query} />
        </Card>
      </Page.Content>
    </Page.Container>
  )
}

export default ComicDetailMNPage;
