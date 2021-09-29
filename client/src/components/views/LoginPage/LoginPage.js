import Axios from 'axios'
import React, { useState }from 'react'
import {useDispatch} from 'react-redux';
import {loginUser} from '../../../_actions/user_action';

function LoginPage(props) {
    const dispatch = useDispatch();

    // state 설정
    const [Email, setEmail] = useState("")
    const [Password, setPassword] = useState("")

    // 입력칸에 칠 수 있게 함
    const onEmailHandler = (event) => {
        setEmail(event.currentTarget.value)
    }
    const onPasswordHandler = (event) => {
        setPassword(event.currentTarget.value)
    }
    const onSubmitHandler = (event) => {
        // 버튼을 누를 때 새로고침되는걸 방지 -> 안하면 아래 명령어를 안하고 새로고침만 함
        event.preventDefault();

        let body = {
            email: Email,
            password: Password
        }
        // dispatch: _actions/user_action.js
        dispatch(loginUser(body))
            .then(response => {
            if (response.payload.loginSuccess){
                props.history.push('/')
            } else {
                alert('Error')
            }
        })
    }
    return (
        <div style={{ display:'flex', justifyContent: 'center', alignItems: 'center'
        , width: '100%', height: '100vh'
        }}>
            <form style={{display: 'flex', flexDirection: 'column'}} onSubmit={onSubmitHandler}>
                <label>Email</label>
                {/* value에 state 기입, onChange로 입력칸 기입 가능 */}
                <input type="email" value={Email} onChange={onEmailHandler} />
                <label>Password</label>
                <input type="password" value={Password} onChange={onPasswordHandler} />
                <br />
                <button type="submit">
                    Login
                </button>
            </form>
        </div>
    )
}

export default LoginPage
