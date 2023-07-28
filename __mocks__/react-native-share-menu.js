const ShareMenu = {
    addNewShareListener: jest.fn().mockReturnValue({remove: jest.fn()}),
    getInitialShare: jest.fn(),
    getSharedText: jest.fn(),
};

const ShareMenuReactView = {
    data: jest.fn().mockResolvedValue({}),
    dismissExtension: jest.fn(),
};

export default ShareMenu;
export {ShareMenuReactView};
