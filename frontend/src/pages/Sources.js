import { useEffect } from "react";
import {useNavigate} from "react-router-dom"



const Sources = ({data}) => {

    const navigate = useNavigate()

    useEffect(() => {
        if(!data.isLoggedIn) {
            data.currentPoint = 'login'
            navigate('/login')
        }
        
      }, [])

    return ( 
        <div className="sources">
            Sources Page is still under development
        </div>
     );
}
 
export default Sources;