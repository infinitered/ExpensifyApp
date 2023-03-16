import lodashGet from 'lodash/get';

function loadScript(d, s, id, jsSrc, cb, onError) {
    const element = d.getElementsByTagName(s)[0];
    const fjs = element;
    let js = element;
    js = d.createElement(s);
    js.id = id;
    js.src = jsSrc;
    if (fjs && fjs.parentNode) {
        fjs.parentNode.insertBefore(js, fjs);
    } else {
        d.head.appendChild(js);
    }
    js.onerror = onError;
    js.onload = cb;
}

function getGoogleApi() {
    return window.gapi;
}

/**
 * Load Google script into the DOM and initialize the Google Auth API
 */
loadScript(document, 'script', 'google-login', 'https://apis.google.com/js/api.js', () => getGoogleApi().load('auth2', () => getGoogleApi().auth2.init({
    // Load Google Auth
    clientId: '921154746561-gpsoaqgqfuqrfsjdf8l7vohfkfj7b9up.apps.googleusercontent.com',
})));

/**
 * Function to signIn the user with their Google account
 *
 * @returns {Promise<{ token: string, email: string }>}
 */
export default function signInWithGoogle() {
    console.log('Running signInWithGoogle() in src/libs/signInWithGoogle/index.website.js');
    if (!lodashGet(getGoogleApi(), 'auth2')) {
        return Promise.reject(new Error('Google Auth not ready'));
    }
    const GoogleAuth = getGoogleApi().auth2.getAuthInstance();
    return GoogleAuth.signIn().then((res) => {
        const basicProfile = res.getBasicProfile();
        const authResponse = res.getAuthResponse();
        // eslint-disable-next-line no-console
        // console.log('res', res, basicProfile.getEmail(), authResponse);
        return {
            token: authResponse.id_token,
            email: basicProfile.getEmail(),
        };
    });
}
