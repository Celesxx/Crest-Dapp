import "assets/index.assets.css";
import "assets/global.assets.css";
import "assets/pages/dashboard.assets.css"
import "assets/pages/dashboard-pr.assets.css"
import React from "react";
import Navbar from "components/blocks/navbar.components.jsx"
import Leftbar from "components/blocks/leftbar.components.jsx"
import Sphere from "assets/img/sphere.svg"
import { LoginActions } from 'store/actions/login.actions.js'
import { DashboardActions } from 'store/actions/dashboard.actions.js'
import { connect } from 'react-redux'


const MapStateToProps = (state) => {
    return { 
        address: state.login.address,
        resToken: state.dashboard.resToken,
        resStable: state.dashboard.resStable,
        totalSupply : state.dashboard.totalSupply,
        totalBurn : state.dashboard.totalBurn,
        price : state.dashboard.price,
        marketCap : state.dashboard.marketCap,
        totalBadges : state.dashboard.totalBadges,
        globalBadges : state.dashboard.globalBadges,
        badge1 : state.dashboard.badge1,
        badge2 : state.dashboard.badge2,
        badge3 : state.dashboard.badge3,
    }; 
};

const mapDispatchToProps = (dispatch) => {
    return {
        loginAction: (loginState, data) => { dispatch(LoginActions(loginState, data)); },
        dashboardAction: (dashboardState, data) => { dispatch(DashboardActions(dashboardState, data)); },
    };
};


class Dashboard extends React.Component 
{
    constructor(props) 
    {
        super(props);
        this.state = 
        {
        }
    }
    
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

            <div className="home-sphere flex column center flex row center">
                <img src={Sphere} alt={Sphere} className="sphere-img" />
            </div>
            

        </div>

      );
    }
}

export default connect(MapStateToProps, mapDispatchToProps)(Dashboard);
