import {useState} from 'react';
import {Platform, Text, View} from 'react-native';
import {ShareMenuReactView} from 'react-native-share-menu';

import AttachmentView from '../components/AttachmentView';
import Button from '../components/Button';
import HeaderWithBackButton from '../components/HeaderWithBackButton';
import ScreenWrapper from '../components/ScreenWrapper';
import TextInput from '../components/TextInput';
import withLocalize, {withLocalizePropTypes} from '../components/withLocalize';
// import additionalAppSetup from './src/setup';
import OptionRowLHNData from '../components/LHNOptionsList/OptionRowLHNData';
import * as Report from '../libs/actions/Report';
import Navigation from '../libs/Navigation/Navigation';
import styles from '../styles/styles';

function ShareMessagePage(props) {
    const reportID = props.route.params.reportID;
    const attachment = props.route.params.share;
    const source = attachment.data;
    const uri = attachment.data;
    const name = source.split('/').pop();
    const type = attachment.mimeType;
    const isTextShare = type === 'text/plain';

    const [message, setMessage] = useState(isTextShare ? source : '');

    const dismiss = Platform.select({
        ios: () => ShareMenuReactView.dismissExtension(),
        default: () => Navigation.dismissModal(),
    });

    return (
        <ScreenWrapper
            includeSafeAreaPaddingBottom
            shouldEnableMaxHeight
        >
            <HeaderWithBackButton
                shouldShowBackButton={false}
                shouldShowCloseButton
                title={props.translate('newChatPage.shareToExpensify')}
                onCloseButtonPress={dismiss}
            />
            <Text style={[styles.textLabelSupporting, {paddingLeft: 24}]}>{props.translate('common.to')}</Text>
            <OptionRowLHNData
                onSelectRow={Navigation.goBack}
                reportID={reportID}
            />
            <View style={{padding: 24}}>
                <TextInput
                    inputID="addAMessage"
                    label={props.translate(isTextShare ? 'common.share' : 'moneyRequestConfirmationList.whatsItFor')}
                    name="addAMessage"
                    onChangeText={setMessage}
                    value={message}
                />
            </View>
            {!isTextShare && (
                <View style={{padding: 24}}>
                    <Text style={styles.textLabelSupporting}>{props.translate('common.share')}</Text>
                    {!!source && (
                        <View style={{borderRadius: 8, height: 200, marginTop: 8, overflow: 'hidden', width: '100%'}}>
                            <AttachmentView source={source} />
                        </View>
                    )}
                </View>
            )}
            <View style={{padding: 24}}>
                <Button
                    success
                    pressOnEnter
                    text={props.translate('common.share')}
                    onPress={() => {
                        if (isTextShare) {
                            Report.addComment(reportID, message);
                        } else {
                            Report.addAttachment(reportID, {name, source, type, uri}, message);
                        }
                        dismiss();
                    }}
                />
            </View>
        </ScreenWrapper>
    );
}

ShareMessagePage.propTypes = {
    ...withLocalizePropTypes,
};
ShareMessagePage.defaultProps = {};

export default withLocalize(ShareMessagePage);
