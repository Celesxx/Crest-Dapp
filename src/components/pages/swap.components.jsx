import 'assets/animation/keyframes.assets.css'
import 'assets/index.assets.css';
import 'assets/global.assets.css';
import 'assets/pages/swap.assets.css'
import React from "react";
import Navbar from "components/blocks/navbar.components.jsx"
import Leftbar from "components/blocks/leftbar.components.jsx"
import Sphere from "assets/img/sphere.svg"

class Dashboard extends React.Component 
{

    render()
    {
        
      return(
        <div className="home p1">

            <Navbar></Navbar>
            <Leftbar></Leftbar>

            <div className="home-body flex column">

            </div>

            <div className="home-sphere flex column center flex row center">
                <img src={Sphere} alt={Sphere} className="sphere-img" />
            </div>

        </div>

      );
    }
}

export default Dashboard;
