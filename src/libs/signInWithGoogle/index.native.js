import {GoogleSignin} from '@react-native-google-signin/google-signin';
import * as Button from '../../components/Button';

GoogleSignin.configure({
    webClientId: '921154746561-gpsoaqgqfuqrfsjdf8l7vohfkfj7b9up.apps.googleusercontent.com',

    iosClientId: '921154746561-s3uqn2oe4m85tufi6mqflbfbuajrm2i3.apps.googleusercontent.com',
    offlineAccess: false,
});

/**
 * Function to signIn the user with their Google account
 *
 * @returns {Promise<{ token: string, email: string }>}
 */

const GoogleSignInButton = ({clientId, onCredentialResponse}) => {
    console.log('GoogleSignInButton', clientId, onCredentialResponse);
    function signInWithGoogle() {
        return GoogleSignin.signIn().then(res => ({
            token: res.idToken,
            email: res.user.email,
        }));
    }

    return <Button success title="Sign in with Google" onPress={signInWithGoogle} />;
};

export default GoogleSignInButton;
