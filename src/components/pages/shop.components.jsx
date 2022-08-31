import 'assets/animation/keyframes.assets.css'
import 'assets/index.assets.css';
import 'assets/global.assets.css';
import 'assets/pages/shop.assets.css'
import React from "react";
import Navbar from "components/blocks/navbar.components.jsx"
import Leftbar from "components/blocks/leftbar.components.jsx"
import Sphere from "assets/img/sphere.svg"
import Badge1Popup from "components/popup/buy-badge1.components"

class Dashboard extends React.Component 
{

    render()
    {
        
      return(
        <div className="home p1">

            <Navbar></Navbar>
            <Leftbar></Leftbar>

            <div className="home-body flex column">

                <div className="shop-about-core flex column">

                    <h1 className="shop-title">Buy a badge</h1>
                    <p className="shop-description">Description Description Description Description Description Description Description </p>

                </div>

                <div className="shop-items-core flex row">

                    <div className="shop-items-cards flex column">

                        <h3 className="shop-items-title">Badge Name 1</h3>
                        <div className="shop-items"></div>
                        <p className="shop-items-description">Description Description Description Description Description Description Description Description </p>
                        <Badge1Popup></Badge1Popup>
                    
                    </div>

                    <div className="shop-items-cards flex column">

                        <h3 className="shop-items-title">Badge Name 1</h3>
                        <div className="shop-items"></div>
                        <p className="shop-items-description">Description Description Description Description Description Description Description Description </p>
                        <Badge1Popup></Badge1Popup>
                    
                    </div>

                    <div className="shop-items-cards flex column">

                        <h3 className="shop-items-title">Badge Name 1</h3>
                        <div className="shop-items"></div>
                        <p className="shop-items-description">Description Description Description Description Description Description Description Description </p>
                        <Badge1Popup></Badge1Popup>
                    
                    </div>

                </div>

            </div>

            <div className="home-sphere flex column center flex row center">
                <img src={Sphere} alt={Sphere} className="sphere-img" />
            </div>

        </div>

      );
    }
}

export default Dashboard;
