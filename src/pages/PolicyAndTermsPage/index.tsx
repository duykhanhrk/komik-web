import {Page, View} from '@components';
import {DocumentService} from '@services';
import {useQuery} from 'react-query';
import {useTheme} from 'styled-components';
import ErrorPage from '../ErrorPage';
import LoadingPage from '../LoadingPage';
import 'react-quill/dist/quill.snow.css';

function PolicyAndTermsPage() {
    const theme = useTheme();
    const query = useQuery({
        queryKey: ['documents', 'policy_and_terms'],
        queryFn: () => DocumentService.getPolicyAndTermsAsync()
    });

    if (query.isLoading) {
        return <LoadingPage />;
    }

    if (query.isError) {
        return <ErrorPage />;
    }

    return (
        <Page.Container>
            <Page.Content>
                <View className="ql-editor" gap={8} style={{textAlign: 'unset', color: theme.colors.foreground}} dangerouslySetInnerHTML={{ __html: query.data.policy_and_terms.value }}>
                </View>
            </Page.Content>
        </Page.Container>
    );
}

export default PolicyAndTermsPage;
