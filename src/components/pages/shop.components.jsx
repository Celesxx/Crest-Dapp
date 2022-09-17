import 'assets/animation/keyframes.assets.css'
import 'assets/index.assets.css';
import 'assets/global.assets.css';
import 'assets/pages/shop.assets.css'
import React from "react";
import Navbar from "components/blocks/navbar.components.jsx"
import Leftbar from "components/blocks/leftbar.components.jsx"
import Sphere from "assets/img/sphere.svg"
import Badge1Popup from "components/popup/buy-badge1.components"
import Ruby from 'assets/img/ruby.mp4'
import Amber from 'assets/img/amber.mp4'
import Amethyst from 'assets/img/amethyst.mp4'
import { connect } from 'react-redux'
import { LoginActions } from 'store/actions/login.actions.js'
import { DashboardActions } from 'store/actions/dashboard.actions.js'
import Restricted from "components/blocks/restricted.components.jsx"
import LoadingData from "components/blocks/loadingData.components.jsx"

const MapStateToProps = (state) => {
    return { 
        address: state.login.address,
        resToken: state.dashboard.resToken,
        resStable: state.dashboard.resStable,
        totalSupply: state.dashboard.totalSupply,
        totalBurn: state.dashboard.totalBurn,
        price: state.dashboard.price,
        marketCap: state.dashboard.marketCap,
        totalNfts: state.dashboard.totalNfts,
        dailyReward: state.dashboard.dailyReward,
        pendingReward: state.dashboard.pendingReward,
        crestBalance: state.dashboard.crestBalance,
        nftsDatas: state.dashboard.nftsDatas,
        totalBadges: state.dashboard.totalBadges,
        badges: state.dashboard.badges,
        claimBadges: state.dashboard.claimBadges,
        totalReward: state.dashboard.totalReward,
        startLoading: state.dashboard.startLoading,
        loading: state.dashboard.loading,
        loadingMax: state.dashboard.loadingMax,
        loadingOver: state.dashboard.loadingOver,
    }; 
};

const mapDispatchToProps = (dispatch) => {
    return {
        loginAction: (data) => { dispatch(LoginActions(data)); },
        dashboardAction: (data) => { dispatch(DashboardActions(data)); },
    };
};

class Dashboard extends React.Component 
{

    constructor(props) 
    {
        super(props);
        this.state = 
        {
            address: this.props.address,
            startLoading: this.props.startLoading,
            loading: this.props.loading,
            loadingMax: this.props.loadingMax,
            loadingOver: this.props.loadingOver,
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) 
    {
        for(const [key, value] of Object.entries(this.state))
        {
            if (prevProps[key] !== this.props[key])
            {   
                this.state[key] = this.props[key] 

                this.forceUpdate();
            }
        }
    }

    render()
    {
        
      return(
        <div className="home p1">

            <Navbar></Navbar>
            <Leftbar></Leftbar>

            {
                this.state.startLoading == true && this.state.loadingOver == false && this.state.address !== null &&
                ( <LoadingData /> )
            }
            <div className="home-body flex column">

                {
                    this.state.address == "" &&
                    ( <Restricted /> )
                }

                <div className="shop-about-core flex column">

                    <h1 className="shop-title">Buy a badge</h1>
                    <p className="shop-description">Description Description Description Description Description Description Description </p>

                </div>

                <div className="shop-items-core flex row">

                    <div className="shop-items-cards flex column">

                        <h3 className="shop-items-title">Badge Name 1</h3>
                        <div className="shop-items">
                            <video className="shop-video" autoPlay muted loop>
                                <source src={Ruby} type="video/mp4" />
                            </video>
                        </div>
                        <p className="shop-items-description">Description Description Description Description Description Description Description Description </p>
                        <Badge1Popup></Badge1Popup>
                    
                    </div>

                    <div className="shop-items-cards flex column">

                        <h3 className="shop-items-title">Badge Name 1</h3>
                        <div className="shop-items">
                            <video className="shop-video" autoPlay muted loop>
                                <source src={Amber} type="video/mp4" />
                            </video>
                        </div>
                        <p className="shop-items-description">Description Description Description Description Description Description Description Description </p>
                        <Badge1Popup></Badge1Popup>
                    
                    </div>

                    <div className="shop-items-cards flex column">

                        <h3 className="shop-items-title">Badge Name 1</h3>
                        <div className="shop-items">
                            <video className="shop-video" autoPlay muted loop>
                                <source src={Amethyst} type="video/mp4" />
                            </video>
                        </div>
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

export default connect(MapStateToProps, mapDispatchToProps)(Dashboard);
