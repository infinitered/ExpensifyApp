import {createNavigationContainerRef, NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import lodashGet from 'lodash/get';
import PropTypes from 'prop-types';
import {useEffect, useState} from 'react';
import {AppRegistry, Image, Pressable, ScrollView, Text, View} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import Onyx, {withOnyx} from 'react-native-onyx';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import _ from 'underscore';
import Button from './src/components/Button';
import ComposeProviders from './src/components/ComposeProviders';
import CustomStatusBar from './src/components/CustomStatusBar';
import ExpensifyWordmark from './src/components/ExpensifyWordmark';
import HeaderWithCloseButton from './src/components/HeaderWithCloseButton';
import MenuItem from './src/components/MenuItem';
import OnyxProvider from './src/components/OnyxProvider';
import OptionsSelector from './src/components/OptionsSelector';
import SafeArea from './src/components/SafeArea';
import TextInput from './src/components/TextInput';
import {KeyboardStateProvider} from './src/components/withKeyboardState';
import withLocalize, {LocaleContextProvider, withLocalizePropTypes} from './src/components/withLocalize';
import {windowDimensionsPropTypes, WindowDimensionsProvider} from './src/components/withWindowDimensions';
import CONFIG from './src/CONFIG';
import * as App from './src/libs/actions/App';
import * as User from './src/libs/actions/User';
import compose from './src/libs/compose';
import NetworkConnection from './src/libs/NetworkConnection';
import * as Pusher from './src/libs/Pusher/pusher';
import PusherConnectionManager from './src/libs/PusherConnectionManager';
import * as UserUtils from './src/libs/UserUtils';
import ONYXKEYS from './src/ONYXKEYS';
import personalDetailsPropType from './src/pages/personalDetailsPropType';
import ShareExtensionPage from './src/pages/ShareExtensionPage';
// import additionalAppSetup from './src/setup';
import {ShareMenuReactView} from 'react-native-share-menu';
import CONST from './src/CONST';
import * as Metrics from './src/libs/Metrics';
import styles from './src/styles/styles';

const propTypes = {
    /* Onyx Props */

    /** The details about the account that the user is signing in with */
    account: PropTypes.shape({
        /** An error message to display to the user */
        errors: PropTypes.objectOf(PropTypes.string),

        /** The message to be displayed when code requested */
        message: PropTypes.string,
    }),

    /** All of the personal details for everyone */
    personalDetails: personalDetailsPropType,

    /** Indicates which locale the user currently has selected */
    preferredLocale: PropTypes.string,

    /** Session info for the currently logged-in user. */
    session: PropTypes.shape({
        /** Currently logged-in user email */
        email: PropTypes.string,

        /** Currently logged-in user authToken */
        authToken: PropTypes.string,
    }),

    /** Window Dimensions Props */
    ...windowDimensionsPropTypes,

    ...withLocalizePropTypes,
};
const defaultProps = {
    account: {},
    personalDetails: {},
    preferredLocale: 'en',
    session: {},
};

Onyx.init({
    keys: ONYXKEYS,

    // Increase the cached key count so that the app works more consistently for accounts with large numbers of reports
    maxCachedKeysCount: 10000,
    safeEvictionKeys: [ONYXKEYS.COLLECTION.REPORT_ACTIONS],
    captureMetrics: Metrics.canCaptureOnyxMetrics(),
    initialKeyStates: {
        // Clear any loading and error messages so they do not appear on app startup
        [ONYXKEYS.SESSION]: {loading: false},
        [ONYXKEYS.ACCOUNT]: CONST.DEFAULT_ACCOUNT_DATA,
        [ONYXKEYS.NETWORK]: {isOffline: false},
        [ONYXKEYS.IOU]: {
            loading: false,
            error: false,
        },
        [ONYXKEYS.IS_SIDEBAR_LOADED]: false,
        [ONYXKEYS.SHOULD_SHOW_COMPOSE_INPUT]: true,
    },
});

const Home = compose(
    withLocalize,
    withOnyx({
        account: {key: ONYXKEYS.ACCOUNT},
        personalDetails: {key: ONYXKEYS.PERSONAL_DETAILS},
        preferredLocale: {key: ONYXKEYS.NVP_PREFERRED_LOCALE},
        session: {key: ONYXKEYS.SESSION},
    }),
)((props) => {
    useEffect(() => {
        NetworkConnection.listenForReconnect();
        NetworkConnection.onReconnect(() => App.reconnectApp());
        PusherConnectionManager.init();
        Pusher.init({
            appKey: CONFIG.PUSHER.APP_KEY,
            cluster: CONFIG.PUSHER.CLUSTER,
            authEndpoint: `${CONFIG.EXPENSIFY.DEFAULT_API_ROOT}api?command=AuthenticatePusher`,
        }).then(() => {
            User.subscribeToUserEvents();
        });

        App.openApp();
        App.setUpPoliciesAndNavigate(props.session);
    }, [props.session]);

    const [searchValue, setSearchValue] = useState();

    return (
        <View style={{backgroundColor: '#07271F', flex: 1}}>
            <HeaderWithCloseButton
                title={props.translate('common.share')}
                onCloseButtonPress={() => alert('close share extension')}
            />
            <View style={[styles.flex1, styles.w100, styles.pRelative]}>
                <OptionsSelector
                    sections={[]}
                    value={searchValue}
                    // onSelectRow={this.selectReport}
                    onChangeText={setSearchValue}
                    // headerMessage={this.state.headerMessage}
                    hideSectionHeaders
                    showTitleTooltip
                    // shouldShowOptions={didScreenTransitionEnd && isOptionsDataReady}
                    textInputLabel={props.translate('optionsSelector.nameEmailOrPhoneNumber')}
                    // onLayout={this.searchRendered}
                    // safeAreaPaddingBottomStyle={safeAreaPaddingBottomStyle}
                />
            </View>
            <View style={{padding: 48}} />
            <ScrollView contentContainerStyle={{padding: 24}}>
                <View style={{justifyContent: 'space-between', flexDirection: 'row'}}>
                    <Pressable onPress={() => App.setLocale(props.preferredLocale === 'en' ? 'es' : 'en')}>
                        <ExpensifyWordmark style={styles.anonymousRoomFooterLogo} />
                    </Pressable>
                    <Pressable onPress={() => props.navigation.navigate('Message')}>
                        <Text style={{color: '#E7ECE9', fontWeight: 'bold'}}>{props.translate('common.next')}</Text>
                    </Pressable>
                </View>
                <View style={{padding: 24}} />
                {_.map(Object.entries(props), ([prop, json]) => (
                    <Text
                        key={prop}
                        style={{color: '#E7ECE9', fontWeight: 'bold'}}
                    >
                        {prop.toUpperCase()}
                        {'\n\n'}
                        {typeof json === 'string' ? (
                            <Text style={{color: '#E7ECE9', fontWeight: 'normal'}}>
                                {json}
                                {'\n'}
                            </Text>
                        ) : (
                            _.map(Object.entries(json), ([key, value]) => (
                                <Text
                                    key={key}
                                    style={{color: '#E7ECE9', fontWeight: 'normal'}}
                                >
                                    {key}: {JSON.stringify(value)}
                                    {'\n'}
                                </Text>
                            ))
                        )}
                    </Text>
                ))}
            </ScrollView>
        </View>
    );
});

Home.propTypes = propTypes;
Home.defaultProps = defaultProps;

const Message = withLocalize((props) => {
    const toDetails = props.route.params.option;
    const [attachment, setAttachment] = useState();

    useEffect(() => {
        ShareMenuReactView.data().then(({data}) => setAttachment(data[0]));
    }, []);

    console.log({attachment: JSON.stringify(attachment)});

    return (
        <View style={{backgroundColor: '#07271F', flex: 1}}>
            <Pressable
                onPress={props.navigation.goBack}
                style={{padding: 24}}
            >
                <Text style={{color: '#E7ECE9', fontWeight: 'bold'}}>{props.translate('common.goBack')}</Text>
            </Pressable>
            <Text style={[styles.textLabelSupporting, {paddingLeft: 24}]}>{props.translate('common.to')}</Text>
            <MenuItem
                title={toDetails.text}
                description={toDetails.alternateText}
                icon={UserUtils.getAvatar(lodashGet(toDetails, 'avatar', ''), lodashGet(toDetails, 'login', ''))}
                iconHeight={40}
                iconWidth={40}
                shouldShowRightIcon
            />
            <View style={{padding: 24}}>
                <TextInput
                    inputID="addAMessage"
                    name="addAMessage"
                    label={props.translate('moneyRequestConfirmationList.whatsItFor')}
                />
            </View>
            <View style={{padding: 24}}>
                {/* <Text style={styles.textLabelSupporting}>{props.translate('common.share')}</Text> */}
                <Text style={styles.textLabelSupporting}>Sharing</Text>
                {attachment && attachment.mimeType === 'text/plain' && <Text>{attachment.data}</Text>}
                {attachment && attachment.mimeType.startsWith('image/') && (
                    <Image
                        style={{
                            width: '100%',
                            borderRadius: 10,
                            height: 200,
                            marginVertical: 10,
                        }}
                        // resizeMode="contain"
                        source={{uri: attachment.data}}
                    />
                )}
            </View>
            <View style={{padding: 24}}>
                <Button
                    success
                    pressOnEnter
                    text={props.translate('common.share')}
                />
            </View>
        </View>
    );
});

Message.propTypes = {
    ...withLocalizePropTypes,
};
Message.defaultProps = {};

// eslint-disable-next-line
export const navigationRef = createNavigationContainerRef();

const Stack = createStackNavigator();

const ShareExtension = withOnyx({
    session: {
        key: ONYXKEYS.SESSION,
    },
})((props) => {
    useEffect(() => {
        NetworkConnection.listenForReconnect();
        NetworkConnection.onReconnect(() => App.reconnectApp());
        PusherConnectionManager.init();
        Pusher.init({
            appKey: CONFIG.PUSHER.APP_KEY,
            cluster: CONFIG.PUSHER.CLUSTER,
            authEndpoint: `${CONFIG.EXPENSIFY.DEFAULT_API_ROOT}api?command=AuthenticatePusher`,
        }).then(() => {
            User.subscribeToUserEvents();
        });

        App.openApp();
        App.setUpPoliciesAndNavigate(props.session);
    }, [props.session]);

    return (
        <GestureHandlerRootView style={{flex: 1}}>
            <ComposeProviders
                components={[
                    OnyxProvider,
                    SafeAreaProvider,
                    // PortalProvider,
                    SafeArea,
                    LocaleContextProvider,
                    WindowDimensionsProvider,
                    KeyboardStateProvider,
                    // PickerStateProvider,
                ]}
            >
                <CustomStatusBar />
                {/* this appears to require firebase */}
                {/* <ErrorBoundary errorMessage="NewExpensify crash caught by error boundary"> */}
                <NavigationContainer ref={navigationRef}>
                    <Stack.Navigator screenOptions={{headerShown: false}}>
                        <Stack.Screen
                            name="Home"
                            component={ShareExtensionPage}
                        />
                        <Stack.Screen
                            name="Message"
                            component={Message}
                        />
                    </Stack.Navigator>
                </NavigationContainer>
                {/* </ErrorBoundary> */}
            </ComposeProviders>
        </GestureHandlerRootView>
    );
});

AppRegistry.registerComponent('ShareMenuModuleComponent', () => ShareExtension);
// this also appears to require firebase
// additionalAppSetup();
