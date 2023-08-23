const CachesDirectoryPath = jest.fn();
const pathForGroup = jest.fn().mockResolvedValue('');
const unlink = jest.fn(() => new Promise((res) => res()));

export {CachesDirectoryPath, pathForGroup, unlink};
