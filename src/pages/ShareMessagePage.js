import {useState} from 'react';
import {Text, View} from 'react-native';

import CONST from '../CONST';
import AttachmentView from '../components/AttachmentView';
import Button from '../components/Button';
import HeaderWithBackButton from '../components/HeaderWithBackButton';
import OptionRowLHNData from '../components/LHNOptionsList/OptionRowLHNData';
import ScreenWrapper from '../components/ScreenWrapper';
import TextInput from '../components/TextInput';
import withLocalize, {withLocalizePropTypes} from '../components/withLocalize';
import Navigation from '../libs/Navigation/Navigation';
import Share from '../libs/Share';
import * as Report from '../libs/actions/Report';
import styles from '../styles/styles';

function ShareMessagePage(props) {
    const reportID = props.route.params.reportID;
    const {isTextShare, ...share} = props.route.params.share;
    const [message, setMessage] = useState(isTextShare ? share.source : '');

    return (
        <ScreenWrapper
            includeSafeAreaPaddingBottom
            shouldEnableMaxHeight
        >
            <HeaderWithBackButton
                shouldShowBackButton={false}
                shouldShowCloseButton
                title={props.translate('newChatPage.shareToExpensify')}
                onCloseButtonPress={Share.dismiss}
            />
            <Text style={[styles.textLabelSupporting, {paddingLeft: 24}]}>{props.translate('common.to')}</Text>
            <OptionRowLHNData
                onSelectRow={Navigation.goBack}
                reportID={reportID}
            />
            <View style={{padding: 24}}>
                <TextInput
                    accessibilityLabel={props.translate(isTextShare ? 'common.share' : 'moneyRequestConfirmationList.whatsItFor')}
                    accessibilityRole={CONST.ACCESSIBILITY_ROLE.TEXT}
                    label={props.translate(isTextShare ? 'common.share' : 'moneyRequestConfirmationList.whatsItFor')}
                    onChangeText={setMessage}
                    value={message}
                />
            </View>
            {!isTextShare && (
                <View style={{padding: 24}}>
                    <Text style={styles.textLabelSupporting}>{props.translate('common.share')}</Text>
                    {!!share.source && (
                        <View style={{borderRadius: 8, height: 200, marginTop: 8, overflow: 'hidden', width: '100%'}}>
                            <AttachmentView source={share.source} />
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
                            Report.addAttachment(reportID, share, message);
                        }
                        Share.dismiss();
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
