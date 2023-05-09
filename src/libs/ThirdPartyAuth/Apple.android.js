import {appleAuthAndroid} from '@invertase/react-native-apple-authentication';
import Log from '../Log';

function performAppleAuthRequest() {
    appleAuthAndroid.configure({
        clientId: 'com.expensify.expensifylite.AppleSignIn',
        redirectUri: 'https://www.expensify.com/partners/apple/loginCallback',
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
