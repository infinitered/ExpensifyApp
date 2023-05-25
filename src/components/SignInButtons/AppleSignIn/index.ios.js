import React from 'react';
import appleAuth from '@invertase/react-native-apple-authentication';
import ButtonBase from '../ButtonBase';
import AppleLogoIcon from '../../../../assets/images/signIn/apple-logo.svg';
import * as Session from '../../../libs/actions/Session';

function signInWithApple() {
    return appleAuth
        .performRequest({
            requestedOperation: appleAuth.Operation.LOGIN,

            // FULL_NAME must come first, see https://github.com/invertase/react-native-apple-authentication/issues/293
            requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
        })
        .then((response) => Promise.all([response, appleAuth.getCredentialStateForUser(response.user)]))
        .then(([response, credentialState]) => {
            if (credentialState !== appleAuth.State.AUTHORIZED) {
                throw new Error(`Could not find authorized credential.
                  Original response: ${JSON.stringify(response, null, 2)}.
                  Credential state: ${JSON.stringify(credentialState, null, 2)}
                  `);
            }
            return response.identityToken;
        })
        .then((token) => Session.beginAppleSignIn(token))
        .catch((e) => console.error('Apple credential lookup failed: ', e));
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
