import React, {Component} from 'react';
import Button from '../../components/Button';

class AppleSignInWeb extends Component {

    componentDidMount() {
        const clientId = 'com.chat.expensify.chat';
        const redirectURI = 'https://www.expensify.com/partners/apple/loginCallback';
        const scope = 'name email';
        const state = 'RANDOM_GENERATED_STRING';
        const script = document.createElement('script');
        script.src = 'https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js';
        script.async = true;
        script.onload = () => {
            window.AppleID.auth.init({
                clientId: clientId,
                scope: scope,
                redirectURI: redirectURI,
                state: state,
                usePopup: true,
            });
        };

        document.body.appendChild(script);

        this.cleanupScript = () => {
            document.body.removeChild(script);
        };

        const handleSignInResponse = async (responseUrl) => {
            // to do: handle response
        }
    }

    componentWillUnmount() {
        if (this.cleanupScript) {
            this.cleanupScript();
        }
    }

    handleSignIn = () => {
        window.AppleID.auth.signIn();
    };

    render() {
        return (
            <Button text="apple sign in" onPress={this.handleSignIn} />

        );
    }
}

export default AppleSignInWeb;
