import {Button, Card,Grid,Text, View} from '@components';
import {useCategoriesQuery} from '@hooks';
import {Category} from '@services';
import {useEffect, useState} from 'react';
import {useNavigate, useSearchParams} from 'react-router-dom';
import {useTheme} from 'styled-components';

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 20 }, (v, i) => currentYear - i);

function FilterTray() {
  const [params, setParams] = useState<{
    category_ids?: Array<number>,
    release_dates?: Array<Date>
  }>({});

  const [searchParams] = useSearchParams();

  const theme = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    let paramable = searchParams.get('category_ids');
    const category_ids = paramable === null || paramable === '' ? undefined : paramable.split(',').map(item => parseInt(item)).sort((a, b) => a - b);

    paramable = searchParams.get('release_dates');
    const release_dates = paramable === null || paramable === '' ? undefined : paramable.split(',').map(item => new Date(item)).sort((a, b) => new Date(a).getFullYear() - new Date(b).getFullYear());

    setParams({category_ids, release_dates});
  }, [searchParams]);

  const categoryQuery = useCategoriesQuery();

  return (
    <>
      <View flex={1} scrollable gap={16}>
        <View gap={8}>
          <Text variant="title">Thể loại</Text>
          <Grid templateColumns="auto auto" gap={4}>
            {categoryQuery.data?.map((item: Category) => (
              <Card
                key={item.id}
                variant={params.category_ids?.includes(item.id!) ? 'tertiary' : undefined}
                style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
                onClick={() => {
                  if (params.category_ids?.includes(item.id!)) {
                    setParams({...params, category_ids: params.category_ids?.filter((id) => id !== item.id)});
                  } else {
                    setParams({...params, category_ids: [...(params.category_ids ?? []), item.id!]});
                  }
                }}
              >
                <Text variant="inhirit" style={{color: params.category_ids?.includes(item.id!) ? theme.colors.blue : theme.colors.foreground}}>{item.name}</Text>
              </Card>
            ))}
          </Grid>
        </View>

        <View gap={8}>
          <Text variant="title">Năm phát hành</Text>
          <Grid templateColumns="auto auto" gap={4}>
            {years.map((item: number) => (
              <Card
                key={item}
                variant={params.release_dates?.some((date) => date.getFullYear() === item) ? 'tertiary' : undefined}
                flex={1}
                style={{justifyContent: 'center', alignItems: 'center'}}
                onClick={() => {
                  if (params.release_dates?.some((date) => date.getFullYear() === item)) {
                    setParams({...params, release_dates: params.release_dates?.filter((date) => date.getFullYear() !== item)});
                  } else {
                    setParams({...params, release_dates: [...(params.release_dates ?? []), new Date(item, 0, 1)]});
                  }
                }}
              >
                <Text variant="inhirit" style={{color: params.release_dates?.some((date) => date.getFullYear() === item) ? theme.colors.blue : theme.colors.foreground}}>{item}</Text>
              </Card>
            ))}
          </Grid>
        </View>
      </View>
      <Button
        variant="tertiary"
        onClick={() => {
          navigate(`/comics/filter?category_ids=${params.category_ids?.join(',') ?? ''}&release_dates=${params.release_dates?.map((date) => `${date.getFullYear()}-01-01`).join(',') ?? ''}`);
        }}
      >
        Lọc
      </Button>
    </>
  );
}

export default FilterTray;
