import React, {useEffect} from 'react';
import {View, ActivityIndicator} from 'react-native';
import PropTypes from 'prop-types';
import {SafeAreaView} from 'react-native-safe-area-context';
import {withOnyx} from 'react-native-onyx';
import styles from '../../styles/styles';
import compose from '../../libs/compose';
import SignInPageLayout from './SignInPageLayout';
import withLocalize, {withLocalizePropTypes} from '../../components/withLocalize';
import Text from '../../components/Text';
import TextLink from '../../components/TextLink';
import AppleSignIn from '../../components/SignInButtons/AppleSignIn';
import withWindowDimensions, {windowDimensionsPropTypes} from '../../components/withWindowDimensions';
import ROUTES from '../../ROUTES';
import Navigation from '../../libs/Navigation/Navigation';
import CONST from '../../CONST';
import themeColors from '../../styles/themes/default';
import ONYXKEYS from '../../ONYXKEYS';

const propTypes = {
    /** Which sign in provider we are using */
    signInProvider: PropTypes.oneOf(['google', 'apple']).isRequired,

    /** State for the account */
    account: PropTypes.shape({
        /** Whether or not the user is loading */
        loading: PropTypes.bool,
    }),

    ...withLocalizePropTypes,

    ...windowDimensionsPropTypes,
};

const defaultProps = {
    account: {},
};

/**
 * Creates a function to capitalize the first letter of the providor
 * being passed to the translate function.
 */

const capitalize = (word) => word.charAt(0).toUpperCase() + word.slice(1);

/* Dedicated screen that the desktop app links to on the web app, as Apple/Google
 * sign-in cannot work fully within Electron, so we escape to web and redirect
 * to desktop once we have an Expensify auth token.
 */
function ThirdPartySignInPage(props) {
    const goBack = () => {
        Navigation.navigate(ROUTES.HOME);
    };

    useEffect(() => {
        console.log('ThirdPartySignInPage useEffect', props.account);
    }, [props.account]);

    return (
        <SafeAreaView style={[styles.signInPage]}>
            {props.account.isLoading ? (
                <View style={styles.thirdPartyLoadingContainer}>
                    <ActivityIndicator
                        size="large"
                        color={themeColors.spinner}
                    />
                </View>
            ) : (
                <SignInPageLayout
                    welcomeHeader={props.translate('welcomeText.getStarted')}
                    shouldShowWelcomeHeader
                >
                    {props.signInProvider === CONST.SIGN_IN_METHOD.APPLE ? <AppleSignIn isDesktopFlow /> : null}
                    <Text style={[styles.mt5]}>{props.translate('thirdPartySignIn.redirectToDesktopMessage')}</Text>
                    <Text style={[styles.mt5]}>{props.translate('thirdPartySignIn.goBackMessage', {provider: capitalize(props.signInProvider)})}</Text>
                    <TextLink
                        style={[styles.link]}
                        onPress={goBack}
                    >
                        {props.translate('common.goBack')}.
                    </TextLink>
                    <Text style={[styles.textExtraSmallSupporting, styles.mt5, styles.mb5]}>
                        {props.translate('thirdPartySignIn.signInAgreementMessage')}
                        <TextLink
                            style={[styles.textExtraSmallSupporting, styles.link]}
                            href=""
                        >
                            {` ${props.translate('common.termsOfService')}`}
                        </TextLink>
                        {` ${props.translate('common.and')} `}
                        <TextLink
                            style={[styles.textExtraSmallSupporting, styles.link]}
                            href=""
                        >
                            {props.translate('common.privacy')}
                        </TextLink>
                        .
                    </Text>
                </SignInPageLayout>
            )}
        </SafeAreaView>
    );
}

ThirdPartySignInPage.propTypes = propTypes;
ThirdPartySignInPage.defaultProps = defaultProps;
ThirdPartySignInPage.displayName = 'ThirdPartySignInPage';

export default compose(
    withLocalize,
    withWindowDimensions,
    withOnyx({
        account: {
            key: ONYXKEYS.ACCOUNT,
        },
    }),
)(ThirdPartySignInPage);
