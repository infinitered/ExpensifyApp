import React from 'react';
import {View} from 'react-native';
import withLocalize, {withLocalizePropTypes} from '../../withLocalize';
import ButtonBase from '../ButtonBase';
import AppleLogoIcon from '../../../../assets/images/signIn/apple-logo.svg';
import CONFIG from '../../../CONFIG';
import ROUTES from '../../../ROUTES';
import styles from '../../../styles/styles';

const propTypes = {...withLocalizePropTypes};

const appleSignInWebRouteForDesktopFlow = `${CONFIG.EXPENSIFY.NEW_EXPENSIFY_URL}${ROUTES.APPLE_SIGN_IN}`;

const AppleSignIn = (props) => (
    <View
        style={styles.signInButtonContainer}
        accessibilityRole="button"
        accessibilityLabel={props.translate('common.signInWithApple')}
    >
        <ButtonBase
            onPress={() => {
                window.open(appleSignInWebRouteForDesktopFlow);
            }}
            icon={<AppleLogoIcon />}
        />
    </View>
);

AppleSignIn.displayName = 'AppleSignIn';
AppleSignIn.propTypes = propTypes;

export default withLocalize(AppleSignIn);
