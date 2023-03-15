import Onyx from 'react-native-onyx';
import ONYXKEYS from '../../ONYXKEYS';

function storeSharedData(items) {
    Onyx.set(ONYXKEYS.SHARED_DATA, items);
}

function clearSharedData() {
    Onyx.set(ONYXKEYS.SHARED_DATA, []);
}

export {
    storeSharedData,
    clearSharedData,
};
