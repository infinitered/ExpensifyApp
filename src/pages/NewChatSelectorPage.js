import {useRoute} from '@react-navigation/native';
import React from 'react';
import {withOnyx} from 'react-native-onyx';
import CONST from '../CONST';
import ONYXKEYS from '../ONYXKEYS';
import HeaderWithBackButton from '../components/HeaderWithBackButton';
import ScreenWrapper from '../components/ScreenWrapper';
import TabSelector from '../components/TabSelector/TabSelector';
import withLocalize, {withLocalizePropTypes} from '../components/withLocalize';
import withWindowDimensions, {windowDimensionsPropTypes} from '../components/withWindowDimensions';
import Navigation from '../libs/Navigation/Navigation';
import OnyxTabNavigator, {TopTab} from '../libs/Navigation/OnyxTabNavigator';
import Permissions from '../libs/Permissions';
import Share from '../libs/Share';
import compose from '../libs/compose';
import NewChatPage from './NewChatPage';
import WorkspaceNewRoomPage from './workspace/WorkspaceNewRoomPage';

const propTypes = {
    ...windowDimensionsPropTypes,

    ...withLocalizePropTypes,
};

const defaultProps = {
    betas: [],
    personalDetails: {},
    reports: {},
};

function NewChatSelectorPage(props) {
    const route = useRoute();
    const share = route.params && route.params.share;
    return (
        <ScreenWrapper
            shouldEnableKeyboardAvoidingView={false}
            includeSafeAreaPaddingBottom={false}
            shouldEnableMaxHeight
        >
            <HeaderWithBackButton
                onBackButtonPress={Navigation.dismissModal}
                onCloseButtonPress={Share.dismiss}
                shouldShowBackButton={!share}
                shouldShowCloseButton={!!share}
                title={share ? props.translate('newChatPage.shareToExpensify') : props.translate('sidebarScreen.fabNewChat')}
            />
            {Permissions.canUsePolicyRooms(props.betas) ? (
                <OnyxTabNavigator
                    id={CONST.TAB.NEW_CHAT_TAB_ID}
                    tabBar={({state, navigation, position}) => (
                        <TabSelector
                            state={state}
                            navigation={navigation}
                            position={position}
                        />
                    )}
                >
                    <TopTab.Screen
                        name={CONST.TAB.NEW_CHAT}
                        component={NewChatPage}
                    />
                    <TopTab.Screen
                        name={CONST.TAB.NEW_ROOM}
                        component={WorkspaceNewRoomPage}
                    />
                </OnyxTabNavigator>
            ) : (
                <NewChatPage />
            )}
        </ScreenWrapper>
    );
}

NewChatSelectorPage.propTypes = propTypes;
NewChatSelectorPage.defaultProps = defaultProps;
NewChatSelectorPage.displayName = 'NewChatPage';

export default compose(
    withLocalize,
    withWindowDimensions,
    withOnyx({
        betas: {key: ONYXKEYS.BETAS},
    }),
)(NewChatSelectorPage);
