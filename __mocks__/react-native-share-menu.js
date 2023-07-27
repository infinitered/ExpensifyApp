export default {
    addNewShareListener: jest.fn().mockReturnValue({remove: jest.fn()}),
    getInitialShare: jest.fn(),
    getSharedText: jest.fn(),
    ShareMenuReactView: {
        data: jest.fn(),
        dismissExtension: jest.fn(),
    },
};
