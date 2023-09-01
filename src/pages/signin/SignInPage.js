import Str from 'expensify-common/lib/str';
import PropTypes from 'prop-types';
import React, {useEffect, useRef} from 'react';
import {View} from 'react-native';
import {withOnyx} from 'react-native-onyx';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import _ from 'underscore';
import ONYXKEYS from '../../ONYXKEYS';
import Button from '../../components/Button';
import useLocalize from '../../hooks/useLocalize';
import useWindowDimensions from '../../hooks/useWindowDimensions';
import * as Localize from '../../libs/Localize';
import Log from '../../libs/Log';
import Performance from '../../libs/Performance';
import Share from '../../libs/Share';
import * as App from '../../libs/actions/App';
import * as DemoActions from '../../libs/actions/DemoActions';
import * as StyleUtils from '../../styles/StyleUtils';
import styles from '../../styles/styles';
import EmailDeliveryFailurePage from './EmailDeliveryFailurePage';
import LoginForm from './LoginForm';
import SignInPageLayout from './SignInPageLayout';
import UnlinkLoginForm from './UnlinkLoginForm';
import ValidateCodeForm from './ValidateCodeForm';

const propTypes = {
    /** The details about the account that the user is signing in with */
    account: PropTypes.shape({
        /** Error to display when there is an account error returned */
        errors: PropTypes.objectOf(PropTypes.string),

        /** Whether the account is validated */
        validated: PropTypes.bool,

        /** The primaryLogin associated with the account */
        primaryLogin: PropTypes.string,

        /** Does this account require 2FA? */
        requiresTwoFactorAuth: PropTypes.bool,

        /** Is this account having trouble receiving emails */
        hasEmailDeliveryFailure: PropTypes.bool,
    }),

    /** The credentials of the person signing in */
    credentials: PropTypes.shape({
        login: PropTypes.string,
        twoFactorAuthCode: PropTypes.string,
        validateCode: PropTypes.string,
    }),

    /** Whether or not the sign in page is being rendered in the RHP modal */
    isInModal: PropTypes.bool,

    /** Information about any currently running demos */
    demoInfo: PropTypes.shape({
        saastr: PropTypes.shape({
            isBeginningDemo: PropTypes.bool,
        }),
    }),
};

const defaultProps = {
    account: {},
    credentials: {},
    isInModal: false,
    demoInfo: {},
};

/**
 * @param {Boolean} hasLogin
 * @param {Boolean} hasValidateCode
 * @param {Boolean} isPrimaryLogin
 * @param {Boolean} isAccountValidated
 * @param {Boolean} hasEmailDeliveryFailure
 * @returns {Object}
 */
function getRenderOptions({hasLogin, hasValidateCode, hasAccount, isPrimaryLogin, isAccountValidated, hasEmailDeliveryFailure}) {
    const shouldShowLoginForm = !hasLogin && !hasValidateCode;
    const shouldShowEmailDeliveryFailurePage = hasLogin && hasEmailDeliveryFailure;
    const isUnvalidatedSecondaryLogin = hasLogin && !isPrimaryLogin && !isAccountValidated && !hasEmailDeliveryFailure;
    const shouldShowValidateCodeForm = hasAccount && (hasLogin || hasValidateCode) && !isUnvalidatedSecondaryLogin && !hasEmailDeliveryFailure;
    const shouldShowWelcomeHeader = shouldShowLoginForm || shouldShowValidateCodeForm || isUnvalidatedSecondaryLogin;
    const shouldShowWelcomeText = shouldShowLoginForm || shouldShowValidateCodeForm;
    const shouldShowSignInToShare = !hasLogin && Share.isShareExtension;
    return {
        shouldShowLoginForm,
        shouldShowEmailDeliveryFailurePage,
        shouldShowUnlinkLoginForm: isUnvalidatedSecondaryLogin,
        shouldShowValidateCodeForm,
        shouldShowWelcomeHeader,
        shouldShowWelcomeText,
        shouldShowSignInToShare,
    };
}

function SignInPage({credentials, account, isInModal, demoInfo}) {
    const {translate, formatPhoneNumber} = useLocalize();
    const {isSmallScreenWidth} = useWindowDimensions();
    const shouldShowSmallScreen = isSmallScreenWidth || isInModal;
    const safeAreaInsets = useSafeAreaInsets();
    const signInPageLayoutRef = useRef();

    useEffect(() => Performance.measureTTI(), []);
    useEffect(() => {
        App.setLocale(Localize.getDevicePreferredLocale());
    }, []);

    const {
        shouldShowEmailDeliveryFailurePage,
        shouldShowLoginForm,
        shouldShowSignInToShare,
        shouldShowUnlinkLoginForm,
        shouldShowValidateCodeForm,
        shouldShowWelcomeHeader,
        shouldShowWelcomeText,
    } = getRenderOptions({
        hasLogin: Boolean(credentials.login),
        hasValidateCode: Boolean(credentials.validateCode),
        hasAccount: !_.isEmpty(account),
        isPrimaryLogin: !account.primaryLogin || account.primaryLogin === credentials.login,
        isAccountValidated: Boolean(account.validated),
        hasEmailDeliveryFailure: Boolean(account.hasEmailDeliveryFailure),
    });

    let welcomeHeader = '';
    let welcomeText = '';
    const {customHeadline, customHeroBody} = DemoActions.getCustomTextForDemo(demoInfo);
    const headerText = customHeadline || translate('login.hero.header');
    if (shouldShowSignInToShare) {
        welcomeHeader = translate('welcomeText.signInToShare');
        welcomeText = translate('welcomeText.getStarted');
    } else if (shouldShowLoginForm) {
        welcomeHeader = isSmallScreenWidth ? headerText : translate('welcomeText.getStarted');
        welcomeText = isSmallScreenWidth ? translate('welcomeText.getStarted') : '';
    } else if (shouldShowValidateCodeForm) {
        if (account.requiresTwoFactorAuth) {
            // We will only know this after a user signs in successfully, without their 2FA code
            welcomeHeader = isSmallScreenWidth ? '' : translate('welcomeText.welcomeBack');
            welcomeText = translate('validateCodeForm.enterAuthenticatorCode');
        } else {
            const userLogin = Str.removeSMSDomain(credentials.login || '');

            // replacing spaces with "hard spaces" to prevent breaking the number
            const userLoginToDisplay = Str.isSMSLogin(userLogin) ? formatPhoneNumber(userLogin).replace(/ /g, '\u00A0') : userLogin;
            if (account.validated) {
                welcomeHeader = shouldShowSmallScreen ? '' : translate('welcomeText.welcomeBack');
                welcomeText = shouldShowSmallScreen
                    ? `${translate('welcomeText.welcomeBack')} ${translate('welcomeText.welcomeEnterMagicCode', {login: userLoginToDisplay})}`
                    : translate('welcomeText.welcomeEnterMagicCode', {login: userLoginToDisplay});
            } else {
                welcomeHeader = shouldShowSmallScreen ? '' : translate('welcomeText.welcome');
                welcomeText = shouldShowSmallScreen
                    ? `${translate('welcomeText.welcome')} ${translate('welcomeText.newFaceEnterMagicCode', {login: userLoginToDisplay})}`
                    : translate('welcomeText.newFaceEnterMagicCode', {login: userLoginToDisplay});
            }
        }
    } else if (shouldShowUnlinkLoginForm || shouldShowEmailDeliveryFailurePage) {
        welcomeHeader = shouldShowSmallScreen ? headerText : translate('welcomeText.welcomeBack');

        // Don't show any welcome text if we're showing the user the email delivery failed view
        if (shouldShowEmailDeliveryFailurePage) {
            welcomeText = '';
        }
    } else {
        Log.warn('SignInPage in unexpected state!');
    }

    return (
        // Bottom SafeAreaView is removed so that login screen svg displays correctly on mobile.
        // The SVG should flow under the Home Indicator on iOS.
        <View style={[styles.signInPage, StyleUtils.getSafeAreaPadding({...safeAreaInsets, bottom: 0}, 1)]}>
            <SignInPageLayout
                welcomeHeader={welcomeHeader}
                welcomeText={welcomeText}
                shouldShowWelcomeHeader={shouldShowWelcomeHeader || !isSmallScreenWidth || !isInModal}
                shouldShowWelcomeText={shouldShowWelcomeText}
                ref={signInPageLayoutRef}
                isInModal={isInModal}
                customHeadline={customHeadline}
                customHeroBody={customHeroBody}
            >
                {/* LoginForm must use the isVisible prop. This keeps it mounted, but visually hidden
                    so that password managers can access the values. Conditionally rendering this component will break this feature. */}
                <LoginForm
                    isVisible={shouldShowLoginForm && !shouldShowSignInToShare}
                    blurOnSubmit={account.validated === false}
                    scrollPageToTop={signInPageLayoutRef.current && signInPageLayoutRef.current.scrollPageToTop}
                />
                {shouldShowSignInToShare && (
                    <Button
                        onPress={Share.openApp}
                        success
                        text={translate('common.continue')}
                    />
                )}
                {shouldShowValidateCodeForm && <ValidateCodeForm />}
                {shouldShowUnlinkLoginForm && <UnlinkLoginForm />}
                {shouldShowEmailDeliveryFailurePage && <EmailDeliveryFailurePage />}
            </SignInPageLayout>
        </View>
    );
}

SignInPage.propTypes = propTypes;
SignInPage.defaultProps = defaultProps;
SignInPage.displayName = 'SignInPage';

export default withOnyx({
    account: {key: ONYXKEYS.ACCOUNT},
    credentials: {key: ONYXKEYS.CREDENTIALS},
    demoInfo: {key: ONYXKEYS.DEMO_INFO},
})(SignInPage);
