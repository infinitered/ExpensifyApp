import {CachesDirectoryPath, DocumentDirectoryPath, unlink} from 'react-native-fs';
import ClearCache from './types';

console.log({DocumentDirectoryPath});

// `unlink` is used to delete the caches directory
const clearStorage: ClearCache = () => unlink(CachesDirectoryPath);

export default clearStorage;
