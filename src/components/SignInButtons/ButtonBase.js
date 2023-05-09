import {Pressable} from 'react-native';

const style = {
    margin: 10,
};

const ButtonBase = ({onPress, icon}) => (
    <Pressable onPress={onPress} style={style}>
        {icon}
    </Pressable>
);

ButtonBase.displayName = 'ButtonBase';

export default ButtonBase;
