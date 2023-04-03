import {Button, Card, Input, Page, Text, View} from "@components";
import {useUserProfileQuery} from "@hooks";
import {UserService} from "@services";
import {useEffect, useRef, useState} from "react";
import {useMutation} from "react-query";
import ErrorPage from "../ErrorPage";
import LoadingPage from "../LoadingPage";
import moment from "moment";
import './index.scss';
import styled, {useTheme} from "styled-components";
import AvatarEditor from 'react-avatar-editor';
import {useNotifications} from "reapop";
import {isAxiosError} from "axios";

const Avatar = styled.img`
  height: 140px;
  width: 140px;
  border-radius: 8px;
`;


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

function AvatarSection() {
  const [image, setImage] = useState<File>();
  const [editorOpen, setEditorOpen] = useState<boolean>(false);

  const theme = useTheme();
  const query = useUserProfileQuery();
  const fileInput = useRef<HTMLInputElement>(null);
  const editorRef = useRef<AvatarEditor>(null);

  const {notify} = useNotifications();

  useEffect(() => {
    if (query.data?.user) {
      fetch(query.data.user.avatar_url)
        .then(response => response.arrayBuffer())
        .then(buffer => {
          const imageFile = new File([buffer], 'avatar.jpg', { type: 'image/jpeg' });
          setImage(imageFile);
      });
    }
  }, [query.data])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let _image = e.target.files?.[0] || null;
    if (!_image) return;
    setImage(_image);
    setEditorOpen(true);
  };
  

  const selectFile = () => {
    fileInput.current?.click();
  }

  return (
    <Card>
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
              scale={1.2}
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
                      UserService.updateAvatar(file)
                        .then(() => {
                          query.refetch();
                          notification.title = 'Thành công'
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

                          notification.title = 'Lỗi'
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
            <input type="file" style={{ "display": "none" }} onChange={handleImageChange} ref={fileInput} />
            <Avatar src={query.isSuccess ? query.data.user.avatar_url : ''} />
            <Button variant="tertiary" onClick={selectFile}>Thay đổi</Button>
          </View>
        </View>
      }
    </Card>
  )
}

function UserInfoSection() {
  const [firstname, setFirstname] = useState<string>('');
  const [lastname, setLastname] = useState<string>('');
  const [birthday, setBirthday] = useState<Date>(new Date());

  const query = useUserProfileQuery();
  const {notify} = useNotifications();

  useEffect(() => {
    if (query.data && query.data.user) {
      setFirstname(query.data?.user.firstname);
      setLastname(query.data?.user.lastname);
      setBirthday(query.data?.user.birthday);
    }
  }, [query.data]);

  const update = useMutation({
    mutationFn: () => UserService.updateInfo({firstname, lastname, birthday}),
    onSettled: query.refetch,
  })

  if (query.isLoading) {
    return <LoadingPage />
  }

  if (query.isError) {
    return <ErrorPage error={query.error} />
  }

  return (
    <Card horizontal>
      <View gap={8}>
        <View horizontal style={{alignItems: 'center'}}>
          <Text style={{width: 180}}>Họ</Text>
          <Input
            shadowEffect
            type="text"
            value={lastname}
            placeholder="Họ"
            onChange={(e) => setLastname(e.target.value)}
          />
        </View>
        <View horizontal style={{alignItems: 'center'}}>
          <Text style={{width: 180}}>Tên</Text>
          <Input
            shadowEffect
            type="text"
            value={firstname}
            placeholder="Tên"
            onChange={(e) => setFirstname(e.target.value)}
          />
        </View>

        <View horizontal style={{alignItems: 'center'}}>
          <Text style={{width: 180}}>Ngày sinh</Text>
          <Input
            shadowEffect
            type="date"
            value={moment(birthday).format('YYYY-MM-DD')}
            placeholder="Tên"
            onChange={(e) => {
              console.log(new Date(e.target.value).toString());
            setBirthday(new Date(e.target.value))}}
            style={{flex: 1}}
          />
        </View>

        <Button
          variant="primary"
          style={{marginLeft: 180}}
          onClick={() => {
            const notification = notify({
              title: 'Thực thi',
              message: 'Đang tải cập nhật',
              status: 'loading',
              dismissible: false
            });

            update.mutateAsync()
              .then(() => {
                notification.title = 'Thành công'
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

                notification.title = 'Lỗi'
                notification.status = 'error';
                notification.dismissible = true;
                notification.dismissAfter = 3000;

                notify(notification);
              });
          }}
        >Cập nhật</Button>
      </View>
    </Card>
  )
}

function LoginInfoSection() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const query = useUserProfileQuery();
  const {notify} = useNotifications();

  const update = useMutation({
    mutationFn: () => UserService.updateAccount({username, email, password}),
    onSettled: query.refetch
  })

  useEffect(() => {
    if (query.data && query.data.user) {
      setUsername(query.data.user.username);
      setEmail(query.data.user.email);
    }
  }, [query.data]);

  if (query.isLoading) {
    return <LoadingPage />
  }

  if (query.isError) {
    return <ErrorPage error={query.error} />
  }

  return (
    <Card horizontal>
      <View gap={8}>
        <View horizontal style={{alignItems: 'center'}}>
          <Text style={{width: 180}}>Tên đăng nhập</Text>
          <Input
            shadowEffect
            type="text"
            value={username}
            placeholder="Tên đăng nhập"
            onChange={(e) => setUsername(e.target.value)}/>
        </View>

        <View horizontal style={{alignItems: 'center'}}>
          <Text style={{width: 180}}>Email</Text>
          <Input
            shadowEffect
            type="text"
            value={email}
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}/>
        </View>

        <View horizontal style={{alignItems: 'center'}}>
          <Text style={{width: 180}}>Mật khẩu hiện tại</Text>
          <Input
            shadowEffect
            type="password"
            value={password}
            placeholder="Mật khẩu hiện tại"
            onChange={(e) => setPassword(e.target.value)}/>
        </View>

        <Button
          variant="primary"
          style={{marginLeft: 180}}
          onClick={() => {
            const notification = notify({
              title: 'Thực thi',
              message: 'Đang tải cập nhật',
              status: 'loading',
              dismissible: false
            });

            update.mutateAsync()
              .then(() => {
                notification.title = 'Thành công'
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

                notification.title = 'Lỗi'
                notification.status = 'error';
                notification.dismissible = true;
                notification.dismissAfter = 3000;

                notify(notification);
              });
          }}
        >Cập nhật</Button>
      </View>
    </Card>
  )
}

function ChangePasswordSection() {
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirmation, setPasswordConfirmation] = useState('');
  const [password, setPassword] = useState('');

  const query = useUserProfileQuery();
  const {notify} = useNotifications();

  const update = useMutation({
    mutationFn: () => UserService.updateAccount({new_password: newPassword, password}),
    onSettled: query.refetch
  })

  if (query.isLoading) {
    return <LoadingPage />
  }

  if (query.isError) {
    return <ErrorPage error={query.error} />
  }

  return (
    <Card horizontal>
      <View gap={8}>
        <View horizontal style={{alignItems: 'center'}}>
          <Text style={{width: 180}}>Mật khẩu mới</Text>
          <Input
            shadowEffect
            type="password"
            value={newPassword}
            placeholder="Mật khẩu mới"
            onChange={(e) => setNewPassword(e.target.value)}/>
        </View>

        <View horizontal style={{alignItems: 'center'}}>
          <Text style={{width: 180}}>Mật khẩu mới nhập lại</Text>
          <Input
            shadowEffect
            type="password"
            value={newPasswordConfirmation}
            placeholder="Nhập lại mật khẩu mới"
            onChange={(e) => setPasswordConfirmation(e.target.value)}/>
        </View>

        <View horizontal style={{alignItems: 'center'}}>
          <Text style={{width: 180}}>Mật khẩu hiện tại</Text>
          <Input
            shadowEffect
            type="password"
            value={password}
            placeholder="Mật khẩu hiện tại"
            onChange={(e) => setPassword(e.target.value)}/>
        </View>

        <Button
          variant="primary"
          style={{marginLeft: 180}}
          onClick={() => {
            const notification = notify({
              title: 'Thực thi',
              message: 'Đang tải cập nhật',
              status: 'loading',
              dismissible: false
            });

            update.mutateAsync()
              .then(() => {
                notification.title = 'Thành công'
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

                notification.title = 'Lỗi'
                notification.status = 'error';
                notification.dismissible = true;
                notification.dismissAfter = 3000;

                notify(notification);
              });
          }}
        >Cập nhật</Button>
      </View>
    </Card>
  )
}

function UserProfilePage() {
  return (
    <Page.Container>
      <Page.Content gap={16}>
        <Card>
          <Text variant="medium-title">Ảnh đại diện</Text>
          <AvatarSection />
        </Card>
        <Card>
          <Text variant="medium-title">Chỉnh sửa thông tin cá nhân</Text>
          <UserInfoSection />
        </Card>
        <Card>
          <Text variant="medium-title">Chỉnh sửa thông tin đăng nhập</Text>
          <LoginInfoSection />
        </Card>
        <Card>
          <Text variant="medium-title">Đổi mật khẩu</Text>
          <ChangePasswordSection />
        </Card>
      </Page.Content>
    </Page.Container>
  )
}

export default UserProfilePage;
