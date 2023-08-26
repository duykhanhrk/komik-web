import {useAppSelector} from '@hooks';
import {Navigate} from 'react-router';

interface Props {
  children: React.ReactNode;
}


function RequireAuth({children}: Props) {
    const { userTokens } = useAppSelector(state => state.session);

    if (userTokens.refresh_token && userTokens.access_token) {
        return <>children</>;
    }

    return <Navigate to={'/sign_in'} />;
}

export default RequireAuth;
