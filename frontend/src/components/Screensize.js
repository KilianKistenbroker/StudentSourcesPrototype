import { useState, useEffect } from "react";

const Screensize = (e) => {
    const [windowDimension, setWindowDimension] = useState({
        winWidth: window.innerWidth,
        winHeight: window.innerHeight
    })

    const detectSize =()=> {
        setWindowDimension({
            winWidth: window.innerWidth,
            winHeight: window.innerHeight
        })
    }

    useEffect(() => {
        window.addEventListener('resize', detectSize)

        console.log("height: "+windowDimension.winHeight);
        console.log("width: "+windowDimension.winWidth);

        return () => {
            window.removeEventListener('resize', detectSize)
        }
    }, [windowDimension])


}

export default Screensize