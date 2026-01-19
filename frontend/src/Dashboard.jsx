import  { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const [userInfo, setUserInfo] = useState(null);
    console.log(userInfo);
    const navigate = useNavigate();

    useEffect(()=>{
        const data = localStorage.getItem('user-info');
        const userData = JSON.parse(data);
        setUserInfo(userData);
    },[])

    const handleLogout = ()=>{
        localStorage.removeItem('user-info');
        navigate('/login');
    }

    return (
        <>
            <h1>Welcome {userInfo?.name}</h1>
            <h3>{userInfo?.email}</h3>
            <div style={{ display:'flex', alignItems:'center' , gap:'20px',  }}>
            <img src={userInfo?.image} alt={userInfo?.name} referrerPolicy="no-referrer" style={{ width: '100px', height: '100px' , borderRadius: '90%' }} />          
            <button onClick={handleLogout}
            >Logout
            </button>
             </div>
        </>
    )
}

export default Dashboard