import View from '../View';
import DatePicker from 'react-date-picker';
import 'react-date-picker/dist/DatePicker.css';
import 'react-calendar/dist/Calendar.css';
import './style.scss';
import React, {useEffect, useState} from 'react';
import {Icon} from '@iconify/react';
import {useTheme} from 'styled-components';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  value?: Date;
  onValueChange?: (value: Date) => void;
  variant?: 'primary' | 'secondary' | 'tertiary' | 'quaternary' | 'quinary';
  shadowEffect?: boolean;
  flex?: number;
}

function DateInput(props: Props) {
  const {value, variant, shadowEffect, flex, onValueChange, style, ...otherProps} = props;

  const [_value, setValue] = useState(value || new Date());

  const theme = useTheme();

  useEffect(() => {
    setValue(props.value || new Date());
  }, [props.value]);

  return (
    <View
      flex={flex}
      variant={variant}
      shadowEffect={shadowEffect}
      style={{height: 40, borderRadius: 8, ...style}}
      {...otherProps}
    >
      <DatePicker
        locale="vi"
        format="dd/MM/yyyy"
        calendarIcon={<Icon icon={'mingcute:calendar-month-line'} style={{color: theme.colors.foreground, height: 20, width: 20}}/>}
        clearIcon={<Icon icon={'mingcute:close-line'} style={{color: theme.colors.foreground, height: 20, width: 20}}/>}
        value={_value}
        onChange={(v) => {
          onValueChange && onValueChange((v instanceof Date) ? v : new Date());
          setValue((v instanceof Date) ? v : new Date());
        }}
      />
    </View>
  );
}

export default DateInput;
