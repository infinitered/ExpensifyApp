import {exists, pathForGroup, unlink} from 'react-native-fs';
import Onyx from 'react-native-onyx';
import CONST from '../../CONST';
import ONYXKEYS from '../../ONYXKEYS';

let appGroupPath;
pathForGroup(CONST.IOS_APP_GROUP).then((path) => (appGroupPath = path));

const cleanUpAction = (file) => {
    if (!file || !file.source.includes(appGroupPath)) {
        return [];
    }
    return [
        {
            onyxMethod: Onyx.METHOD.MERGE,
            key: ONYXKEYS.TEMP_FILES_TO_DELETE,
            value: [file],
        },
    ];
};

let isCleaningUpTempFiles = false;
Onyx.connect({
    key: ONYXKEYS.TEMP_FILES_TO_DELETE,
    callback: (val) => {
        if (!val || isCleaningUpTempFiles) {
            return;
        }
        isCleaningUpTempFiles = true;
        val.forEach((file) => {
            exists(file.source).then((fileExists) => {
                if (!fileExists) {
                    return;
                }
                unlink(file.source);
            });
        });
        Onyx.set(ONYXKEYS.TEMP_FILES_TO_DELETE, []);
        isCleaningUpTempFiles = false;
    },
});

export default cleanUpAction;
