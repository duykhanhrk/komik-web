import {Button, Card, RichEditor, View} from '@components';
import {actCUDHelper} from '@helpers/CUDHelper';
import {Console} from 'console';
import {useEffect, useState} from 'react';
import {useMutation, useQuery} from 'react-query';
import {useNotifications} from 'reapop';
import ErrorPage from '../ErrorPage';
import LoadingPage from '../LoadingPage';

function DocumentEditor({documentKey, documentFn, documentUpdateFn}: {documentKey: string, documentFn: () => Promise<any>, documentUpdateFn: (data: any) => Promise<any>}) {
    const noti = useNotifications();

    const [data, setData] = useState<{key: string, value: string}>({
        key: '',
        value: ''
    });

    const query = useQuery({
        queryKey: ['admin', 'documents', documentKey],
        queryFn: documentFn
    });

    const update = useMutation({
        mutationFn: () => documentUpdateFn(data),
        onSettled: () => {
            query.refetch();
        }
    });

    useEffect(() => {
        if (query.data && query.data[documentKey]) {
            console.log(query.data[documentKey]);
            setData(query.data[documentKey]);
        }
    }, [query.data]);

    if (query.isLoading) {
        return <LoadingPage />;
    }

    if (query.isError) {
        return <ErrorPage />;
    }

    return (
        <View style={{height: '100vh', overflow: 'hidden'}} animation="slideTopIn">
            <Card variant="secondary" style={{flex: 1, overflow: 'hidden', padding: 0}}>
                <RichEditor
                    value={data.value}
                    onChange={(value) => {
                        setData({...data, value: value});
                    }}
                />
            </Card>
            <Button
                variant="primary"
                style={{marginTop: 16}}
                onClick={() => {
                    actCUDHelper(update, noti , 'update');
                }}
            >
        Cập nhật
            </Button>
        </View>
    );
}

export default DocumentEditor;
