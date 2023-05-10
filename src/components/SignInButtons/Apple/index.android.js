import React from 'react';
import Log from '../../../libs/Log';
import ButtonBase from '../ButtonBase';
import AppleLogoIcon from '../../../../assets/images/signIn/apple-logo.svg';
import * as Session from '../../../libs/actions/Session';
import performAppleAuthRequest from './performAppleAuthRequest';

const AppleSignIn = () => {
    const handleSignIn = () => {
        performAppleAuthRequest()
            .then(token => Session.beginAppleSignIn(token))
            .catch((e) => {
                Log.error('Apple authentication failed', e);
            });
    };
    return <ButtonBase onPress={handleSignIn} icon={<AppleLogoIcon />} />;
};

AppleSignIn.displayName = 'AppleSignIn';

export default AppleSignIn;
