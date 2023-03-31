import React, {Component} from 'react';
import Button from '../../components/Button';

class AppleSignInWeb extends Component {
    componentDidMount() {
        const clientId = 'com.expensify.expensifylite.AppleSignIn';
        const redirectURI = 'https://www.expensify.com/partners/apple/loginCallback';
        const scope = 'email name';
        const state = '';
        const script = document.createElement('script');
        script.src = 'https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js';
        script.async = true;
        script.onload = () => {
            window.AppleID.auth.init({
                clientId,
                scope,
                redirectURI,
                state,
                nonce: 'nonce',
                usePopup: false,
            });
        };

        document.body.appendChild(script);

        this.cleanupScript = () => {
            document.body.removeChild(script);
        };

        const handleSignInResponse(){ }
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
