import {Button, Card, ComicItem, DateInput, Input, Page, RichEditor, Text, View} from '@components';
import {useTheme} from 'styled-components';
import {useNavigate} from 'react-router';
import {useNotifications} from 'reapop';
import {useParams} from 'react-router';
import {useMutation, useQuery, UseQueryResult} from 'react-query';
import {Author, AuthorMNService, Comic, ComicMNService} from '@services';
import {useEffect, useRef, useState} from 'react';
import AvatarEditor from 'react-avatar-editor';
import {isAxiosError} from 'axios';
import LoadingPage from '../LoadingPage';
import ErrorPage from '../ErrorPage';
import {actCUDHelper, deleteConfirmHelper} from '@helpers/CUDHelper';
import {Icon} from '@iconify/react';
import moment from 'moment';

function hexToRgb(hex: string): number[] | null {
    const regex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    const shortHex = hex.replace(regex, (_, r, g, b) => r + r + g + g + b + b);
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(shortHex);
    if (!result) {
        return null;
    }
    return [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16),
    ];
}

function ImageSection({query}: {query: UseQueryResult<any, any>}) {
    const [image, setImage] = useState<File>();
    const [editorOpen, setEditorOpen] = useState<boolean>(false);

    const theme = useTheme();
    const fileInput = useRef<HTMLInputElement>(null);
    const editorRef = useRef<AvatarEditor>(null);

    const {notify} = useNotifications();
  
    useEffect(() => {
        if (query.data?.author) {
            fetch(query.data.author.image_url)
                .then(response => response.arrayBuffer())
                .then(buffer => {
                    const imageFile = new File([buffer], 'image.jpg', { type: 'image/jpeg' });
                    setImage(imageFile);
                });
        }
    }, [query.data]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const _image = e.target.files?.[0] || null;
        if (!_image) return;
        setImage(_image);
        setEditorOpen(true);
    };
  

    const selectFile = () => {
        fileInput.current?.click();
    };

    return (
        <View gap={8}>
            {editorOpen ? 
                <View horizontal>
                    <View gap={8}>
                        <AvatarEditor
                            ref={editorRef}
                            image={image || ''}
                            width={250}
                            height={250}
                            border={50}
                            color={hexToRgb(theme.colors.background)?.concat([0.9])} // RGBA
                            scale={1}
                            rotate={0}
                            style={{backgroundColor: theme.colors.background}}
                        />
                        <View horizontal gap={8}>
                            <Button variant="tertiary" style={{flex: 1}} onClick={() => setEditorOpen(false)}>Hủy bỏ</Button>
                            <Button
                                variant="primary"
                                onClick={() => {
                                    if (editorRef.current) {
                                        const canvas = editorRef.current.getImageScaledToCanvas();
                                        canvas.toBlob((blob) => {
                                            if (blob) {
                                                const file = new File([blob], 'avatar.png', { type: 'image/png' });
                                                const notification = notify({
                                                    title: 'Thực thi',
                                                    message: 'Đang tải cập nhật',
                                                    status: 'loading',
                                                    dismissible: false
                                                });
                                                AuthorMNService.updateImageAsync(query.data.author.id!, file)
                                                    .then(() => {
                                                        query.refetch();
                                                        notification.title = 'Thành công';
                                                        notification.status = 'success';
                                                        notification.message = 'Cập nhật thành công';
                                                        notification.dismissible = true;
                                                        notification.dismissAfter = 3000;
                                                        notify(notification);
                                                    })
                                                    .catch((error) => {
                                                        if (isAxiosError(error) && error.response) {
                                                            notification.message = error.response.data.message;
                                                        } else {
                                                            notification.message = 'Có lỗi xảy ra, xin thử lại sau';
                                                        }

                                                        notification.title = 'Lỗi';
                                                        notification.status = 'error';
                                                        notification.dismissible = true;
                                                        notification.dismissAfter = 3000;

                                                        notify(notification);
                                                    });
                                            }});
                                        setEditorOpen(false);
                                    }
                                }}
                                style={{flex: 1}}
                            >Cập nhật</Button>
                        </View>
                    </View>
                </View>
                :
                <View horizontal>
                    <View gap={8}>
                        <input type="file" style={{ 'display': 'none' }} onChange={handleImageChange} ref={fileInput} />
                        <img style={{borderRadius: 8, height: 140, width: 140}} src={query.isSuccess ? query.data?.author?.image_url : ''} />
                        <Button variant="tertiary" onClick={selectFile}>Thay đổi</Button>
                    </View>
                </View>
            }
        </View>
    );
}

function InfoSection({query}: {query: UseQueryResult<any, any>}) {
    const [author, setAuthor] = useState<Author | undefined>();

    const noti = useNotifications();

    useEffect(() => {
        if (query.data && query.data.author) {
            setAuthor(query.data.author);
        }
    }, [query.data]);

    const update = useMutation({
        mutationFn: () => AuthorMNService.updateAsync(author!),
        onSettled: query.refetch,
    });

    if (query.isLoading) {
        return <LoadingPage />;
    }

    if (query.isError) {
        return <ErrorPage error={query.error} />;
    }

    return (
        <>
            <View horizontal style={{alignItems: 'center'}}>
                <Text variant="medium-title" style={{flex: 1}}>Thông tin</Text>
                <Button
                    variant="primary"
                    style={{gap: 8, width: 120}}
                    onClick={() => actCUDHelper(update, noti, 'update')}
                >
                    <Icon icon={'mingcute:save-line'} style={{color: 'inhirit', height: 20, width: 20}}/>
                    <Text variant="inhirit">Cập nhật</Text>
                </Button>
            </View>
            <View gap={8}>
                <View gap={8}>
                    <View horizontal style={{alignItems: 'center'}}>
                        <Text style={{width: 180}}>Tên</Text>
                        <Input
                            flex={1}
                            variant="tertiary"
                            type="text"
                            value={author?.lastname}
                            placeholder="Họ"
                            onChange={(e) => setAuthor({...author!, lastname: e.target.value})}
                        />
                    </View>
                    <View horizontal style={{alignItems: 'center'}}>
                        <Text style={{width: 180}}>Họ</Text>
                        <Input
                            flex={1}
                            variant="tertiary"
                            type="text"
                            value={author?.firstname}
                            placeholder="Tên"
                            onChange={(e) => setAuthor({...author!, firstname: e.target.value})}
                        />
                    </View>
                    <View horizontal style={{alignItems: 'center'}}>
                        <Text style={{width: 180}}>Sinh nhật</Text>
                        <DateInput
                            variant="tertiary"
                            flex={1}
                            value={author?.birthday}
                            onValueChange={(value) => setAuthor({...author!, birthday: new Date(value)})}
                        />
                    </View>
                    <View horizontal style={{alignItems: 'center'}}>
                        <Text style={{width: 180}}>Giới thiệu</Text>
                        <View variant="tertiary" style={{flex: 1, height: 800, borderRadius: 8}}>
                            <RichEditor value={author?.introduction || ''} onChange={(value) => setAuthor({...author!, introduction: value})} />
                        </View>
                    </View>
                </View>
            </View>
        </>
    );
}

function ActionsSection({query}: {query: UseQueryResult<any, any>}) {
    const [comic, setComic] = useState<Comic | undefined>();

    const noti = useNotifications();
    const navigate = useNavigate();
    const theme = useTheme();

    useEffect(() => {
        if (query.data && query.data.comic) {
            setComic(query.data.comic);
        }
    }, [query.data]);

    const update = useMutation({
        mutationFn: () => ComicMNService.activeAsync(comic?.id || 0, !comic?.active),
        onSettled: query.refetch
    });

    const remove = useMutation({
        mutationFn: () => ComicMNService.deleteAsync(comic?.id || 0)
    });

    if (query.isLoading) {
        return <LoadingPage />;
    }

    if (query.isError) {
        return <ErrorPage error={query.error} />;
    }

    return (
        <>
            <View horizontal flex={1} gap={8}>
                <Button
                    variant="secondary"
                    style={{gap: 8, width: 120}}
                    onClick={() => navigate(-1)}
                >
                    <Icon icon={'mingcute:arrow-left-line'} style={{color: 'inhirit', height: 24, width: 24}}/>
                    <Text variant="inhirit">Trở về</Text>
                </Button>
            </View>
            <View horizontal gap={8}>
                <Button
                    variant="primary"
                    style={{backgroundColor: theme.colors.red, gap: 8, width: 120}}
                    onClick={() => {
                        deleteConfirmHelper({
                            noti,
                            onConfirm: async () => {
                                actCUDHelper(remove, noti, 'delete').then(() => navigate(-1));
                            }
                        });
                    }}
                >
                    <Icon icon={'mingcute:delete-2-line'} style={{color: 'inhirit', height: 20, width: 20}}/>
                    <Text variant="inhirit">Xóa</Text>
                </Button>
            </View>
        </>
    );
}

function IntroductionEditor({_data, onChange}: {_data: Author, onChange?: (value: Author) => void}) {
    const [data, setData] = useState<Author>(_data);

    useEffect(() => {
        setData(_data);
    }, [_data]);

    return (
        <View style={{height: 'calc(100vh - 16px)', overflow: 'hidden'}}>
            <Button>Trờ về</Button>
            <View variant="secondary" style={{flex: 1, overflow: 'hidden'}}>
                <RichEditor
                    value={_data?.introduction}
                    onChange={(value) => {
                        setData({...data, introduction: value});
                        onChange && onChange({...data, introduction: value});
                    }}
                />
            </View>
        </View>
    );
}

function AuthorDetailMNPage() {
    const theme = useTheme();
    const { id } = useParams();

    const query = useQuery({
        queryKey: ['admin', 'authors', id],
        queryFn: () => AuthorMNService.getDetailAsync(parseInt(id || '')),
        retry: 0
    });

    if (query.isLoading) {
        return <LoadingPage />;
    }

    if (query.isError) {
        return <ErrorPage error={query.error} />;
    }

    return (
        <Page.Container>
            <Page.Content style={{flex: 0, flexDirection: 'row', position: 'sticky', top: 0, marginTop: -8, paddingTop: 8, paddingBottom: 8, backgroundColor: theme.colors.background}}>
                <ActionsSection query={query} />
            </Page.Content>
            <Page.Content gap={16}>
                <Card shadowEffect animation="slideLeftIn">
                    <Text variant="medium-title">Ảnh đại diện</Text>
                    <ImageSection query={query} />
                </Card>
                <Card shadowEffect animation="slideRightIn">
                    <InfoSection query={query} />
                </Card>
            </Page.Content>
        </Page.Container>
    );
}

export default AuthorDetailMNPage;
