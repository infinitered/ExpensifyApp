import {GoogleSignin} from '@react-native-google-signin/google-signin';

GoogleSignin.configure({
    webClientId: '1077593896310 - eg0jm7bfn9ri3b424ledtfo67l3esdk8.apps.googleusercontent.com',
    iosClientId: '1077593896310-3ni0ht3gtiogt3mgjoiciron95pn5j3l.apps.googleusercontent.com',
});

/**
 * Function to signIn with user with their Google account
 *
 * @returns {Promise<{ token: string, email: string}>}
 *
 */
export default function signInWithGoogle() {
    return GoogleSignin.signIn().then((res) => {
        // eslint-disable-next-line no-console
        console.log('res from googlesignin', res);
        return {
            token: res.idToken,
            email: res.user.email,
        };
    });
}
