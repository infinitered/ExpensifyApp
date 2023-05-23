import React from 'react';
import PropTypes from 'prop-types';
import getCurrentUrl from '../currentUrl';
import ROUTES from '../../../ROUTES';

const propTypes = {
    /** If we have an authToken this is true */
    authenticated: PropTypes.bool.isRequired,
};

const AppNavigator = (props) => {
    if (!props.authenticated || getCurrentUrl().includes(ROUTES.THIRD_PARTY_SIGN_IN)) {
        const PublicScreens = require('./PublicScreens').default;
        return <PublicScreens />;
    }
    const AuthScreens = require('./AuthScreens').default;

    // These are the protected screens and only accessible when an authToken is present
    return <AuthScreens />;
};

AppNavigator.propTypes = propTypes;
AppNavigator.displayName = 'AppNavigator';
export default AppNavigator;
