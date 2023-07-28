import React, {useEffect} from 'react';
import 'react-quill/dist/quill.snow.css';
import ReactQuill from "react-quill";
import './style.scss';

function RichEditor({value, onChange} : {value?: string, onChange?: (value: string) => void}) {
  const [_value, setValue] = React.useState(value || '');

  useEffect(() => {
    setValue(value || '');
  }, [value]);

  return (
    <ReactQuill
      style={{flex: 1}}
      value={_value}
      modules={{
        toolbar: [
          [{ 'header': [1, 2, false] }],
          ['bold', 'italic', 'underline','strike', 'blockquote'],
          [{ align: [] }],
          [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
          ['link', 'image']
        ]
      }}
      formats={[
        'header',
        'bold', 'italic', 'underline', 'strike', 'blockquote',
        'align',
        'list', 'bullet', 'indent',
        'link', 'image'
      ]}
      onChange={(value) => {onChange && onChange(value); setValue(value)}}
    />
  )
}

export default RichEditor;
