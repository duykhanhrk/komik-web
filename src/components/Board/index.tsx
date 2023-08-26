import {useEffect, useState} from 'react';
import { ReactNode } from 'react';
import { useTheme } from 'styled-components';
import Modal from 'react-modal';
import View from '../View';
import Button from '../Button';
import Text from '../Text';

interface BoardProps {
  children?: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

function Board({children, open, onOpenChange}: BoardProps) {
    const [isOpen, setIsOpen] = useState<boolean>(open || false);

    const theme = useTheme();

    useEffect(() => {
        setIsOpen(open || false);
    }, [open]);

    useEffect(() => {
        if (onOpenChange) {
            onOpenChange(isOpen);
        }
    }, [isOpen]);

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
            </View>
        </Modal>
    );
}

interface ConfirmationBoardProps extends BoardProps {
  title?: string;
  message?: string;
  onCancel?: () => void;
  onConfirm?: () => void;

}

function ConfirmationBoard(props: ConfirmationBoardProps) {
    const {title, message, onCancel, onConfirm, ...otherProps} = props;

    return (
        <Board {...otherProps}>
            <View gap={16}>
                <View gap={4}>
                    {title && <Text variant="title">{title}</Text>}
                    {message && <Text>{message}</Text>}
                </View>
                <View horizontal gap={8}>
                    <Button flex={1} variant="primary" onClick={onConfirm}>Xác nhận</Button>
                    <Button flex={1} variant="tertiary" onClick={onCancel}>Hủy</Button>
                </View>
            </View>
        </Board>
    );
}

export default Board;
export {ConfirmationBoard};
