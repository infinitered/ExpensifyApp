import React from 'react';
import {GoogleSignin, statusCodes} from '@react-native-google-signin/google-signin';
import Log from '../../../libs/Log';
import ButtonBase from '../ButtonBase';
import GoogleLogoIcon from '../../../../assets/images/signIn/google-logo.svg';
import * as Session from '../../../libs/actions/Session';

GoogleSignin.configure({
    webClientId: '921154746561-gpsoaqgqfuqrfsjdf8l7vohfkfj7b9up.apps.googleusercontent.com',
    iosClientId: '921154746561-s3uqn2oe4m85tufi6mqflbfbuajrm2i3.apps.googleusercontent.com',
    offlineAccess: false,
});

function googleSignInRequest() {
    // Is this supposed to be signOut or revokeAccess? https://github.com/infinitered/ExpensifyApp/commit/73a93a93b5dc3af843355434678f8d003efe8c95#diff-fccb230c0b7c08f7b8c32bfc7ab84ac8f7855d39f639226b02d40cde7f78efe5R12
    // revokeAccess doesn't work for me
    GoogleSignin.signOut()
        .then(() => GoogleSignin.signIn())
        .then((response) => {
            return Session.beginGoogleSignIn(response.idToken);
        })
        .catch((error) => {
            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                Log.error('Google sign in cancelled', true, {error});
                console.log('Google sign in cancelled', error);
            } else if (error.code === statusCodes.IN_PROGRESS) {
                Log.error('Google sign in already in progress', true, {error});
                console.log('Google sign in already in progress', error);
            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                Log.error('Google play services not available or outdated', true, {error});
                console.log('Google play services not available or outdated', error);
            } else {
                Log.error('Google sign in error', true, {error});
                console.log('Google sign in error', error);
            }
        });
}

function GoogleSignIn() {
    return (
        <ButtonBase
            onPress={googleSignInRequest}
            icon={<GoogleLogoIcon />}
        />
    );
}

export default GoogleSignIn;
