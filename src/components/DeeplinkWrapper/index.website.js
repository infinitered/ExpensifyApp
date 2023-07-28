import PropTypes from 'prop-types';
import {PureComponent, useState, useEffect, useLayoutEffect} from 'react';
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
};

function isMacOSWeb() {
    return !Browser.isMobile() &&
    typeof navigator === 'object' &&
    typeof navigator.userAgent === 'string' &&
    /Mac/i.test(navigator.userAgent) &&
    !/Electron/i.test(navigator.userAgent);
}

console.log("HI")
function DeeplinkWrapper({children}) {
    const [currentScreen, setCurrentScreen] = useState();
    const [currentPath, setCurrentPath] = useState();
    useEffect(() => {
        Navigation.isNavigationReady().then(() => {
          console.log("TRYING TO ADD");

          console.log("REF? ", navigationRef, navigationRef.current)
          // get initial route
          if (currentScreen === undefined) {
            const initialRoute = navigationRef.current.getCurrentRoute()
            console.log("INIT", initialRoute)
            setCurrentScreen(initialRoute.name)
            setCurrentPath(initialRoute.path)
          }
          
          navigationRef.current.addListener('state', (event) => {
              console.log("EVENT: ", JSON.stringify(event, null, 2))
              // accessing routes here should be in a navigation lib fn in case the state shape changes in the future
              // can't remember if I want first or last item in list
              setCurrentScreen(event.data.state.routes[0].name)
              setCurrentPath(event.data.state.routes[0].path)
          })
        });
    }, []);
    useEffect(() => {
        CONFIG.ENVIRONMENT = CONST.ENVIRONMENT.STAGING;
        console.log("Current route", currentScreen, currentPath);
        const onDenyListRoute = !shouldShowDeeplink();

        if (onDenyListRoute) {
            return;
        }

        // If the current url path is /transition..., meaning it was opened from oldDot, during this transition period:
        // 1. The user session may not exist, because sign-in has not been completed yet.
        // 2. There may be non-idempotent operations (e.g. create a new workspace), which obviously should not be executed again in the desktop app.
        // So we need to wait until after sign-in and navigation are complete before starting the deeplink redirect.
        if (Str.startsWith(window.location.pathname, Str.normalizeUrl(ROUTES.TRANSITION_BETWEEN_APPS))) {
            App.beginDeepLinkRedirectAfterTransition();
            return;
        }
        App.beginDeepLinkRedirect();
    }, [currentScreen]);
    return children;
}

DeeplinkWrapper.propTypes = propTypes;
export default DeeplinkWrapper;
