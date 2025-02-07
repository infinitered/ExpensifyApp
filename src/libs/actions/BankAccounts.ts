import Onyx from 'react-native-onyx';
import * as API from '@libs/API';
import type {
    AddPersonalBankAccountParams,
    BankAccountHandlePlaidErrorParams,
    ConnectBankAccountManuallyParams,
    ConnectBankAccountWithPlaidParams,
    DeletePaymentBankAccountParams,
    OpenReimbursementAccountPageParams,
    ValidateBankAccountWithTransactionsParams,
    VerifyIdentityForBankAccountParams,
} from '@libs/API/parameters';
import {READ_COMMANDS, WRITE_COMMANDS} from '@libs/API/types';
import * as ErrorUtils from '@libs/ErrorUtils';
import Navigation from '@libs/Navigation/Navigation';
import * as PlaidDataProps from '@pages/ReimbursementAccount/plaidDataPropTypes';
import CONST from '@src/CONST';
import ONYXKEYS from '@src/ONYXKEYS';
import ROUTES from '@src/ROUTES';
import type {Route} from '@src/ROUTES';
import type {ACHContractStepProps, BeneficialOwnersStepProps, CompanyStepProps, RequestorStepProps} from '@src/types/form/ReimbursementAccountForm';
import type PlaidBankAccount from '@src/types/onyx/PlaidBankAccount';
import type {BankAccountStep, BankAccountSubStep} from '@src/types/onyx/ReimbursementAccount';
import type {OnyxData} from '@src/types/onyx/Request';
import * as ReimbursementAccount from './ReimbursementAccount';

export {
    goToWithdrawalAccountSetupStep,
    setBankAccountFormValidationErrors,
    resetReimbursementAccount,
    resetFreePlanBankAccount,
    hideBankAccountErrors,
    setWorkspaceIDForReimbursementAccount,
    setBankAccountSubStep,
    updateReimbursementAccountDraft,
    requestResetFreePlanBankAccount,
    cancelResetFreePlanBankAccount,
} from './ReimbursementAccount';
export {openPlaidBankAccountSelector, openPlaidBankLogin} from './Plaid';
export {openOnfidoFlow, answerQuestionsForWallet, verifyIdentity, acceptWalletTerms} from './Wallet';

type ReimbursementAccountStep = BankAccountStep | '';

type ReimbursementAccountSubStep = BankAccountSubStep | '';

type BusinessAddress = {
    addressStreet?: string;
    addressCity?: string;
    addressState?: string;
    addressZipCode?: string;
};

type PersonalAddress = {
    requestorAddressStreet?: string;
    requestorAddressCity?: string;
    requestorAddressState?: string;
    requestorAddressZipCode?: string;
};

function clearPlaid(): Promise<void> {
    Onyx.set(ONYXKEYS.PLAID_LINK_TOKEN, '');
    Onyx.set(ONYXKEYS.PLAID_CURRENT_EVENT, null);
    return Onyx.set(ONYXKEYS.PLAID_DATA, PlaidDataProps.plaidDataDefaultProps);
}

function openPlaidView() {
    clearPlaid().then(() => ReimbursementAccount.setBankAccountSubStep(CONST.BANK_ACCOUNT.SETUP_TYPE.PLAID));
}

function setPlaidEvent(eventName: string) {
    Onyx.set(ONYXKEYS.PLAID_CURRENT_EVENT, eventName);
}

/**
 * Open the personal bank account setup flow, with an optional exitReportID to redirect to once the flow is finished.
 */
function openPersonalBankAccountSetupView(exitReportID?: string) {
    clearPlaid().then(() => {
        if (exitReportID) {
            Onyx.merge(ONYXKEYS.PERSONAL_BANK_ACCOUNT, {exitReportID});
        }
        Navigation.navigate(ROUTES.SETTINGS_ADD_BANK_ACCOUNT);
    });
}

/**
 * Whether after adding a bank account we should continue with the KYC flow. If so, we must specify the fallback route.
 */
function setPersonalBankAccountContinueKYCOnSuccess(onSuccessFallbackRoute: Route) {
    Onyx.merge(ONYXKEYS.PERSONAL_BANK_ACCOUNT, {onSuccessFallbackRoute});
}

function clearPersonalBankAccount() {
    clearPlaid();
    Onyx.set(ONYXKEYS.PERSONAL_BANK_ACCOUNT, {});
}

function clearOnfidoToken() {
    Onyx.merge(ONYXKEYS.ONFIDO_TOKEN, '');
    Onyx.merge(ONYXKEYS.ONFIDO_APPLICANT_ID, '');
}

/**
 * Helper method to build the Onyx data required during setup of a Verified Business Bank Account
 */
function getVBBADataForOnyx(currentStep?: BankAccountStep): OnyxData {
    return {
        optimisticData: [
            {
                onyxMethod: Onyx.METHOD.MERGE,
                key: ONYXKEYS.REIMBURSEMENT_ACCOUNT,
                value: {
                    isLoading: true,
                    errors: null,
                },
            },
        ],
        successData: [
            {
                onyxMethod: Onyx.METHOD.MERGE,
                key: ONYXKEYS.REIMBURSEMENT_ACCOUNT,
                value: {
                    isLoading: false,
                    errors: null,
                    // When setting up a bank account, we save the draft form values in Onyx.
                    // When we update the information for a step, the value of some fields that are returned from the API
                    // can be different from the value that we stored as the draft in Onyx (i.e. the phone number is formatted).
                    // This is why we store the current step used to call the API in order to update the corresponding draft data in Onyx.
                    // If currentStep is undefined that means this step don't need to update the data of the draft in Onyx.
                    draftStep: currentStep,
                },
            },
        ],
        failureData: [
            {
                onyxMethod: Onyx.METHOD.MERGE,
                key: ONYXKEYS.REIMBURSEMENT_ACCOUNT,
                value: {
                    isLoading: false,
                    errors: ErrorUtils.getMicroSecondOnyxError('walletPage.addBankAccountFailure'),
                },
            },
        ],
    };
}

function addBusinessWebsiteForDraft(websiteUrl: string) {
    Onyx.merge(ONYXKEYS.FORMS.REIMBURSEMENT_ACCOUNT_FORM_DRAFT, {website: websiteUrl});
}

/**
 * Submit Bank Account step with Plaid data so php can perform some checks.
 */
function connectBankAccountWithPlaid(bankAccountID: number, selectedPlaidBankAccount: PlaidBankAccount, policyID: string) {
    const parameters: ConnectBankAccountWithPlaidParams = {
        bankAccountID,
        routingNumber: selectedPlaidBankAccount.routingNumber,
        accountNumber: selectedPlaidBankAccount.accountNumber,
        bank: selectedPlaidBankAccount.bankName,
        plaidAccountID: selectedPlaidBankAccount.plaidAccountID,
        plaidAccessToken: selectedPlaidBankAccount.plaidAccessToken,
        canUseNewVbbaFlow: true,
        policyID,
    };

    API.write(WRITE_COMMANDS.CONNECT_BANK_ACCOUNT_WITH_PLAID, parameters, getVBBADataForOnyx());
}

/**
 * Adds a bank account via Plaid
 *
 * TODO: offline pattern for this command will have to be added later once the pattern B design doc is complete
 */
function addPersonalBankAccount(account: PlaidBankAccount) {
    const parameters: AddPersonalBankAccountParams = {
        addressName: account.addressName ?? '',
        routingNumber: account.routingNumber,
        accountNumber: account.accountNumber,
        isSavings: account.isSavings ?? false,
        setupType: 'plaid',
        bank: account.bankName,
        plaidAccountID: account.plaidAccountID,
        plaidAccessToken: account.plaidAccessToken,
    };

    const onyxData: OnyxData = {
        optimisticData: [
            {
                onyxMethod: Onyx.METHOD.MERGE,
                key: ONYXKEYS.PERSONAL_BANK_ACCOUNT,
                value: {
                    isLoading: true,
                    errors: null,
                    plaidAccountID: account.plaidAccountID,
                },
            },
        ],
        successData: [
            {
                onyxMethod: Onyx.METHOD.MERGE,
                key: ONYXKEYS.PERSONAL_BANK_ACCOUNT,
                value: {
                    isLoading: false,
                    errors: null,
                    shouldShowSuccess: true,
                },
            },
        ],
        failureData: [
            {
                onyxMethod: Onyx.METHOD.MERGE,
                key: ONYXKEYS.PERSONAL_BANK_ACCOUNT,
                value: {
                    isLoading: false,
                    errors: ErrorUtils.getMicroSecondOnyxError('walletPage.addBankAccountFailure'),
                },
            },
        ],
    };

    API.write(WRITE_COMMANDS.ADD_PERSONAL_BANK_ACCOUNT, parameters, onyxData);
}

function deletePaymentBankAccount(bankAccountID: number) {
    const parameters: DeletePaymentBankAccountParams = {bankAccountID};

    const onyxData: OnyxData = {
        optimisticData: [
            {
                onyxMethod: Onyx.METHOD.MERGE,
                key: `${ONYXKEYS.BANK_ACCOUNT_LIST}`,
                value: {[bankAccountID]: {pendingAction: CONST.RED_BRICK_ROAD_PENDING_ACTION.DELETE}},
            },
        ],

        // Sometimes pusher updates aren't received when we close the App while still offline,
        // so we are setting the bankAccount to null here to ensure that it gets cleared out once we come back online.
        successData: [
            {
                onyxMethod: Onyx.METHOD.MERGE,
                key: `${ONYXKEYS.BANK_ACCOUNT_LIST}`,
                value: {[bankAccountID]: null},
            },
        ],
    };

    API.write(WRITE_COMMANDS.DELETE_PAYMENT_BANK_ACCOUNT, parameters, onyxData);
}

/**
 * Update the user's personal information on the bank account in database.
 *
 * This action is called by the requestor step in the Verified Bank Account flow
 * @param bankAccountID - ID for bank account
 * @param params - User personal data
 */
function updatePersonalInformationForBankAccount(bankAccountID: number, params: RequestorStepProps) {
    API.write(
        WRITE_COMMANDS.UPDATE_PERSONAL_INFORMATION_FOR_BANK_ACCOUNT,
        {
            ...params,
            bankAccountID,
            canUseNewVbbaFlow: true,
        },
        getVBBADataForOnyx(CONST.BANK_ACCOUNT.STEP.REQUESTOR),
    );
}

function validateBankAccount(bankAccountID: number, validateCode: string) {
    const parameters: ValidateBankAccountWithTransactionsParams = {
        bankAccountID,
        validateCode,
    };

    const onyxData: OnyxData = {
        optimisticData: [
            {
                onyxMethod: Onyx.METHOD.MERGE,
                key: ONYXKEYS.REIMBURSEMENT_ACCOUNT,
                value: {
                    isLoading: true,
                    errors: null,
                },
            },
        ],
        successData: [
            {
                onyxMethod: Onyx.METHOD.MERGE,
                key: ONYXKEYS.REIMBURSEMENT_ACCOUNT,
                value: {
                    isLoading: false,
                },
            },
        ],
        failureData: [
            {
                onyxMethod: Onyx.METHOD.MERGE,
                key: ONYXKEYS.REIMBURSEMENT_ACCOUNT,
                value: {
                    isLoading: false,
                },
            },
        ],
    };

    API.write(WRITE_COMMANDS.VALIDATE_BANK_ACCOUNT_WITH_TRANSACTIONS, parameters, onyxData);
}

function clearReimbursementAccount() {
    Onyx.set(ONYXKEYS.REIMBURSEMENT_ACCOUNT, null);
}

/**
 * Function to display and fetch data for Reimbursement Account step
 * @param stepToOpen - current step to open
 * @param subStep - particular step
 * @param localCurrentStep - last step on device
 * @param policyID - policy ID
 */
function openReimbursementAccountPage(stepToOpen: ReimbursementAccountStep, subStep: ReimbursementAccountSubStep, localCurrentStep: ReimbursementAccountStep, policyID: string) {
    const onyxData: OnyxData = {
        optimisticData: [
            {
                onyxMethod: Onyx.METHOD.MERGE,
                key: ONYXKEYS.REIMBURSEMENT_ACCOUNT,
                value: {
                    isLoading: true,
                },
            },
        ],
        successData: [
            {
                onyxMethod: Onyx.METHOD.MERGE,
                key: ONYXKEYS.REIMBURSEMENT_ACCOUNT,
                value: {
                    isLoading: false,
                },
            },
        ],
        failureData: [
            {
                onyxMethod: Onyx.METHOD.MERGE,
                key: ONYXKEYS.REIMBURSEMENT_ACCOUNT,
                value: {
                    isLoading: false,
                },
            },
        ],
    };

    const parameters: OpenReimbursementAccountPageParams = {
        stepToOpen,
        subStep,
        localCurrentStep,
        policyID,
        canUseNewVbbaFlow: true,
    };

    return API.read(READ_COMMANDS.OPEN_REIMBURSEMENT_ACCOUNT_PAGE, parameters, onyxData);
}

/**
 * Updates the bank account in the database with the company step data
 * @param params - Business step form data
 */
function updateCompanyInformationForBankAccount(bankAccountID: number, params: CompanyStepProps) {
    API.write(
        WRITE_COMMANDS.UPDATE_COMPANY_INFORMATION_FOR_BANK_ACCOUNT,
        {
            ...params,
            bankAccountID,
            canUseNewVbbaFlow: true,
        },
        getVBBADataForOnyx(CONST.BANK_ACCOUNT.STEP.COMPANY),
    );
}

/**
 * Add beneficial owners for the bank account and verify the accuracy of the information provided
 * @param params - Beneficial Owners step form params
 */
function updateBeneficialOwnersForBankAccount(bankAccountID: number, params: BeneficialOwnersStepProps) {
    API.write(
        WRITE_COMMANDS.UPDATE_BENEFICIAL_OWNERS_FOR_BANK_ACCOUNT,
        {
            ...params,
            bankAccountID,
            canUseNewVbbaFlow: true,
        },
        getVBBADataForOnyx(),
    );
}

/**
 * Accept the ACH terms and conditions and verify the accuracy of the information provided
 * @param params - Verification step form params
 */
function acceptACHContractForBankAccount(bankAccountID: number, params: ACHContractStepProps) {
    API.write(
        WRITE_COMMANDS.ACCEPT_ACH_CONTRACT_FOR_BANK_ACCOUNT,
        {
            ...params,
            bankAccountID,
            canUseNewVbbaFlow: true,
        },
        getVBBADataForOnyx(),
    );
}

/**
 * Create the bank account with manually entered data.
 * @param plaidMask - scheme for Plaid account number
 */
function connectBankAccountManually(bankAccountID: number, accountNumber?: string, routingNumber?: string, plaidMask?: string, policyID?: string) {
    const parameters: ConnectBankAccountManuallyParams = {
        bankAccountID,
        accountNumber,
        routingNumber,
        plaidMask,
        canUseNewVbbaFlow: true,
        policyID,
    };

    API.write(WRITE_COMMANDS.CONNECT_BANK_ACCOUNT_MANUALLY, parameters, getVBBADataForOnyx(CONST.BANK_ACCOUNT.STEP.BANK_ACCOUNT));
}

/**
 * Verify the user's identity via Onfido
 */
function verifyIdentityForBankAccount(bankAccountID: number, onfidoData: Record<string, unknown>) {
    const parameters: VerifyIdentityForBankAccountParams = {
        bankAccountID,
        onfidoData: JSON.stringify(onfidoData),
        canUseNewVbbaFlow: true,
    };

    API.write(WRITE_COMMANDS.VERIFY_IDENTITY_FOR_BANK_ACCOUNT, parameters, getVBBADataForOnyx());
}

function openWorkspaceView() {
    API.read(
        READ_COMMANDS.OPEN_WORKSPACE_VIEW,
        {},
        {
            optimisticData: [
                {
                    onyxMethod: Onyx.METHOD.MERGE,
                    key: ONYXKEYS.REIMBURSEMENT_ACCOUNT,
                    value: {
                        isLoading: true,
                    },
                },
            ],
            successData: [
                {
                    onyxMethod: Onyx.METHOD.MERGE,
                    key: ONYXKEYS.REIMBURSEMENT_ACCOUNT,
                    value: {
                        isLoading: false,
                    },
                },
            ],
            failureData: [
                {
                    onyxMethod: Onyx.METHOD.MERGE,
                    key: ONYXKEYS.REIMBURSEMENT_ACCOUNT,
                    value: {
                        isLoading: false,
                    },
                },
            ],
        },
    );
}

function handlePlaidError(bankAccountID: number, error: string, errorDescription: string, plaidRequestID: string) {
    const parameters: BankAccountHandlePlaidErrorParams = {
        bankAccountID,
        error,
        errorDescription,
        plaidRequestID,
    };

    API.write(WRITE_COMMANDS.BANK_ACCOUNT_HANDLE_PLAID_ERROR, parameters);
}

/**
 * Set the reimbursement account loading so that it happens right away, instead of when the API command is processed.
 */
function setReimbursementAccountLoading(isLoading: boolean) {
    Onyx.merge(ONYXKEYS.REIMBURSEMENT_ACCOUNT, {isLoading});
}

export {
    acceptACHContractForBankAccount,
    addBusinessWebsiteForDraft,
    addPersonalBankAccount,
    clearOnfidoToken,
    clearPersonalBankAccount,
    clearPlaid,
    setPlaidEvent,
    openPlaidView,
    connectBankAccountManually,
    connectBankAccountWithPlaid,
    deletePaymentBankAccount,
    handlePlaidError,
    setPersonalBankAccountContinueKYCOnSuccess,
    openPersonalBankAccountSetupView,
    clearReimbursementAccount,
    openReimbursementAccountPage,
    updateBeneficialOwnersForBankAccount,
    updateCompanyInformationForBankAccount,
    updatePersonalInformationForBankAccount,
    openWorkspaceView,
    validateBankAccount,
    verifyIdentityForBankAccount,
    setReimbursementAccountLoading,
};

export type {BusinessAddress, PersonalAddress};
