import PropTypes from 'prop-types';
import React from 'react';
import {View} from 'react-native';
import {withSafeAreaInsets} from 'react-native-safe-area-context';
import ExpensifyWordmark from '@components/ExpensifyWordmark';
import OfflineIndicator from '@components/OfflineIndicator';
import SignInPageForm from '@components/SignInPageForm';
import Text from '@components/Text';
import withLocalize, {withLocalizePropTypes} from '@components/withLocalize';
import useResponsiveLayout from '@hooks/useResponsiveLayout';
import useStyleUtils from '@hooks/useStyleUtils';
import useThemeStyles from '@hooks/useThemeStyles';
import compose from '@libs/compose';
import SignInHeroImage from '@pages/signin/SignInHeroImage';
import variables from '@styles/variables';

const propTypes = {
    /** The children to show inside the layout */
    children: PropTypes.node.isRequired,

    /** Welcome text to show in the header of the form, changes depending
     * on form type (for example, sign in) */
    welcomeText: PropTypes.string.isRequired,

    /** Welcome header to show in the header of the form, changes depending
     * on form type (for example. sign in) and small vs large screens */
    welcomeHeader: PropTypes.string.isRequired,

    /** Whether to show welcome text on a particular page */
    shouldShowWelcomeText: PropTypes.bool.isRequired,

    /** Whether to show welcome header on a particular page */
    shouldShowWelcomeHeader: PropTypes.bool.isRequired,

    ...withLocalizePropTypes,
};

function SignInPageContent(props) {
    const {shouldUseNarrowLayout} = useResponsiveLayout();
    const styles = useThemeStyles();
    const StyleUtils = useStyleUtils();

    return (
        <View style={[styles.flex1, styles.signInPageLeftContainer]}>
            <View style={[styles.flex1, styles.alignSelfCenter, styles.signInPageWelcomeFormContainer]}>
                {/* This empty view creates margin on the top of the sign in form which will shrink and grow depending on if the keyboard is open or not */}
                <View style={[styles.flexGrow1, shouldUseNarrowLayout ? styles.signInPageContentTopSpacerSmallScreens : styles.signInPageContentTopSpacer]} />
                <View style={[styles.flexGrow2, styles.mb8]}>
                    <SignInPageForm style={[styles.alignSelfStretch]}>
                        <View style={[shouldUseNarrowLayout ? styles.mb8 : styles.mb15, shouldUseNarrowLayout ? styles.alignItemsCenter : styles.alignSelfStart]}>
                            <ExpensifyWordmark />
                        </View>
                        <View style={[styles.signInPageWelcomeTextContainer]}>
                            {props.shouldShowWelcomeHeader && props.welcomeHeader ? (
                                <Text
                                    style={[
                                        styles.loginHeroHeader,
                                        StyleUtils.getLineHeightStyle(variables.lineHeightSignInHeroXSmall),
                                        StyleUtils.getFontSizeStyle(variables.fontSizeSignInHeroXSmall),
                                        !props.welcomeText ? styles.mb5 : {},
                                        !shouldUseNarrowLayout ? styles.textAlignLeft : {},
                                        styles.mb5,
                                    ]}
                                >
                                    {props.welcomeHeader}
                                </Text>
                            ) : null}
                            {props.shouldShowWelcomeText && props.welcomeText ? (
                                <Text style={[styles.loginHeroBody, styles.mb5, styles.textNormal, !shouldUseNarrowLayout ? styles.textAlignLeft : {}]}>{props.welcomeText}</Text>
                            ) : null}
                        </View>
                        {props.children}
                    </SignInPageForm>
                    <View style={[styles.mb8, styles.signInPageWelcomeTextContainer, styles.alignSelfCenter]}>
                        <OfflineIndicator style={[styles.m0, styles.pl0, styles.alignItemsStart]} />
                    </View>
                    {shouldUseNarrowLayout ? (
                        <View style={[styles.mt8]}>
                            <SignInHeroImage />
                        </View>
                    ) : null}
                </View>
            </View>
        </View>
    );
}

SignInPageContent.propTypes = propTypes;
SignInPageContent.displayName = 'SignInPageContent';

export default compose(withLocalize, withSafeAreaInsets)(SignInPageContent);
