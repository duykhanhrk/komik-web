import {Button, Input, Text, View} from '@components';
import {Icon} from '@iconify/react';
import {Author, AuthorMNService} from '@services';
import React, {useEffect, useState} from 'react';
import {useMutation, UseMutationResult} from 'react-query';
import {useNotifications} from 'reapop';
import {useTheme} from 'styled-components';
import Modal from 'react-modal';
import {actCUDHelper} from '@helpers/CUDHelper';
import moment from 'moment';

const defaultAuthor = {
  firstname: '',
  lastname: '',
  birthday: new Date('2001-01-01'),
  introduction: ''
};

function AuthorModal({_data, query, mode, onModeChange}: {
  _data?: Author,
  query: any,
  mode?: 'create' | 'update' | 'close',
  onModeChange?: (mode: 'create' | 'update' | 'close') => void
}) {
  const [data, setData] = useState<Author>(_data || defaultAuthor);
  const [modalMode, setModalMode] = useState<'create' | 'update' | 'close'>('close');

  const theme = useTheme();
  const noti = useNotifications();

  const create: UseMutationResult = useMutation({
    mutationFn: () => AuthorMNService.createAsync(data),
    onSettled: query.refetch
  });

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

  useEffect(() => {
    setData(_data || defaultAuthor);
  }, [_data]);

  useEffect(() => {
    setModalMode(mode || 'close');
  }, [mode]);

  return (
    <Modal
      isOpen={modalMode !== 'close'}
      onRequestClose={() => setModalMode('close')}
      style={customStyles}
    >
      <View gap={16} animation="slideTopIn">
        <View gap={16}>
          <View gap={16} horizontal>
            <View gap={8}>
              <Text variant="title">Họ</Text>
              <Input
                variant="tertiary"
                placeholder="Họ"
                value={data.lastname}
                onChange={(e) => setData({...data, lastname: e.target.value})}
              />
            </View>
            <View gap={8}>
              <Text variant="title">Tên</Text>
              <Input
                variant="tertiary"
                placeholder="Tên"
                value={data.firstname}
                onChange={(e) => setData({...data, firstname: e.target.value})}
              />
            </View>
          </View>
          <View gap={16} horizontal>
            <View flex={1} gap={8}>
              <Text variant="title">Sinh nhật</Text>
              <Input
                variant="tertiary"
                placeholder="Sinh nhật"
                type="date"
                value={moment(data.birthday).format('YYYY-MM-DD')}
                onChange={(e) => setData({...data, birthday: new Date(e.target.value)})}
                style={{flex: 1}}
              />
            </View>
          </View>
        </View>
        <View horizontal gap={8}>
          <Button
            variant="primary"
            style={{flex: 1, gap: 8}}
            onClick={() => {
              actCUDHelper(create, noti, 'create').then(() => {onModeChange && onModeChange('close'); setModalMode('close');}).catch(() => {});
            }}>
            <Icon icon={'mingcute:save-line'} style={{height: 20, width: 20, color: theme.colors.themeForeground}} />
            <Text variant="inhirit">{modalMode === 'create' ? 'Tạo' : 'Cập nhật'}</Text>
          </Button>
          <Button variant="tertiary" style={{flex: 1}} onClick={() => {onModeChange && onModeChange('close'); setModalMode('close');}}>Đóng</Button>
        </View>
      </View>
    </Modal>
  );
}

export default AuthorModal;
