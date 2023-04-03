import {useState} from 'react';
import { ReactNode } from 'react';
import { useTheme } from 'styled-components';
import Modal from 'react-modal';
import View from '../View';
import Button from '../Button';

function Info({children}: {children: ReactNode}) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const theme = useTheme();

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
      backgroundColor: theme.colors.secondaryBackground
    },
    overlay: {
      backgroundColor: `${theme.colors.background}99`
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={() => setIsOpen(false)}
      style={customStyles}
    >
      <View gap={16}>
        <View>
          {children}
       </View>
        <View horizontal gap={8}>
          <Button variant="tertiary" style={{flex: 1}} onClick={() => setIsOpen(false)}>Đóng</Button>
        </View>
      </View>
    </Modal>
  )
}

export default {Info};
