import React,{Component} from 'react';
import './auth.css';

import AuthContext from '../context/auth-context';

class AuthPage extends Component{
    state = {
        isLogin : true
    }

    static contextType = AuthContext;

    constructor(props) {
        super(props);
        this.emailEl = React.createRef();
        this.passwordEl = React.createRef();
    }

    submitHandler = (e) => {
        e.preventDefault();
        const email = this.emailEl.current.value;
        const password = this.passwordEl.current.value;
        if(email.trim().length===0 || password.trim().length === 0){
            return;
        }

        let requestBody = {
            query:`
                query {
                    login(email: "${email}", password: "${password}"){
                        userId
                        token
                        tokenExpiration
                    }
                }
            `
        }

        if(!this.state.isLogin){
            requestBody = {
                query: `
                mutation{
                    createUser(userInput:{email:"${email}",password:"${password}"}) {
                        _id
                        email
                    }
                }
            `
            };
        }

        fetch('http://localhost:5000/graphql',{
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res=>{
            if(res.status !== 200 && res.status !== 201){
                throw new Error('Failed');
            }
            return res.json();
        }).then(resData=>{
            if(resData.data.login.token){
                this.context.login(
                    resData.data.login.token,
                    resData.data.login.userId,
                    resData.data.login.tokenExpiration
                );
            }
            console.log(resData);
        }).catch(e=>{
            console.log(e);
        });
    }

    switchModeHandler = () => {
        this.setState(prevState => {
            return {
                isLogin : !prevState.isLogin
            }
        });
    };

    render(){
        return (
            <div className="form__div">
                <form className="auth-form" onSubmit={this.submitHandler}>
                    <h1 className="form__header">SIGN IN</h1>
                    <div className="form-control">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            placeholder="Enter your email"
                            ref={this.emailEl}
                        />
                    </div>
                    <div className="form-control">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            placeholder="Enter your password"
                            ref={this.passwordEl}
                        />
                    </div>
                    <div className="form-actions">
                        <button
                            type="button"
                            onClick={this.switchModeHandler}
                        >
                            Switch To {this.state.isLogin ? 'Sign Up' : 'Login'}
                        </button>
                        <button type="submit">Submit</button>
                    </div>
                </form>
            </div>
        );
    }
}

export default AuthPage;