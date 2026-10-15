import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
const RemoveTrailingSlash = ({ ...rest }) => {
    const location = useLocation();
    // If the last character of the url is '/'
    if (location.pathname.match('/.*/$')) {
        return React.createElement(Navigate, { replace: true, ...rest, to: {
                pathname: location.pathname.substr(0, location.pathname.length - 1),
                search: location.search,
            } });
    }
    else
        return null;
};
export default RemoveTrailingSlash;
