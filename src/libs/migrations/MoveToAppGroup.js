/* eslint-disable @lwc/lwc/no-async-await */
import {Platform} from 'react-native';
import {DocumentDirectoryPath, exists, moveFile, pathForGroup} from 'react-native-fs';
import CONST from '../../CONST';

export default async function () {
    if (Platform.OS !== 'ios') return;
    const appGroupPath = await pathForGroup(CONST.IOS_APP_GROUP);
    const hasAppGroupDB = await exists(`${appGroupPath}/OnyxDB`);
    const hasDocsDirDB = await exists(`${DocumentDirectoryPath}/OnyxDB`);
    if (!hasAppGroupDB && hasDocsDirDB) {
        await moveFile(`${DocumentDirectoryPath}/OnyxDB`, `${appGroupPath}/OnyxDB`);
        await moveFile(`${DocumentDirectoryPath}/OnyxDB-shm`, `${appGroupPath}/OnyxDB-shm`);
        await moveFile(`${DocumentDirectoryPath}/OnyxDB-wal`, `${appGroupPath}/OnyxDB-wal`);
    }
}
