import React from 'react';
import ReactLoading from 'react-loading';

const Loading = ({ type, color, className }) => {
    return (
        <ReactLoading type={type} color={color} className={className} />
    )
}

export default Loading