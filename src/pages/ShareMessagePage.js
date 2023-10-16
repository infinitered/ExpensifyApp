import {useState} from 'react';
import {Text, View} from 'react-native';
import {withOnyx} from 'react-native-onyx';
import _ from 'underscore';
import CONST from '../CONST';
import ONYXKEYS from '../ONYXKEYS';
import ROUTES from '../ROUTES';
import AttachmentView from '../components/Attachments/AttachmentView';
import Button from '../components/Button';
import FixedFooter from '../components/FixedFooter';
import HeaderWithBackButton from '../components/HeaderWithBackButton';
import OptionsSelector from '../components/OptionsSelector';
import ScreenWrapper from '../components/ScreenWrapper';
import TextInput from '../components/TextInput';
import withLocalize, {withLocalizePropTypes} from '../components/withLocalize';
import Navigation from '../libs/Navigation/Navigation';
import * as OptionsListUtils from '../libs/OptionsListUtils';
import * as Share from '../libs/Share';
import * as Report from '../libs/actions/Report';
import compose from '../libs/compose';
import styles from '../styles/styles';
import personalDetailsPropType from './personalDetailsPropType';
import reportPropTypes from './reportPropTypes';

function ShareMessagePage({report, personalDetails, route, translate}) {
    const {participantAccountIDs, reportID} = report;
    const {isTextShare, ...share} = Share.useShareData();
    const [message, setMessage] = useState(isTextShare ? share.source : '');

    const participants = _.map(participantAccountIDs, (accountID) => OptionsListUtils.getParticipantsOption({accountID, selected: true}, personalDetails));

    const navigateToReportOrUserDetail = (option) => {
        if (option.accountID) {
            const activeRoute = Navigation.getActiveRoute().replace(/\?.*/, '');

            Navigation.navigate(ROUTES.PROFILE.getRoute(option.accountID, activeRoute));
        } else if (option.reportID) {
            Navigation.navigate(ROUTES.REPORT_WITH_ID_DETAILS.getRoute(option.reportID));
        }
    };

    return (
        <ScreenWrapper
            includeSafeAreaPaddingBottom
            shouldEnableMaxHeight
        >
            <HeaderWithBackButton title={translate('newChatPage.shareToExpensify')} />
            <View style={[styles.justifyContentBetween, styles.flexGrow1]}>
                <OptionsSelector
                    sections={[
                        {
                            title: translate('common.to'),
                            data: participants,
                            shouldShow: true,
                            indexOffset: 0,
                        },
                    ]}
                    value=""
                    onSelectRow={navigateToReportOrUserDetail}
                    selectedOptions={participants}
                    canSelectMultipleOptions={false}
                    disableArrowKeysActions
                    boldStyle
                    showTitleTooltip
                    shouldTextInputAppearBelowOptions
                    shouldShowTextInput={false}
                    shouldUseStyleForChildren={false}
                    // TODO: should we use this instead of the FixedFooter?
                    // footerContent={() => (
                    //     <Button
                    //         success
                    //         pressOnEnter
                    //         text={translate('common.share')}
                    //         onPress={() => {
                    //             if (isTextShare) {
                    //                 Report.addComment(reportID, message);
                    //             } else {
                    //                 Report.addAttachment(reportID, share, message);
                    //             }
                    //             Navigation.dismissModal(reportID);
                    //         }}
                    //     />
                    // )}
                    // listStyles={props.listStyles}
                    // shouldAllowScrollingChildren
                >
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
                </OptionsSelector>
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
    /** The personal details of the person who is logged in */
    personalDetails: personalDetailsPropType,

    /** The report currently being used */
    report: reportPropTypes,

    ...withLocalizePropTypes,
};
ShareMessagePage.defaultProps = {
    report: {},
    reportActions: {},
};

export default compose(
    withLocalize,
    withOnyx({
        personalDetails: {
            key: ONYXKEYS.PERSONAL_DETAILS_LIST,
        },
        report: {
            key: ({route}) => `${ONYXKEYS.COLLECTION.REPORT}${route.params.reportID.toString()}`,
        },
    }),
)(ShareMessagePage);
