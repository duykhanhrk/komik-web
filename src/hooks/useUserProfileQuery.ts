import {UserService} from '@services';
import {useQuery} from 'react-query';

export default function useUserProfileQuery() {
  return useQuery({
    queryKey: 'getUserProfile',
    queryFn: UserService.getProfile,
    cacheTime: Infinity,
    refetchOnWindowFocus: false,
    staleTime: Infinity
  });
}
