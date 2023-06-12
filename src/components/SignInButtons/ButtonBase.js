import React from 'react';
import {Pressable} from 'react-native';
import PropTypes from 'prop-types';
import styles from '../../styles/styles';
import withLocalize, {withLocalizePropTypes} from '../withLocalize';

const propTypes = {
    /** The on press method */
    onPress: PropTypes.func,

    /** The icon to render */
    icon: PropTypes.func,

    /** The Accessibility Label */
    accessibilityLabel: PropTypes.string,

    ...withLocalizePropTypes,
};

const defaultProps = {
    onPress: () => {},
    icon: null,
    accessibilityLabel: '',
};

const ButtonBase = ({onPress, icon, translate, accessibilityLabel}) => (
    <Pressable
        onPress={onPress}
        style={styles.signInButtonBase}
        accessibilityRole="button"
        accessibilityLabel={translate(accessibilityLabel)}
    >
        {icon}
    </Pressable>
);

ButtonBase.displayName = 'ButtonBase';
ButtonBase.propTypes = propTypes;
ButtonBase.defaultProps = defaultProps;

export default withLocalize(ButtonBase);
