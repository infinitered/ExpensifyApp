import React from 'react';
import {View} from 'react-native';
import withLocalize, {withLocalizePropTypes} from '../../withLocalize';
import ButtonBase from '../ButtonBase';
import GoogleLogoIcon from '../../../../assets/images/signIn/google-logo.svg';
import CONFIG from '../../../CONFIG';
import ROUTES from '../../../ROUTES';

const propTypes = {...withLocalizePropTypes};

const $googleButtonContainerStyle = {
    width: 40,
    height: 40,
    marginRight: 20,
};

//
const googleSignInWebRouteForDesktopFlow = `${CONFIG.EXPENSIFY.NEW_EXPENSIFY_URL}${ROUTES.APPLE_SIGN_IN}`;

const GoogleSignIn = (props) => (
    <View
        style={$googleButtonContainerStyle}
        accessibilityRole="button"
        accessibilityLabel={props.translate('common.signInWithGoogle')}
    >
        <ButtonBase
            onPress={() => {
                window.open(googleSignInWebRouteForDesktopFlow);
            }}
            icon={<GoogleLogoIcon />}
        />
    </View>
);

GoogleSignIn.displayName = 'GoogleSignIn';
GoogleSignIn.propTypes = propTypes;

export default withLocalize(GoogleSignIn);
