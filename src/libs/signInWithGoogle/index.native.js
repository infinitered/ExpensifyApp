import {GoogleSignin} from '@react-native-google-signin/google-signin';

GoogleSignin.configure({
    webClientId: '921154746561-gpsoaqgqfuqrfsjdf8l7vohfkfj7b9up.apps.googleusercontent.com',
    iosClientId: '1077593896310-3ni0ht3gtiogt3mgjoiciron95pn5j3l.apps.googleusercontent.com',
});

/**
 * Function to signIn with user with their Google account
 *
 * @returns {Promise<{ token: string, email: string}>}
 *
 */
export default function signInWithGoogle() {
    return GoogleSignin.signIn()
        .then((res) => {
            // eslint-disable-next-line no-console
            console.log('res from googlesignin', res);
            return {
                token: res.idToken,
                email: res.user.email,
            };
        })
        .catch((err) => {
            // eslint-disable-next-line no-console
            console.log('err from googlesignin', err);
        });
}
