import React from 'react';
import {View} from 'react-native';
import PropTypes from 'prop-types';
import {withOnyx} from 'react-native-onyx';
import _ from 'underscore';
import styles from '../styles/styles';
import Button from './Button';
import withLocalize, {withLocalizePropTypes} from './withLocalize';
import * as Session from '../libs/actions/Session';
import ONYXKEYS from '../ONYXKEYS';
import compose from '../libs/compose';
import Text from './Text';

const propTypes = {
    /* Onyx Props */

    /** The details about the account that the user is signing in with */
    account: PropTypes.shape({
        /** Error message to display when there is an account error returned */
        error: PropTypes.string,

        /** Whether or not a sign on form is loading (being submitted) */
        loading: PropTypes.bool,

        /** Flag to show spinner in Google Sign In button when user clicks on it */
        isGoogleSigningIn: PropTypes.bool,
    }),

    /** Callback to trigger when the button "Email or Phone Number" is pressed */
    onEmailorPhoneNumberPress: PropTypes.func.isRequired,

    ...withLocalizePropTypes,
};

const defaultProps = {
    account: {},
};

function SignInOptions(props) {
    const buttonDisabled = props.account.loading && props.account.isGoogleSigningIn;
    return (
        <>
            <View style={[styles.mt5]}>
                <Button
                    success
                    isDisabled={buttonDisabled}
                    text={props.translate('signInPage.emailOrPhoneNumber')}
                    onPress={props.onEmailorPhoneNumberPress}
                />
            </View>
            <View style={[styles.mt3]}>
                <Button
                    success
                    text={props.translate('signInPage.googleButton')}
                    isDisabled={buttonDisabled}
                    onPress={() => Session.signInGoogle()}
                />
            </View>
            {!_.isEmpty(props.account.error) && (
                <View style={[styles.mt3]}>
                    <Text style={[styles.formError]}>
                        {props.translate(props.account.error)}
                    </Text>
                </View>
            )}
        </>
    );
}

SignInOptions.propTypes = propTypes;
SignInOptions.defaultProps = defaultProps;

export default compose(
    withOnyx({
        account: {key: ONYXKEYS.ACCOUNT},
    }),
    withLocalize,
)(SignInOptions);
