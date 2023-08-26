import {Button, Input, Page, Text, TextArea, View} from '@components';
import {Feedback, FeedbackService} from '@services';
import {useState} from 'react';
import { actCUDHelper } from '@helpers/CUDHelper';
import {useMutation} from 'react-query';
import {useNotifications} from 'reapop';

function FeedbackPage() {
    const [feedback, setFeedback] = useState<Feedback>({title: '', content: ''});

    const noti = useNotifications();

    const create = useMutation({
        mutationFn: () => FeedbackService.sendFeedbackAsync(feedback)
    });

    return (
        <Page.Container>
            <Page.Content>
                <Text variant="title">Tiêu đề</Text>
                <Input
                    placeholder="Tiêu đề"
                    value={feedback.title}
                    onChange={(e) => setFeedback({...feedback, title: e.target.value})}
                />
                <Text variant="title">Nội dung</Text>
                <TextArea
                    placeholder="Nội dung"
                    rows={24}
                    onChange={(e) => setFeedback({...feedback, content: e.target.value})}
                />
                <Button
                    variant="primary"
                    onClick={() => actCUDHelper(create, noti, 'create')}
                >Gửi</Button>
            </Page.Content>
        </Page.Container>
    );
}

export default FeedbackPage;
