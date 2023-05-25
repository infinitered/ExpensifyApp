import React from 'react';
import PropTypes from 'prop-types';
import {Pressable} from 'react-native';
import styles from '../../styles/styles';

const propTypes = {
    onPress: PropTypes.func.isRequired,
    icon: PropTypes.node.isRequired,
};

function ButtonBase({onPress, icon}) {
    return (
        <Pressable
            onPress={onPress}
            style={styles.signInButtonBase}
        >
            {icon}
        </Pressable>
    );
}

ButtonBase.propTypes = propTypes;

export default ButtonBase;
