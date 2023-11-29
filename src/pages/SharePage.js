import React, { useCallback } from 'react';
import {withOnyx} from 'react-native-onyx';
import HeaderWithBackButton from '@components/HeaderWithBackButton';
import ScreenWrapper from '@components/ScreenWrapper';
import TabSelector from '@components/TabSelector/TabSelector';
import withLocalize, {withLocalizePropTypes} from '@components/withLocalize';
import withWindowDimensions, {windowDimensionsPropTypes} from '@components/withWindowDimensions';
import compose from '@libs/compose';
import Navigation from '@libs/Navigation/Navigation';
import OnyxTabNavigator, {TopTab} from '@libs/Navigation/OnyxTabNavigator';
import Share from '@libs/Share';
import * as IOU from '@userActions/IOU';
import CONST from '@src/CONST';
import ONYXKEYS from '@src/ONYXKEYS';
import ROUTES from '@src/ROUTES';
import {iouDefaultProps, iouPropTypes} from './iou/propTypes';
import MoneyRequestParticipantsSelector from './iou/steps/MoneyRequstParticipantsPage/MoneyRequestParticipantsSelector';
import NewChatPage from './NewChatPage';
import reportPropTypes from './reportPropTypes';

const basePropTypes = {
    /** Holds data related to Money Request view state, rather than the underlying Money Request data. */
    iou: iouPropTypes,

    /** The report currently being used */
    report: reportPropTypes,
}

const propTypes = {
    ...basePropTypes,

    ...windowDimensionsPropTypes,

    ...withLocalizePropTypes,
};

const defaultProps = {
    iou: iouDefaultProps,
    report: {reportID: undefined},
};

function Scan({iou, report}) {
    const share = Share.useShareData();

    const navigateToScanConfirmationStep = (moneyRequestType) => {
        IOU.setMoneyRequestReceipt(share.source, share.name);
        IOU.setMoneyRequestId(moneyRequestType);
        Navigation.navigate(ROUTES.MONEY_REQUEST_CONFIRMATION.getRoute(moneyRequestType, report.reportID));
    };

   return (
     <MoneyRequestParticipantsSelector
         participants={iou.participants}
         onAddParticipants={IOU.setMoneyRequestParticipants}
         navigateToRequest={() => navigateToScanConfirmationStep(CONST.IOU.TYPE.REQUEST)}
         navigateToSplit={() => navigateToScanConfirmationStep(CONST.IOU.TYPE.SPLIT)}
         iouType={CONST.IOU.TYPE.REQUEST}
         isScanRequest
     />
   );
}

function SharePage({iou, report, translate}) {

    const ScanScreen = useCallback(() => <Scan iou={iou} report={report} />, [iou, report]);

    return (
        <ScreenWrapper
            includeSafeAreaPaddingBottom={false}
            shouldEnableKeyboardAvoidingView={false}
            shouldEnableMaxHeight
            testID={SharePage.displayName}
        >
            <HeaderWithBackButton title={translate('newChatPage.shareToExpensify')} />
            <OnyxTabNavigator
                id={CONST.TAB.SHARE_TAB_ID}
                tabBar={({state, navigation, position}) => (
                    <TabSelector
                        state={state}
                        navigation={navigation}
                        position={position}
                    />
                )}
            >
                <TopTab.Screen
                    name={CONST.TAB.SHARE}
                    component={NewChatPage}
                />
                <TopTab.Screen
                    name={CONST.TAB.SCAN}
                    component={ScanScreen}
                />
            </OnyxTabNavigator>
        </ScreenWrapper>
    );
}

Scan.propTypes = basePropTypes;
Scan.defaultProps = basePropTypes;
Scan.displayName = 'ScanTab';

SharePage.propTypes = propTypes;
SharePage.defaultProps = defaultProps;
SharePage.displayName = 'SharePage';

export default compose(
    withLocalize,
    withWindowDimensions,
    withOnyx({
        iou: {
            key: ONYXKEYS.IOU,
        },
    }),
    // eslint-disable-next-line rulesdir/no-multiple-onyx-in-file
    withOnyx({
        report: {
            key: ({route, iou}) => {
                const reportID = IOU.getIOUReportID(iou, route);

                return `${ONYXKEYS.COLLECTION.REPORT}${reportID}`;
            },
        },
    }),
)(SharePage);
