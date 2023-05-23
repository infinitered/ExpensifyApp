import React from 'react';
import {appleAuthAndroid} from '@invertase/react-native-apple-authentication';
import ButtonBase from '../ButtonBase';
import AppleLogoIcon from '../../../../assets/images/signIn/apple-logo.svg';
import * as Session from '../../../libs/actions/Session';

const config = {
    clientId: 'com.chat.expensify.chat.AppleSignIn',
    redirectUri: 'https://new.expensify.com/appleauth',
    responseType: appleAuthAndroid.ResponseType.ALL,
    scope: appleAuthAndroid.Scope.ALL,
};

function signInWithApple() {
    appleAuthAndroid.configure(config);
    appleAuthAndroid
        .signIn()
        .then((response) => Session.beginAppleSignIn(response.id_token))
        .catch((e) => {
            console.error('Request to sign in with Apple failed. Error: ', e);
            throw e;
        });
}

function AppleSignIn() {
    return (
        <ButtonBase
            onPress={signInWithApple}
            icon={<AppleLogoIcon />}
        />
    );
}

AppleSignIn.displayName = 'AppleSignIn';

export default AppleSignIn;
