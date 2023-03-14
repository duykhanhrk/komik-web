import {Icon} from '@iconify/react';
import React from 'react';
import Modal from 'react-modal';
import {useTheme} from 'styled-components';
import Button from '../Button';
import Text from '../Text';
import View from '../View';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

Modal.setAppElement('#root');

function Test() {
  const [isOpen, setIsOpen] = React.useState(false);
  const theme = useTheme();

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      zIndex: 66,
      backgroundColor: theme.colors.secondaryBackground,
      borderWidth: 0,
      boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px',
      padding: 0
    },
    overlay: {
      zIndex: 64,
      backgroundColor: theme.colors.background + 'DD',
    }
  };

  return (
    <View>
      <Button onClick={openModal}>Open Modal</Button>
      <Modal
        isOpen={isOpen}
        onRequestClose={closeModal}
        style={customStyles}
      >
        <View horizontal style={{justifyContent: 'flex-end', alignItems: 'center'}}>
          <Text numberOfLines={1} variant={'medium-title'} style={{flex: 1, paddingLeft: 8}}>Hello wold</Text>
          <Button variant='transparent'>
            <Icon icon={'mingcute:close-line'} style={{height: 24, width: 24}} />
          </Button>
        </View>
        <View style={{padding: 8}}>
        </View>
      </Modal>
    </View>
  )
}

export default {Test};
