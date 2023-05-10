import {appleAuthAndroid} from '@invertase/react-native-apple-authentication';
import Log from '../../../../libs/Log';
import APPLE_CONFIG from '../AppleConfig';

function performAppleAuthRequest() {
    appleAuthAndroid.configure({
        clientId: APPLE_CONFIG.CLIENT_ID,
        redirectUri: APPLE_CONFIG.REDIRECT_URI,
        responseType: appleAuthAndroid.ResponseType.ALL,
        scope: appleAuthAndroid.Scope.ALL,
    });
    return appleAuthAndroid.signIn()
        .then(response => response.id_token)
        .catch((e) => {
            Log.error('Request to sign in with Apple failed. Error: ', e);
            throw e;
        });
}

export default performAppleAuthRequest;
