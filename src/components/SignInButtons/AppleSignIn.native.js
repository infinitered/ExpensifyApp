import React from 'react';
import ButtonBase from './ButtonBase';
import AppleLogoIcon from '../../../assets/images/signIn/apple-logo.svg';
import * as Session from '../../libs/actions/Session';

const AppleSignIn = () => <ButtonBase onPress={Session.beginAppleSignIn} icon={<AppleLogoIcon />} />;

AppleSignIn.displayName = 'AppleSignIn';

export default AppleSignIn;
