import { BrixelIcon, translateTo } from '@brixel-io/brixel-components';
import React, { useEffect, useState } from 'react';
const Tags = (props) => {
    const { lang, message, status, text, } = props;
    const [tag, setTag] = useState({});
    const getColor = () => {
        if (status === 'accepted' || status === 'completed') {
            return 'Green';
        }
        else if (status === 'pending') {
            return 'Yellow';
        }
        else if (status === 'pre-market') {
            return 'Blue';
        }
    };
    const getIcon = () => {
        if (status === 'accepted' || status === 'completed') {
            return 'check-thin';
        }
        else if (status === 'pending') {
            return 'clock';
        }
        return '';
    };
    useEffect(() => {
        setTag({ ...tag, text: text });
    }, [text]);
    return (React.createElement("div", { className: `bg${getColor()}100 txt${getColor()}600 brdRadius px-1 py-small-3 fsize-300 dis-f a-c` },
        getIcon() && (React.createElement(BrixelIcon, { className: "mr-1", color: getColor(), saturationTxt: 600, icon: getIcon() })),
        React.createElement("span", null, translateTo(message[status], lang))));
};
export default Tags;
