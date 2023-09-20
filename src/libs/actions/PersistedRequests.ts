import isEqual from 'lodash/isEqual';
import Onyx from 'react-native-onyx';
import ONYXKEYS from '../../ONYXKEYS';
import {Request} from '../../types/onyx';
import isShareExtension from '../Share/isShareExtension';

const key = isShareExtension ? ONYXKEYS.SHARE_PERSISTED_REQUESTS : ONYXKEYS.PERSISTED_REQUESTS;

let persistedRequests: Request[] = [];

Onyx.connect({
    key,
    callback: (val) => (persistedRequests = val ?? []),
});

/**
 * This promise is only used by tests. DO NOT USE THIS PROMISE IN THE APPLICATION CODE
 */
function clear() {
    return Onyx.set(key, []);
}

function save(requestsToPersist: Request[]) {
    if (persistedRequests.length) {
        persistedRequests = persistedRequests.concat(requestsToPersist);
    } else {
        persistedRequests = requestsToPersist;
    }
    Onyx.set(key, persistedRequests);
}

function remove(requestToRemove: Request) {
    /**
     * We only remove the first matching request because the order of requests matters.
     * If we were to remove all matching requests, we can end up with a final state that is different than what the user intended.
     */
    const requests = [...persistedRequests];
    const index = requests.findIndex((persistedRequest) => isEqual(persistedRequest, requestToRemove));
    if (index !== -1) {
        requests.splice(index, 1);
    }

    persistedRequests = requests;
    Onyx.set(key, requests);
}

function getAll(): Request[] {
    return persistedRequests;
}

export {clear, getAll, remove, save};
