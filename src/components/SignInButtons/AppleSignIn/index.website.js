import React, {useEffect, useState} from 'react';
import {useIsFocused} from '@react-navigation/native';
import PropTypes from 'prop-types';
import Config from 'react-native-config';
import get from 'lodash/get';
import getUserLanguage from '../GetUserLanguage';
import * as Session from '../../../libs/actions/Session';
import Log from '../../../libs/Log';
import * as Environment from '../../../libs/Environment/Environment';
import CONST from '../../../CONST';

// react-native-config doesn't trim whitespace on iOS for some reason so we
// add a trim() call to lodashGet here to prevent headaches
const lodashGet = (config, key, defaultValue) => get(config, key, defaultValue).trim();

const requiredPropTypes = {
    isDesktopFlow: PropTypes.bool.isRequired,

    // Function to set the loading state of the parent component
    setLoading: PropTypes.func.isRequired,
};

const propTypes = {
    // Prop to indicate if this is the desktop flow or not
    isDesktopFlow: PropTypes.bool,

    // Function to set the loading state of the parent component
    setLoading: PropTypes.func,
};
const defaultProps = {
    isDesktopFlow: false,
    setLoading: () => {},
};

/**
 * Apple Sign In Configuration for Web
 */
const config = {
    clientId: lodashGet(Config, 'ASI_CLIENTID_OVERRIDE', CONST.APPLE_SIGN_IN_SERVICE_ID),
    scope: 'name email',
    // never used, but required for configuration
    redirectURI: lodashGet(Config, 'ASI_REDIRECTURI_OVERRIDE', CONST.APPLE_SIGN_IN_REDIRECT_URI),
    state: '',
    nonce: '',
    usePopup: true,
};

/**
 * Apple Sign In success and failure listeners
 * We also pass in the setLoading function to set the loading state
 * in the parent component
 */

const successListener = (event, setLoading) => {
    setLoading(true);
    const token = !Environment.isDevelopment() ? event.detail.id_token : lodashGet(Config, 'ASI_TOKEN_OVERRIDE', event.detail.id_token);
    Session.beginAppleSignIn(token);
};

const failureListener = (event, setLoading) => {
    if (!event.detail || event.detail.error === 'popup_closed_by_user') return null;
    setLoading(false);
    Log.warn(`Apple sign-in failed: ${event.detail}`);
};

/**
 * Apple Sign In button for Web
 * @returns {React.Component}
 */

function AppleSignInDiv({isDesktopFlow, setLoading}) {
    useEffect(() => {
        // `init` renders the button, so it must be called after the div is
        // first mounted
        window.AppleID.auth.init(config);
    }, []);
    //  Result listeners need to live within the focused item to avoid duplicate
    //  side effects on success and failure
    React.useEffect(() => {
        const successHandler = (event) => successListener(event, setLoading);
        const failureHandler = (event) => failureListener(event, setLoading);
        document.addEventListener('AppleIDSignInOnSuccess', successHandler);
        document.addEventListener('AppleIDSignInOnFailure', failureHandler);
        return () => {
            setLoading(false);
            document.removeEventListener('AppleIDSignInOnSuccess', successListener);
            document.removeEventListener('AppleIDSignInOnFailure', failureListener);
        };
    }, [setLoading]);

    return isDesktopFlow ? (
        <div
            id="appleid-signin"
            data-mode="center-align"
            data-type="continue"
            data-color="white"
            data-border="false"
            data-border-radius="50"
            data-width="279"
            data-height="52"
            style={{cursor: 'pointer'}}
        />
    ) : (
        <div
            id="appleid-signin"
            data-mode="logo-only"
            data-type="sign in"
            data-color="white"
            data-border="false"
            data-border-radius="50"
            data-size="40"
            style={{cursor: 'pointer'}}
        />
    );
}

AppleSignInDiv.propTypes = requiredPropTypes;

// The Sign in with Apple script may fail to render button if there are multiple
// of these divs present in the app, as it matches based on div id. So we'll
// only mount the div when it should be visible.
function SingletonAppleSignInButton({isDesktopFlow, setLoading}) {
    const isFocused = useIsFocused();
    if (!isFocused) {
        return null;
    }
    return (
        <AppleSignInDiv
            isDesktopFlow={isDesktopFlow}
            setLoading={setLoading}
        />
    );
}

SingletonAppleSignInButton.propTypes = requiredPropTypes;

function AppleSignIn({isDesktopFlow, setLoading}) {
    const [scriptLoaded, setScriptLoaded] = useState(false);
    useEffect(() => {
        if (window.appleAuthScriptLoaded) return;

        const localeCode = getUserLanguage();
        const script = document.createElement('script');
        script.src = `https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1//${localeCode}/appleid.auth.js`;
        script.async = true;
        script.onload = () => setScriptLoaded(true);

        document.body.appendChild(script);
    }, []);

    if (scriptLoaded === false) {
        return null;
    }

    return (
        <SingletonAppleSignInButton
            isDesktopFlow={isDesktopFlow}
            setLoading={setLoading}
        />
    );
}

AppleSignIn.propTypes = propTypes;
AppleSignIn.defaultProps = defaultProps;

export default AppleSignIn;
