import 'assets/index.assets.css';
import 'assets/global.assets.css';
import 'assets/pages/dashboard.assets.css'
import 'assets/pages/dashboard-pr.assets.css'
import React from "react";
import Navbar from "components/blocks/navbar.components.jsx"
import Leftbar from "components/blocks/leftbar.components.jsx"

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

                <div className="dashboard-personnal-cards flex">

                    <div className="personnal-cards flex column"> </div>
                    <div className="personnal-cards flex column"> </div>
                    <div className="personnal-cards flex column"> </div>
                    <div className="personnal-cards flex column"> </div>
                    <div className="personnal-cards flex column"> </div>
                    <div className="personnal-cards flex column"> </div>
                    <div className="personnal-cards flex column"> </div>

                </div>

                <div className="dashboard-personnal-info flex row">

                    <div className="personnal-info-cards flex column">
                        <p className="info-title">My NFT's</p>
                        <div className="info-cards"></div>
                    </div>

                    <div className="personnal-info-cards flex column">
                        <p className="info-title">My $CREST Balance</p>
                        <div className="info-cards"></div>
                    </div>

                    <div className="personnal-info-cards flex column">
                        <p className="info-title">My Daily Rewards</p>
                        <div className="info-cards"></div>
                    </div>

                    <div className="personnal-info-cards flex column">
                        <p className="info-title">My Pending Reward</p>
                        <div className="info-cards"></div>
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
