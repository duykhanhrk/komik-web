import {Card,Text} from '@components';
import {useCategoriesQuery} from '@hooks';
import {Category} from '@services';
import {useEffect, useState} from 'react';
import {Link, matchPath, useLocation, useSearchParams} from 'react-router-dom';
import { useTheme } from 'styled-components';

function CategoriesTray() {
  const [params, setParams] = useState<{
    category_ids?: Array<number>,
  }>({});

  const [searchParams] = useSearchParams();
  const { pathname } = useLocation();

  const isCategories = matchPath('/comics/categories/*', pathname);

  const theme = useTheme();

  useEffect(() => {
    const paramable = searchParams.get('category_ids');
    const category_ids = paramable === null || paramable === '' ? undefined : paramable.split(',').map(item => parseInt(item)).sort((a, b) => a - b);

    setParams({category_ids});
  }, [searchParams]);

  const categoryQuery = useCategoriesQuery();

  return (
    <>
      {categoryQuery.data?.map((item: Category) => (
        <Link key={item.id} to={`/comics/categories?category_ids=${item.id}`} style={{textDecoration: 'none', display: 'flex'}}>
          <Card variant={isCategories && params.category_ids?.includes(item.id!) ? 'tertiary' : undefined} style={{flex: 1}}>
            <Text variant="inhirit" style={{color: isCategories && params.category_ids?.includes(item.id!) ? theme.colors.blue : theme.colors.foreground}}>{item.name}</Text>
          </Card>
        </Link>
      ))}
    </>
  );
}

export default CategoriesTray;
