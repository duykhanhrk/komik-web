import {View, Card, Dropdown, Text} from "@components";
import {Icon} from "@iconify/react";
import {useEffect, useState} from "react";
import {matchPath, useLocation, useNavigate} from "react-router";
import {useSearchParams} from "react-router-dom";
import {useTheme} from "styled-components";

const sortByOptions = [
  {label: 'Ngày cập nhật', icon: 'mingcute:calendar', color: '#95BB72', value: 'last_updated_chapter_at-desc'},
  {label: 'Lượt xem', icon: 'mingcute:eye-2', color: '#1E97F3', value: 'views-desc'},
  {label: 'Lượt thích', icon: 'mingcute:heart', color: '#FF2C2C', value: 'likes-desc'}
]

function OptionBar() {
  const [params, setParams] = useState<{
    category_ids?: Array<number>,
    query?: string,
    release_dates?: Array<string>,
    sort_by?: string
  }>({});
  const [searchParams] = useSearchParams();

  const navigate = useNavigate();
  const theme = useTheme();

  const { pathname } = useLocation();

  const isStars = matchPath("/comics/stars/*", pathname) || matchPath("/comics", pathname);
  const isSearching = matchPath("/comics/searching/*", pathname);
  const isCategories = matchPath("/comics/categories/*", pathname);
  const isReleaseDates = matchPath("/comics/release_dates/*", pathname);
  const isFilters = matchPath("/comics/filter/*", pathname);

  useEffect(() => {
    let paramable = searchParams.get('category_ids');
    const category_ids = paramable === null || paramable === '' ? undefined : paramable.split(',').map(item => parseInt(item)).sort((a, b) => a - b);

    paramable = searchParams.get('release_dates');
    const release_dates = paramable === null ? undefined : paramable.split(',').map(item => item).sort((a, b) => new Date(a).getFullYear() - new Date(b).getFullYear());

    paramable = searchParams.get('sort_by');
    const sort_by = paramable === null ? 'last_updated_chapter_at-desc' : paramable;

    paramable = searchParams.get('query');
    const query = paramable === null ? undefined : paramable;

    setParams({
      category_ids,
      query,
      release_dates,
      sort_by
    })
  }, [searchParams])

  const buildLink = (new_sort?: string) => {
    if (isStars) {
      return `/comics?sort_by=${new_sort}`
    } else if (isSearching) {
      return `/comics/searching?sort_by=${new_sort}${params.release_dates && params.release_dates.length > 0 ? `&release_dates=${params.release_dates.join(',')}` : ''}${params.category_ids && params.category_ids.length > 0 ? `&category_ids=${params.category_ids.join(',')}` : ''}${params.query ? `&query=${params.query}` : ''}`
    } else if (isCategories) {
      return `/comics/categories?sort_by=${new_sort}${params.category_ids && params.category_ids.length > 0 ? `&category_ids=${params.category_ids.at(0)}` : ''}`
    } else if (isReleaseDates) {
      return `/comics/release_dates?sort_by=${new_sort}${params.release_dates && params.release_dates.length > 0 ? `&release_dates=${params.release_dates.at(0)}` : ''}`
    } else if (isFilters) {
      return `/comics/filter?sort_by=${new_sort}${params.release_dates && params.release_dates.length > 0 ? `&release_dates=${params.release_dates.join(',')}` : ''}${params.category_ids && params.category_ids.length > 0 ? `&category_ids=${params.category_ids.join(',')}` : ''}${params.query ? `&query=${params.query}` : ''}`
    } else {
      return `/comics?sort_by=${new_sort}`
    }
  }

  return (
    <View horizontal style={{justifyContent: 'flex-end', padding: '0 0 8px 8px', position: 'sticky', top: 60, backgroundColor: theme.colors.background}}>
      <Card shadowEffect style={{padding: 0}}>
        <Dropdown.SelectionList<{label: string, value: string, icon: string, color: string}>
          _data={sortByOptions}
          style={{width: 180}}
          buttonContent={(item) => item ?
            <View horizontal gap={8} style={{alignItems: 'center'}}>
              <Icon icon={`${item.icon}-fill`} style={{height: 20, width: 20, color: item.color}}/>
              <Text style={{color: item.color}}>{item.label}</Text>
            </View>
            : 'Sắp xếp theo'
          }
          buttonStyle={{height: 36}}
          renderItem={(item: {label: string, value: string, icon: string, color: string}) => (
            <View horizontal gap={8} style={{alignItems: 'center', paddingTop: 8, paddingBottom: 8}}>
              <Icon icon={`${item.icon}-line`} style={{height: 20, width: 20, color: item.color}}/>
              <Text>{item.label}</Text>
            </View>
          )}
          onItemSelected={(item) => {
            setParams({...params, sort_by: item?.value});
            navigate(buildLink(item?.value));
          }}
          selectedItem={sortByOptions.find(item => item.value === params.sort_by)}
        />
      </Card>
    </View>
  )
}

export default OptionBar;
