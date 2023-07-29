import CONST from '../../../CONST';
/**
 * @returns {Boolean}
 */
export default function shouldShowDeeplink(screenName, isAuthenticated) {
    // TODO, reword comment, fix JSDoc
    // We want to show the deep link prompt on authenticated HOME, but not
    // unauthenticated HOME screen. They have the same name and path, so we have
    // to check to see if the user is authenticated.
    // For now we don't want to block any authenticated screens from showing the
    // deep link prompt, so isAuthenticated is a shortcut.
    console.log("SHOULD SHOW", isAuthenticated, screenName, CONST.DEEPLINK_PROMPT_BLOCKLIST)
    if (isAuthenticated) {
        return true;
    }
    return !CONST.DEEPLINK_PROMPT_BLOCKLIST.includes(screenName);
}
