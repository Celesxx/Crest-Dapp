import 'assets/index.assets.css';
import 'assets/global.assets.css';
import 'assets/pages/dashboard.assets.css'
import 'assets/pages/dashboard-pe.assets.css'
import React from "react";
import Navbar from "components/blocks/navbar.components.jsx"
import Leftbar from "components/blocks/leftbar.components.jsx"
import { useHistory } from 'react-router-dom';

class Dashboard extends React.Component 
{

    render()
    {
        

      return(
        <div className="home p1">

            <Navbar></Navbar>
            <Leftbar></Leftbar>

            <div className="home-body flex column">

                <div className="dashboard-button flex row">
                    <div className="dashboard-button-core flex row">

                        <button onClick={() => this.props.history.push("/dashboard")} className="button-dash button-protocol flex row center">Protocol</button>
                        <button onClick={() => this.props.history.push("/dashboard/personnal")} className="button-dash button-personnal flex row center">Personnal</button>

                    </div>
                </div>

                <div className="dashboard-core flex">

                    <div className="dashboard-cards flex column">
                        <p className="title-dashboard">$CREST Price</p>
                        <div className="dashboard-items"></div>
                    </div>

                    <div className="dashboard-cards flex column">
                        <p className="title-dashboard">Market Cap</p>
                        <div className="dashboard-items"></div>
                    </div>

                    <div className="dashboard-cards flex column">
                        <p className="title-dashboard">Total NFT's</p>
                        <div className="dashboard-items"></div>
                    </div>

                    <div className="dashboard-cards flex column">
                        <p className="title-dashboard">Total Supply</p>
                        <div className="dashboard-items"></div>
                    </div>

                    <div className="dashboard-cards flex column">
                        <p className="title-dashboard">Total Token Burn</p>
                        <div className="dashboard-items"></div>
                    </div>

                    <div className="dashboard-badge-core flex column">
                        <div className="dashboard-badge flex column">

                            <div className="dashboard-badge-items flex row">
                                <p className="dashboard-badge-title">Total badge 1:</p>
                                <p className="dashboard-badge-count">0/0</p>
                            </div>
                            <div className="dashboard-badge-items flex row">
                                <p className="dashboard-badge-title">Total badge 1:</p>
                                <p className="dashboard-badge-count">0/0</p>
                            </div>
                            <div className="dashboard-badge-items flex row">
                                <p className="dashboard-badge-title">Total badge 1:</p>
                                <p className="dashboard-badge-count">0/0</p>
                            </div>

                        </div>
                    </div>

                </div>

            </div>

            <div className="home-ellipse flex column center">
                <div className="ellipse l1"></div>
            </div>
            
            <div className="home-ellipse flex column center">
                <div className="ellipse l2"></div>
            </div>

            <div className="home-ellipse flex column center">
                <div className="ellipse l3"></div>
            </div>

        </div>

      );
    }
}

export default Dashboard;
