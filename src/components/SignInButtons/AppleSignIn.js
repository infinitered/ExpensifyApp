/* eslint-disable rulesdir/prefer-early-return */

import React, { useRef } from 'react';
import {View} from 'react-native';
import withLocalize, {withLocalizePropTypes} from '../withLocalize';
import getUserLanguage from './getUserLanguage';

const propTypes = {...withLocalizePropTypes};

const $appleButtonContainerStyle = {
    width: 40, height: 40, marginRight: 20,
};

const htmlString = '<div style={{fontSize: "0"}} id="appleid-signin" data-mode="logo-only" data-color="white" data-border-radius="50" data-border="false" data-border-color="white" data-width="40" data-height="40" data-type="sign in" />';

const createHtml = () => {__html: htmlString}

const inner = {__html: htmlString}

const DivOnly = () => {
 return <div
 dangerouslySetInnerHTML={inner}
        />;
};

const AppleSignIn = (props) => {
  const [isScriptReady, setIsScriptReady] = React.useState(false);
  React.useLayoutEffect(() => {
    const localeCode = getUserLanguage();
    const script = document.createElement('script');
    script.src = `https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1//${localeCode}/appleid.auth.js`;
    script.async = true;
    script.onload = () => setIsScriptReady(true);
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
      setIsScriptReady(false);
    };
  }, []);

  React.useEffect(() => {
    if (isScriptReady) {
    console.log("CALLING INIT EFFECT")
      window.AppleID.auth.init({
        clientId: 'com.chat.expensify.chat',
        scope: 'name email',
        redirectURI: 'https://www.expensify.com/partners/apple/loginCallback',
        state: 'state',
        usePopup: true,
      });
    }
  }, [isScriptReady]);

  return (
    <View
      style={$appleButtonContainerStyle}
      accessibilityRole="button"
      accessibilityLabel={props.translate('common.signInWithApple')}>
      <DivOnly />
    </View>
  );
};

AppleSignIn.displayName = 'AppleSignIn';
AppleSignIn.propTypes = propTypes;

export default withLocalize(AppleSignIn);
