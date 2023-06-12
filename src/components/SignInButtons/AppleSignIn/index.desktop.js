import React from 'react';
import {View} from 'react-native';
import ButtonBase from '../ButtonBase';
import CONFIG from '../../../CONFIG';
import ROUTES from '../../../ROUTES';
import styles from '../../../styles/styles';
import CONST from '../../../CONST';

const appleSignInWebRouteForDesktopFlow = `${CONFIG.EXPENSIFY.NEW_EXPENSIFY_URL}${ROUTES.APPLE_SIGN_IN}`;

/**
 * Apple Sign In button for desktop flow
 * @returns {React.Component}
 */

const AppleSignIn = () => (
    <View style={styles.appleButtonContainer}>
        <ButtonBase
            provider={CONST.SIGN_IN_METHOD.APPLE}
            onPress={() => {
                window.open(appleSignInWebRouteForDesktopFlow);
            }}
        />
    </View>
);

AppleSignIn.displayName = 'AppleSignIn';

export default AppleSignIn;
