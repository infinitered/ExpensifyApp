import Onyx from 'react-native-onyx';
import _ from 'underscore';
import ONYXKEYS from '../../ONYXKEYS';
import * as ShareActions from './Share';

const key = ShareActions.isShareExtension ? ONYXKEYS.SHARE_PERSISTED_REQUESTS : ONYXKEYS.PERSISTED_REQUESTS;

let persistedRequests = [];

Onyx.connect({
    key,
    callback: (val) => (persistedRequests = val || []),
});

function clear() {
    Onyx.set(key, []);
}

/**
 * @param {Array} requestsToPersist
 */
function save(requestsToPersist) {
    if (persistedRequests.length) {
        persistedRequests = persistedRequests.concat(requestsToPersist);
    } else {
        persistedRequests = requestsToPersist;
    }
    Onyx.set(key, persistedRequests);
}

/**
 * @param {Object} requestToRemove
 */
function remove(requestToRemove) {
    /**
     * We only remove the first matching request because the order of requests matters.
     * If we were to remove all matching requests, we can end up with a final state that is different than what the user intended.
     */
    const requests = [...persistedRequests];
    const index = _.findIndex(requests, (persistedRequest) => _.isEqual(persistedRequest, requestToRemove));
    if (index !== -1) {
        requests.splice(index, 1);
    }

    persistedRequests = requests;
    Onyx.set(key, requests);
}

/**
 * @returns {Array}
 */
function getAll() {
    return persistedRequests;
}

export {clear, getAll, remove, save};
