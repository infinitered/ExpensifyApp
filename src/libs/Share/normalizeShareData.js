import isArray from 'lodash/isArray';

export default function (shared) {
    return isArray(shared.data) ? shared.data[0] : shared;
}
