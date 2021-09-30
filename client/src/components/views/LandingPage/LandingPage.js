import React, { useEffect } from 'react'
import axios from 'axios';
import { withRouter } from 'react-router-dom'

function LandingPage(props) {

    // LandingPage에 들어오자마자 실행되는 부분
    useEffect(() => {
        // get request를 server에 보낸다.
        // server에서 받아온 response를 console에다 띄운다.
        axios.get('/api/hello')
            .then(response => console.log(response.data))
    }, [])

    const onClickHandler = () => {
        axios.get('/api/users/logout')
        .then(response => {
            if(response.data.success){
                props.history.push("/login")
            }else{
                alert('로그아웃 하는데 실패했습니다.')
            }
        })
    }

    return (
        <div style={{
            display: 'flex', justifyContent: 'center', alignItems: 'center'
            , width: '100%', height: '100vh'
        }}>
            <h2>시작페이지</h2>

            <button onClick={onClickHandler}>로그아웃</button>
        </div>
    )
}

export default withRouter(LandingPage)
