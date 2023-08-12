import {Button, Card, Grid, Tag, Text, View} from "@components";
import {useTheme} from "styled-components";
import {useNotifications} from "reapop";
import {useInfiniteQuery, useMutation} from "react-query";
import {Chapter, ComicMNService} from "@services";
import {useEffect, useRef, useState} from "react";
import {actCUDHelper} from "@helpers/CUDHelper";
import {Icon} from "@iconify/react";
import Modal from 'react-modal';

interface ChapterImagesModalProps {
  comic_id: number;
  chapter_id: number;
  _data?: Array<string>;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSaveSuccess?: () => void;
}

function ChapterImagesModal({
  _data,
  comic_id,
  chapter_id,
  open,
  onOpenChange,
  onSaveSuccess
}: ChapterImagesModalProps) {
  const [_open, setOpen] = useState<boolean>(open || false);
  const [images, setImages] = useState<Array<File>>([]);
  const [insertAction, setInsertAction] = useState<{type: 'insert' | 'new' | 'replace', toIndex?: number}>({type: 'new', toIndex: 0})

  const fileInput = useRef<HTMLInputElement>(null);

  const noti = useNotifications();
  const theme = useTheme();

  useEffect(() => {
    setOpen(open || false);
  }, [open])

  useEffect(() => {
    if (onOpenChange) {
      onOpenChange(_open);
    }
  }, [_open])

  useEffect(() => {
    fetchImages(_data || []);
  }, [_data])

  async function fetchImages(imgUrls: Array<string>) {
    let imageFilesArray: Array<File> = [];
    if (imgUrls) {
      for(let url of imgUrls) {
        const res = await fetch(url);
        const buffer = await res.arrayBuffer();
        const file = new File([buffer], `image.jpg`, { type: 'image/jpeg' });
        imageFilesArray = imageFilesArray.concat([file]);
      }
    }
    setImages(imageFilesArray);
  }

  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      border: `0 solid ${theme.colors.secondaryBackground}`,
      borderRadius: 8,
      padding: 16,
      backgroundColor: theme.colors.secondaryBackground,
      overflow: 'hidden'
    },
    overlay: {
      backgroundColor: `${theme.colors.background}99`
    }
  };


  const updateImages = useMutation({
    mutationFn: () => ComicMNService.updateChapterImagesAsync(comic_id, chapter_id, images),
    onSettled: onSaveSuccess,
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let files = e.target.files;
    if (!files) return;

    if (insertAction.type === 'new') {
      setImages(images.concat(Array.from(files)));
    } else if (insertAction.type === 'insert')  {
      images.splice(insertAction.toIndex || 0, 0, ...Array.from(files));
      setImages(images);
    } else if (insertAction.type === 'replace') {
      images.splice(insertAction.toIndex || 0, 1, ...Array.from(files));
      setImages(images);
    }
  };
  
  const selectFile = () => {
    fileInput.current?.click();
  }

  return (
    <Modal
      isOpen={_open}
      onRequestClose={() => setOpen(false)}
      style={customStyles}
    >
      <View gap={16} animation="slideTopIn">
        <View gap={8} horizontal>
          <input type="file" multiple style={{ "display": "none" }} onChange={handleImageChange} ref={fileInput} />
          <Button
            variant="tertiary"
            style={{gap: 8, width: 120}}
            onClick={() => {
              setInsertAction({type: 'new'})
              selectFile();
            }}
          >Thêm</Button>
        </View>
        <View gap={8} variant="tertiary" horizontal wrap style={{gap: 8, width: 804, height: '80vh', borderRadius: 8, alignContent: 'flex-start', padding: 8}} scrollable>
          <Grid gap={8} templateColumns="auto auto auto">
            {images && images.map((file, index) => (
              <Card variant="secondary">
                <img src={URL.createObjectURL(file)} style={{width: 240, height: 240, borderRadius: 8}} />
                <View horizontal gap={8}>
                  <Tag
                    variant={{ct: 'secondary'}}
                    style={{width: 40}}
                    onClick={() => {
                      setInsertAction({type: 'insert', toIndex: index})
                      selectFile();
                    }}
                  >
                    <Icon icon={'mingcute:add-line'} style={{height: 16, width: 16}} />
                  </Tag>
                  <View flex={1} centerContent horizontal>
                    <Tag
                      variant={{ct: 'secondary'}}
                      onClick={() => {
                        setInsertAction({type: 'replace', toIndex: index})
                        selectFile();
                      }}
                    >
                      <Icon icon={'mingcute:edit-2-line'} style={{height: 16, width: 16, color: theme.colors.foreground}} />
                    </Tag>
                    <Tag
                      variant={{ct: 'secondary'}}
                      onClick={() => {
                        setImages(images.filter((_file, _index) => index !== _index));
                      }}
                    >
                      <Icon icon={'mingcute:delete-2-line'} style={{height: 16, width: 16, color: theme.colors.foreground}} />
                    </Tag>
                  </View>
                  <Tag
                    variant={{ct: 'secondary'}}
                    style={{width: 40}}
                    onClick={() => {
                      setInsertAction({type: 'insert', toIndex: index + 1})
                      selectFile();
                    }}
                  >
                    <Icon icon={'mingcute:add-line'} style={{height: 16, width: 16, color: theme.colors.foreground}} />
                  </Tag>
                </View>
              </Card>

            ))}
          </Grid>
        </View>
        <View horizontal gap={8}>
          <Button
            variant="update"
            style={{flex: 1}}
            onClick={() => {actCUDHelper(updateImages, noti, 'update').then(() => setOpen(false))}}
          >Lưu</Button>
          <Button variant="close" style={{flex: 1}} onClick={() => setOpen(false)}>Đóng</Button>
        </View>
      </View>
    </Modal>
  )
}

export default ChapterImagesModal;
