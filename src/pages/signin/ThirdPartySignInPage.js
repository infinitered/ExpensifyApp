import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withOnyx} from 'react-native-onyx';
import {SafeAreaView} from 'react-native-safe-area-context';
import ONYXKEYS from '../../ONYXKEYS';
import styles from '../../styles/styles';
import compose from '../../libs/compose';
import SignInPageLayout from './SignInPageLayout';
import withLocalize, {withLocalizePropTypes} from '../../components/withLocalize';
import Performance from '../../libs/Performance';
import * as App from '../../libs/actions/App';
import Text from '../../components/Text';
import TextLink from '../../components/TextLink';
import {View} from 'react-native';
import Button from '../../components/Button';
import withWindowDimensions, {windowDimensionsPropTypes} from '../../components/withWindowDimensions';
import * as Localize from '../../libs/Localize';

const propTypes = {
    /* Onyx Props */

    /** The details about the account that the user is signing in with */
    account: PropTypes.shape({
        /** Error to display when there is an account error returned */
        errors: PropTypes.objectOf(PropTypes.string),

        /** Whether the account is validated */
        validated: PropTypes.bool,

        /** The primaryLogin associated with the account */
        primaryLogin: PropTypes.string,
    }),

    /** List of betas available to current user */
    betas: PropTypes.arrayOf(PropTypes.string),

    credentials: PropTypes.objectOf(PropTypes.string),

    signInProvider: 'google' | 'apple',

    ...withLocalizePropTypes,

    ...windowDimensionsPropTypes,
};

const defaultProps = {
    account: {},
    betas: [],
    credentials: {},
    signInProvider: 'google',
};

const capitalize = (word) => word.charAt(0).toUpperCase() + word.slice(1);

class ThirdPartySignInPage extends Component {
    componentDidMount() {
        Performance.measureTTI();

        App.setLocale(Localize.getDevicePreferredLocale());
    }

    continueWithCurrentSession = () => {
        console.log('ContinueWithCurrentSession');
    };

    goBack = () => {
        // Doesn't work on web
        // Navigation.navigate(ROUTES.HOME);
    };

    render() {
        // If the user is already signed in, give them an option to continue with that session
        window.account = this.props.account;

        return (
            <SafeAreaView style={[styles.signInPage]}>
                <SignInPageLayout
                    welcomeHeader={this.props.translate('welcomeText.getStarted')}
                    shouldShowWelcomeHeader
                >
                    <Text style={[styles.mb5]}>{this.props.translate('thirdPartySignIn.alreadySignedIn', {email: 'johndoe@example.com'})}</Text>
                    <Button
                        large
                        text={this.props.translate('thirdPartySignIn.continueWithMyCurrentSession')}
                        style={[styles.mb3]}
                        onPress={this.continueWithCurrentSession}
                    />
                    {
                        // Display buttons for the third party sign in provider}
                    }
                    {this.props.signInProvider === 'google' && <></>}
                    {this.props.signInProvider === 'apple' && <></>}
                    <Text style={[styles.mb5]}>{this.props.translate('thirdPartySignIn.or')}</Text>
                    <Text style={[styles.mb5]}>{this.props.translate('thirdPartySignIn.redirectToDesktopMessage')}</Text>
                    <Text>{this.props.translate('thirdPartySignIn.goBackMessage', {provider: capitalize(this.props.signInProvider)})}</Text>
                    <TextLink
                        style={[styles.link, styles.mb5]}
                        href={'/'}
                    >
                        {this.props.translate('common.goBack')}.
                    </TextLink>
                    <Text style={[styles.textExtraSmallSupporting]}>
                        {this.props.translate('thirdPartySignIn.signInAgreementMessage')}
                        <TextLink
                            style={[styles.textExtraSmallSupporting, styles.link]}
                            href={''}
                        >
                            {' ' + this.props.translate('common.termsOfService')}
                        </TextLink>
                        {' ' + this.props.translate('common.and') + ' '}
                        <TextLink
                            style={[styles.textExtraSmallSupporting, styles.link]}
                            href={''}
                        >
                            {this.props.translate('common.privacy')}
                        </TextLink>
                        .
                    </Text>
                </SignInPageLayout>
            </SafeAreaView>
        );
    }
}

ThirdPartySignInPage.propTypes = propTypes;
ThirdPartySignInPage.defaultProps = defaultProps;

export default compose(
    withLocalize,
    withWindowDimensions,
    withOnyx({
        account: {key: ONYXKEYS.ACCOUNT},
        betas: {key: ONYXKEYS.BETAS},
        credentials: {key: ONYXKEYS.CREDENTIALS},
    }),
)(ThirdPartySignInPage);
