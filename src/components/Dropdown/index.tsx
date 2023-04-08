import {Icon} from "@iconify/react";
import React, {CSSProperties, ReactNode, useEffect, useRef, useState} from "react";
import styled from "styled-components";
import Button from "../Button";
import View from "../View";

const Container = styled.div`
  position: relative;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  border-radius: 8px;
  background-color: ${props => props.theme.colors.secondaryBackground};
  overflow: hidden;
  padding: 8px;
  min-height: 140px;
  max-height: 540px;
  width: 340px;
  box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
`;

const Item = styled.div`
  display: flex;
  flex-direction: row;
  height: 40px;
  align-items: center;
  justify-content: left;
  background-color: #0000FF;
`;

interface GroupProps {
  open?: string;
  dropdowns?: Array<{
    name: string,
    content?: ReactNode;
    buttonContent?: ({isActive}: {isActive: boolean}) => ReactNode;
    buttonStyle?: CSSProperties;
    contentStyle?: CSSProperties;
  }>;

  style?: CSSProperties;
  buttonStyle?: CSSProperties;
  contentStyle?: CSSProperties;
}

function Group(props: GroupProps) {
  const [open, setOpen] = useState(props.open);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen('');
      }
    };

    document.addEventListener('click', handleOutsideClick);

    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, [dropdownRef]);

  return (
    <Container ref={dropdownRef} style={props.style}>
      <View horizontal gap={8}>
        {props.dropdowns?.map((item) => (
          <Button
            style={{...props.buttonStyle, ...item.buttonStyle}}
            onClick={() => setOpen(open !== item.name ? item.name : '')}>
            {item.buttonContent && item.buttonContent({isActive: open === item.name})}
          </Button>
        ))}
      </View>
      {props.dropdowns?.map((item) => (
        <>
          {open === item.name &&
            <Content style={{...props.contentStyle, ...item.contentStyle}}>
              {item.content}
            </Content>
          }
        </>
      ))}
    </Container>
  )
}

interface SingleProps {
  isOpen?: boolean;
  
  content?: ReactNode;
  buttonContent?: ReactNode;

  style?: CSSProperties;
  buttonStyle?: CSSProperties;
  contentStyle?: CSSProperties;
}

function Single(props: SingleProps) {
  const [isOpen, setIsOpen] = useState(props.isOpen);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('click', handleOutsideClick);

    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, [dropdownRef]);

  return (
    <Container ref={dropdownRef} style={props.style}>
      <Button style={props.buttonStyle} onClick={() => setIsOpen(!isOpen)}>
          {props.buttonContent}
      </Button>
      {isOpen &&
        <Content style={props.contentStyle}>
          {props.content}
        </Content>
      }
    </Container>
  )
}

interface SelectionListDrops<T> {
  _data: Array<T>;
  renderItem: (item: T, index: number) => ReactNode;
  isOpen?: boolean;
  buttonContent?: (selectedItem?: T) => ReactNode | ReactNode;
  style?: CSSProperties;
  buttonStyle?: CSSProperties;
  contentStyle?: CSSProperties;
  onItemSelected?: (selectedItem?: T) => void;
  selectedItem?: T;
}

function SelectionList<T>(props: SelectionListDrops<T>) {
  const [isOpen, setIsOpen] = useState(props.isOpen);
  const [selectedItem, setSelectedItem] = useState<T | undefined>(props.selectedItem);

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('click', handleOutsideClick);

    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, [dropdownRef]);

  console.log('render dropdown')

  return (
    <Container ref={dropdownRef} style={props.style}>
      <Button style={{width: '100%', ...props.buttonStyle}} onClick={() => setIsOpen(!isOpen)}>
        <View flex={1}>
          {props.buttonContent ? props.buttonContent(selectedItem) : null}
        </View>
        <Icon icon={"mingcute:down-line"} style={{height: 20, width: 20}} />
      </Button>
      {isOpen &&
        <Content style={{
            left: 0,
            right: 0,
            width: 'auto',
            minHeight: 'auto',
            ...props.contentStyle
          }}
        >
          { props._data.map((item: T, index: number) => (
              <View
                onClick={() => {
                  setSelectedItem(item);
                  setIsOpen(false);
                  if (props.onItemSelected) {
                    props.onItemSelected(item);
                  }
                }}
              >
                {props.renderItem(item, index)}
              </View>
          ))}
        </Content>
      }
    </Container>
  )
}

export default { Container, Content, Item, SelectionList, Single, Group };
