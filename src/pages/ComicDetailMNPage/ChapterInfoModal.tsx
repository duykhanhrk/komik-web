import {Button, Input, Text, View} from "@components";
import {useTheme} from "styled-components";
import {useNotifications} from "reapop";
import {useMutation} from "react-query";
import {Chapter, ComicMNService} from "@services";
import {useEffect, useState} from "react";
import {actCUDHelper, deleteConfirmHelper} from "@helpers/CUDHelper";
import Modal from 'react-modal';

interface ChapterInfoModalProps {
  comic_id: number;
  _data?: Chapter;
  mode?: 'create' | 'update' | 'close';
  onModeChange?: (mode: 'create' | 'update' | 'close') => void;
  onSaveSuccess?: () => void;
}

function ChapterInfoModal({
  _data,
  comic_id,
  mode,
  onModeChange,
  onSaveSuccess
}: ChapterInfoModalProps
) {
  const [modalMode, setModalMode] = useState<'create' | 'update' | 'close'>(mode || 'close');
  const [data, setData] = useState<Chapter>(_data || {name: '', free: false});

  const noti = useNotifications();
  const theme = useTheme();

  useEffect(() => {
    setModalMode(mode || 'close');
  }, [mode])

  useEffect(() => {
    if (onModeChange) {
      onModeChange(modalMode);
    }
  }, [modalMode])

  useEffect(() => {
    setData(_data || {name: '', free: false});
  }, [_data])

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

  const create = useMutation({
    mutationFn: () => ComicMNService.createChapterAsync(comic_id, data),
    onSettled: onSaveSuccess
  })

  const update = useMutation({
    mutationFn: () => ComicMNService.updateChapterAsync(comic_id, data),
    onSettled: onSaveSuccess
  });

  const remove = useMutation({
    mutationFn: () => ComicMNService.deleteChapterAsync(comic_id, data.id!),
    onSettled: onSaveSuccess
  });

  return (
    <Modal
      isOpen={modalMode === 'create' || modalMode === 'update'}
      onRequestClose={() => setModalMode('close')}
      style={customStyles}
    >
      <View gap={16} animation="slideTopIn">
        <View gap={8}>
          <Text variant="title">Tên</Text>
          <Input
            variant="tertiary"
            placeholder="Tên"
            value={data.name}
            onChange={(e) => setData({...data, name: e.target.value})}
          />
        </View>
        <View gap={8}>
          <Text variant="title">Miễn phí</Text>
          <Button
            variant="tertiary"
            onClick={() => setData({...data, free: !data.free})}
          >
            {data.free ? 'Miễn phí' : 'Tính phí'}
          </Button>
        </View>
        <View horizontal gap={8}>
          {modalMode === 'update' &&
          <Button
            variant="primary"
            style={{flex: 1}}
            onClick={() => {
              deleteConfirmHelper({
                noti,
                onConfirm: async () => {
                  actCUDHelper(remove, noti, 'delete').then(() => setModalMode('close'))
                }
              })
            }}
          >Xóa</Button>
          }
          <Button
            variant="primary"
            style={{flex: 1}}
            onClick={() => {
              modalMode === 'create' ?
                actCUDHelper(create, noti, 'create').then(() => setModalMode('close'))
              :
                actCUDHelper(update, noti, 'update').then(() => setModalMode('close'))
            }}
          >{modalMode === 'create' ? 'Tạo' : 'Cập nhật'}</Button>
          <Button variant="tertiary" style={{flex: 1}} onClick={() => setModalMode('close')}>Đóng</Button>
        </View>
      </View>
    </Modal>
  )
}

export default ChapterInfoModal;
