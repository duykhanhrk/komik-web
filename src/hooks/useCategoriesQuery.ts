import {CategoryService} from '@services';
import {useQuery} from 'react-query';

export default function useCategoriesQuery() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: CategoryService.getAllAsync,
    cacheTime: Infinity,
    refetchOnWindowFocus: false,
    staleTime: Infinity
  });
}
