import {useState} from 'react';
import {Text, View} from 'react-native';

import CONST from '../CONST';
import AttachmentView from '../components/Attachments/AttachmentView';
import Button from '../components/Button';
import FixedFooter from '../components/FixedFooter';
import HeaderWithBackButton from '../components/HeaderWithBackButton';
import OptionRowLHNData from '../components/LHNOptionsList/OptionRowLHNData';
import ScreenWrapper from '../components/ScreenWrapper';
import TextInput from '../components/TextInput';
import withLocalize, {withLocalizePropTypes} from '../components/withLocalize';
import Navigation from '../libs/Navigation/Navigation';
import * as Share from '../libs/Share';
import * as Report from '../libs/actions/Report';
import styles from '../styles/styles';

function ShareMessagePage({route, translate}) {
    const reportID = route.params.reportID;
    const {isTextShare, ...share} = Share.useShareData();
    const [message, setMessage] = useState(isTextShare ? share.source : '');

    return (
        <ScreenWrapper
            includeSafeAreaPaddingBottom
            shouldEnableMaxHeight
        >
            <HeaderWithBackButton title={translate('newChatPage.shareToExpensify')} />
            <View style={[styles.justifyContentBetween, styles.flexGrow1]}>
                <View>
                    <Text style={[styles.textLabelSupporting, {paddingLeft: 24}]}>{translate('common.to')}</Text>
                    <OptionRowLHNData reportID={reportID} />
                    <View style={{padding: 24}}>
                        <TextInput
                            accessibilityLabel={translate('common.message')}
                            label={translate('common.message')}
                            accessibilityRole={CONST.ACCESSIBILITY_ROLE.TEXT}
                            autoGrowHeight
                            textAlignVertical="top"
                            containerStyles={[styles.autoGrowHeightMultilineInput]}
                            submitOnEnter={false}
                            onChangeText={setMessage}
                            value={message}
                            returnKeyType="done"
                            blurOnSubmit
                        />
                    </View>
                    {!isTextShare && (
                        <View style={{padding: 24}}>
                            <Text style={styles.textLabelSupporting}>{translate('common.attachment')}</Text>
                            {!!share.source && (
                                <View style={{borderRadius: 8, height: 200, marginTop: 8, overflow: 'hidden', width: '100%'}}>
                                    <AttachmentView
                                        source={share.source}
                                        file={share}
                                    />
                                </View>
                            )}
                        </View>
                    )}
                </View>
                <FixedFooter>
                    <Button
                        success
                        pressOnEnter
                        text={translate('common.share')}
                        onPress={() => {
                            if (isTextShare) {
                                Report.addComment(reportID, message);
                            } else {
                                Report.addAttachment(reportID, share, message);
                            }
                            Navigation.dismissModal(reportID);
                        }}
                    />
                </FixedFooter>
            </View>
        </ScreenWrapper>
    );
}

ShareMessagePage.propTypes = {
    ...withLocalizePropTypes,
};
ShareMessagePage.defaultProps = {};

export default withLocalize(ShareMessagePage);
