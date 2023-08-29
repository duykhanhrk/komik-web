import {Button, Card, DateInput, Input, Tag, Text, TextArea, View} from '@components';
import {useNotifications} from 'reapop';
import {useMutation, useQuery} from 'react-query';
import {Author, Category, CategoryService, Comic, ComicMNService} from '@services';
import {useEffect, useState} from 'react';
import LoadingPage from '../LoadingPage';
import ErrorPage from '../ErrorPage';
import {actCUDHelper} from '@helpers/CUDHelper';
import {Icon} from '@iconify/react';
import {useTheme} from 'styled-components';
import AuthorsModal from './AuthorsModal';

function InfoSection({_data, onSaveSuccess}: {_data: Comic, onSaveSuccess?: () => void}) {
  const [comic, setComic] = useState<Comic>(_data);
  const [authorsModalOpen, setAuthorsModalOpen] = useState<boolean>(false);

  const noti = useNotifications();
  const theme = useTheme();

  const categoryQuery = useQuery({
    queryKey: ['admin', 'comics', 'categories'],
    queryFn: () => CategoryService.getAllAsync(),
  });

  useEffect(() => {
    setComic({
      ..._data,
      category_ids: comic.categories ? comic.categories.map((item: Category) => item.id!) : [],
      author_ids: comic.authors ? comic.authors.map((item: Author) => item.id!) : []
    });
  }, [_data]);

  const update = useMutation({
    mutationFn: () => ComicMNService.updateAsync(comic!),
    onSettled: onSaveSuccess,
  });

  if (categoryQuery.isLoading) {
    return <LoadingPage />;
  }

  if (categoryQuery.isError) {
    return <ErrorPage error={categoryQuery.error} />;
  }

  return (
    <>
      <AuthorsModal
        _data={comic?.authors}
        open={authorsModalOpen}
        onOpenChange={(open) => setAuthorsModalOpen(open)}
        onDataChange={(data) => comic && setComic({...comic, authors: data, author_ids: data.map(item => item.id!)})}
      />
      <View horizontal style={{alignItems: 'center'}}>
        <Text variant="medium-title" style={{flex: 1}}>Thông tin</Text>
        <Button
          variant="primary"
          style={{gap: 8, width: 120}}
          onClick={() => actCUDHelper(update, noti, 'update')}
        >
          <Icon icon={'mingcute:save-line'} style={{color: 'inhirit', height: 20, width: 20}}/>
          <Text variant="inhirit">Cập nhật</Text>
        </Button>
      </View>
      <View gap={8}>
        <View gap={8}>
          <View horizontal style={{alignItems: 'center'}}>
            <Text style={{width: 180}}>Tên</Text>
            <Input
              flex={1}
              variant="tertiary"
              type="text"
              value={comic?.name}
              placeholder="Tên"
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
              placeholder="Tên khác"
              onChange={(e) => comic && setComic({...comic, other_names: e.target.value})}
            />
          </View>
          <View horizontal style={{alignItems: 'center'}}>
            <Text style={{width: 180}}>Ngày phát hành</Text>
            <DateInput
              variant="tertiary"
              flex={1}
              value={comic?.release_date}
              onValueChange={(value) =>comic && setComic({...comic, release_date: value})}
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
            <Text style={{width: 180}}>Thể loại</Text>
            <Card variant="tertiary" flex={1} horizontal style={{gap: 4, flexWrap: 'wrap'}}>
              {categoryQuery.data?.map((item: Category) => (
                <Tag
                  variant={{ct: 'secondary'}}
                  key={item.id}
                  animation="slideLeftIn"
                  style={{width: 120, color: comic?.category_ids?.includes(item.id!) ? theme.colors.blue : theme.colors.foreground}}
                  onClick={() => comic && setComic({...comic, category_ids: !comic?.category_ids?.includes(item.id!) ? comic?.category_ids?.concat([item.id!]) : comic?.category_ids?.filter((id) => id !== item.id)})}
                >{item.name}</Tag>
              ))}
            </Card>
          </View>
          <View horizontal style={{alignItems: 'center'}}>
            <Text style={{width: 180}}>Tác giả</Text>
            <Card variant="tertiary" flex={1} horizontal style={{gap: 8, flexWrap: 'wrap'}}>
              <View horizontal flex={1} style={{gap: 4, flexWrap: 'wrap'}}>
                {comic?.authors?.map((item: Author) => (
                  <Card
                    key={item.id}
                    horizontal
                    style={{width: 220, height: 60, alignItems: 'center'}}
                    variant="secondary"
                    animation="slideLeftIn"
                  >
                    <img src={item.image_url} style={{width: 40, height: 40, borderRadius: 8}} />
                    <Text numberOfLines={1}>{`${item.lastname} ${item.firstname}`}</Text>
                  </Card>
                ))}
              </View>
              <Button
                square
                onClick={() => {
                  setAuthorsModalOpen(true);
                }}
              >
                <Icon icon={'akar-icons:plus'} style={{color: 'inherit', height: 20, width: 20}} />
              </Button>
            </Card>
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
        </View>
      </View>
    </>
  );
}

export default InfoSection;
