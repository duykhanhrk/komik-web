import {UserService} from '@services';
import {useQuery} from 'react-query';

export default function useUserProfileQuery() {
    const query = useQuery({
        queryKey: 'getUserProfile',
        queryFn: UserService.getProfile,
        cacheTime: Infinity,
        refetchOnWindowFocus: false,
        staleTime: Infinity
    });

    return query;
}
