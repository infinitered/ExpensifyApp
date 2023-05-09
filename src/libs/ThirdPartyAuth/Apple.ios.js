import appleAuth from '@invertase/react-native-apple-authentication';
import Log from '../Log';

function performAppleAuthRequest() {
    return appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,

        // FULL_NAME must come first, see https://github.com/invertase/react-native-apple-authentication/issues/293
        requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
    })
        .then(response => appleAuth.getCredentialStateForUser(response.user)
            .then((credentialState) => {
                if (credentialState !== appleAuth.State.AUTHORIZED) {
                    Log.error('Authentication failed. Original response: ', response);
                    throw new Error('Authentication failed');
                }
                return response;
            }));
}

export default performAppleAuthRequest;
