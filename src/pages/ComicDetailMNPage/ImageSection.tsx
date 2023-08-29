import {Button, ComicItem, View} from '@components';
import {useTheme} from 'styled-components';
import {useNotifications} from 'reapop';
import {Comic, ComicMNService} from '@services';
import {useEffect, useRef, useState} from 'react';
import AvatarEditor from 'react-avatar-editor';
import {isAxiosError} from 'axios';

interface ImageSectionProps {
  _data: Comic;
  onDataChange?: (data: Comic) => void;
  onSaveSuccess?: () => void;
}


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

function ImageSection({_data, onSaveSuccess, onDataChange}: ImageSectionProps) {
  const [data, setData] = useState<Comic>(_data);
  const [image, setImage] = useState<File>();
  const [editorOpen, setEditorOpen] = useState<boolean>(false);

  const theme = useTheme();
  const fileInput = useRef<HTMLInputElement>(null);
  const editorRef = useRef<AvatarEditor>(null);

  const {notify} = useNotifications();
  
  useEffect(() => {
    if (_data?.image_url) {
      fetch(_data.image_url)
        .then(response => response.arrayBuffer())
        .then(buffer => {
          const imageFile = new File([buffer], 'image.jpg', { type: 'image/jpeg' });
          setImage(imageFile);
        });
    }
    setData(_data);
  }, [_data]);

  useEffect(() => {
    if (onDataChange) {
      onDataChange(data);
    }
  }, [data]);

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
              width={360}
              height={480}
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

                        ComicMNService.updateImageAsync(data.id!, file)
                          .then(() => {
                            setImage(file);
                            onSaveSuccess?.();

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
            <ComicItem.Image style={{borderRadius: 8}} src={data?.image_url} />
            <Button variant="tertiary" onClick={selectFile}>Thay đổi</Button>
          </View>
        </View>
      }
    </View>
  );
}

export default ImageSection;
