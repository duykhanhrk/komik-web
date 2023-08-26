import {CategoryService} from '@services';
import {useQuery} from 'react-query';

export default function useCategoriesQuery() {
    const query = useQuery({
        queryKey: ['categories'],
        queryFn: CategoryService.getAllAsync,
        cacheTime: Infinity,
        refetchOnWindowFocus: false,
        staleTime: Infinity
    });

    return query;
}
