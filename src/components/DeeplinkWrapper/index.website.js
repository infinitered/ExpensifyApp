import PropTypes from 'prop-types';
import {useRef, useState, useEffect} from 'react';
import Str from 'expensify-common/lib/str';
import * as Browser from '../../libs/Browser';
import ROUTES from '../../ROUTES';
import * as App from '../../libs/actions/App';
import CONST from '../../CONST';
import CONFIG from '../../CONFIG';
import shouldShowDeeplink from '../../libs/Navigation/shouldShowDeeplink';
import navigationRef from '../../libs/Navigation/navigationRef';
import Navigation from '../../libs/Navigation/Navigation';

const propTypes = {
    /** Children to render. */
    children: PropTypes.node.isRequired,
    isAuthenticated: PropTypes.bool.isRequired,
};

function isMacOSWeb() {
    return !Browser.isMobile() &&
    typeof navigator === 'object' &&
    typeof navigator.userAgent === 'string' &&
    /Mac/i.test(navigator.userAgent) &&
    !/Electron/i.test(navigator.userAgent);
}

function DeeplinkWrapper({children, isAuthenticated}) {
    const [currentScreen, setCurrentScreen] = useState();
    const [hasShownPrompt, setHasShownPrompt] = useState(false);
    const removeListener = useRef();
    useEffect(() => {
        // If we've shown the prompt and still have a listener registered,
        // remove the listener and reset its ref to undefined
        if (hasShownPrompt && removeListener.current !== undefined) {
          console.log("Removing listener")
          removeListener.current()
          removeListener.current = undefined;
        }

        console.log("Authenticated and going to re-add listener?", isAuthenticated)
        if (isAuthenticated === false) {
          setHasShownPrompt(false);
          Navigation.isNavigationReady().then(() => {
            // get initial route
            const initialRoute = navigationRef.current.getCurrentRoute()
            console.log("INIT", initialRoute)
            setCurrentScreen(initialRoute.name)
            
            removeListener.current = navigationRef.current.addListener('state', (event) => {
                // accessing routes here should be in a navigation lib fn in case the state shape changes in the future
                console.log("ROUTE: ", event.data.state.routes.slice(-1))
                setCurrentScreen(event.data.state.routes.slice(-1).name)
            })
          });
        }
    }, [hasShownPrompt, isAuthenticated]);
    useEffect(() => {
        CONFIG.ENVIRONMENT = CONST.ENVIRONMENT.STAGING;
        console.log("PATH: ", currentScreen)

        // Navigation state is not set up yet, don't know if we should show the deep link prompt or not
        if (currentScreen === undefined) {
          console.info("No current screen, not showing prompt")
          return;
        }

        // Extra guard, but removing the listener should prevent this from firing
        if (hasShownPrompt) {
          console.info("Have shown prompt, won't do again")
            return;
        }

        const shouldPrompt = shouldShowDeeplink(currentScreen, isAuthenticated);
        console.info("Should prompt?", shouldPrompt)

        if (shouldPrompt === false) {
            return;
        }

        // If the current url path is /transition..., meaning it was opened from oldDot, during this transition period:
        // 1. The user session may not exist, because sign-in has not been completed yet.
        // 2. There may be non-idempotent operations (e.g. create a new workspace), which obviously should not be executed again in the desktop app.
        // So we need to wait until after sign-in and navigation are complete before starting the deeplink redirect.
        if (Str.startsWith(window.location.pathname, Str.normalizeUrl(ROUTES.TRANSITION_BETWEEN_APPS))) {
          App.beginDeepLinkRedirectAfterTransition();
        } else {
          App.beginDeepLinkRedirect();
        }
        setHasShownPrompt(true);
    }, [currentScreen, hasShownPrompt, isAuthenticated]);

    return children;
}

DeeplinkWrapper.propTypes = propTypes;
export default DeeplinkWrapper;
