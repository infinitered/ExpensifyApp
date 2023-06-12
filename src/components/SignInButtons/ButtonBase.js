import React from 'react';
import {Pressable} from 'react-native';
import PropTypes from 'prop-types';
import styles from '../../styles/styles';
import withLocalize, {withLocalizePropTypes} from '../withLocalize';
import CONST from '../../CONST';

const appleLogoIcon = require('../../../assets/images/signIn/apple-logo.svg').default;
const googleLogoIcon = require('../../../assets/images/signIn/google-logo.svg').default;

const propTypes = {
    /** The on press method */
    onPress: PropTypes.func,

    /** Which provider you are using to sign in */
    provider: PropTypes.string.isRequired,

    ...withLocalizePropTypes,
};

const defaultProps = {
    onPress: () => {},
};

const ButtonBase = ({onPress, translate, provider}) => (
    <Pressable
        onPress={onPress}
        style={styles.signInButtonBase}
        accessibilityRole="button"
        accessibilityLabel={translate(provider === CONST.SIGN_IN_METHOD.APPLE ? 'common.signInWithApple' : 'common.signInWithGoogle')}
    >
        {provider === CONST.SIGN_IN_METHOD.APPLE ? appleLogoIcon : googleLogoIcon}
    </Pressable>
);

ButtonBase.displayName = 'ButtonBase';
ButtonBase.propTypes = propTypes;
ButtonBase.defaultProps = defaultProps;

export default withLocalize(ButtonBase);
