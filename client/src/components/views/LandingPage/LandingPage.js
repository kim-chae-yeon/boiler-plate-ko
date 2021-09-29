import React, {useEffect} from 'react'
import axios from 'axios';
function LandingPage() {

    // LandingPage에 들어오자마자 실행되는 부분
    useEffect(() => {
        // get request를 server에 보낸다.
        axios.get('/api/hello')
        // server에서 받아온 response를 console에다 띄운다.
        .then(response => console.log(response.data))
    }, [])

    return (
        <div style={{ display:'flex', justifyContent: 'center', alignItems: 'center'
        , width: '100%', height: '100vh'
        }}>
            <h2>시작페이지</h2>
        </div>
    )
}

export default LandingPage
