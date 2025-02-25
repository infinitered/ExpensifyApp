import type {CentralPaneName} from '@libs/Navigation/types';
import SCREENS from '@src/SCREENS';

const CENTRAL_PANE_TO_RHP_MAPPING: Partial<Record<CentralPaneName, string[]>> = {
    [SCREENS.WORKSPACE.PROFILE]: [SCREENS.WORKSPACE.NAME, SCREENS.WORKSPACE.CURRENCY],
    [SCREENS.WORKSPACE.REIMBURSE]: [SCREENS.WORKSPACE.RATE_AND_UNIT, SCREENS.WORKSPACE.RATE_AND_UNIT_RATE, SCREENS.WORKSPACE.RATE_AND_UNIT_UNIT],
    [SCREENS.WORKSPACE.MEMBERS]: [SCREENS.WORKSPACE.INVITE, SCREENS.WORKSPACE.INVITE_MESSAGE],
};

export default CENTRAL_PANE_TO_RHP_MAPPING;
