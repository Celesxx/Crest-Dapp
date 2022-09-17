import 'assets/index.assets.css';
import 'assets/global.assets.css';
import 'assets/pages/dashboard.assets.css'
import 'assets/pages/dashboard-pe.assets.css'
import React from "react";
import Navbar from "components/blocks/navbar.components.jsx"
import Leftbar from "components/blocks/leftbar.components.jsx"
import Restricted from "components/blocks/restricted.components.jsx"
import LoadingData from "components/blocks/loadingData.components.jsx"
import Sphere from "assets/img/sphere.svg"
import { LoginActions } from 'store/actions/login.actions.js'
import { DashboardActions } from 'store/actions/dashboard.actions.js'
import { connect } from 'react-redux'
import ContractHelper from 'helpers/contract.helpers.js'

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
            resToken: this.props.resToken,
            resStable: this.props.resStable,
            totalSupply: this.props.totalSupply != null ? this.props.totalSupply.toFixed(2): this.props.totalSupply,
            totalBurn: this.props.totalBurn != null ? this.props.totalBurn.toFixed(2) : this.props.totalBurn,
            price: this.props.price != null ? this.props.price.toFixed(2) : this.props.price,
            marketCap: this.props.marketCap != null ? this.props.marketCap.toFixed(2) : this.props.marketCap,
            totalBadges: this.props.totalBadges,
            badges: this.props.badges,
            startLoading: this.props.startLoading,
            loading: this.props.loading,
            loadingMax: this.props.loadingMax,
            loadingOver: this.props.loadingOver,
        };

    }

    // async UNSAFE_componentWillMount () 
    // {
    //     if(this.props.address != "")
    //     {
    //         let contractHelper = new ContractHelper()
    //         const provider = await contractHelper.getProvider()

    //         const { resToken, resStable } = await contractHelper.getReserves(provider)
    //         const { totalSupply, totalBurn } = await contractHelper.getTotalSuplyAndBurn(provider)
    //         const { price, marketCap } = await contractHelper.getMarketCapAndPrice(resStable, resToken, totalSupply, 6)
    //         const globalBadges = await contractHelper.getGlobalBadges(provider)
    //         const totalBadges = await contractHelper.getTotalNft(globalBadges)
    //         const formatUnit = await contractHelper.setFormatUnits({totalSupply: totalSupply, totalBurn: totalBurn }, 6)

    //         let data = 
    //         {
    //             resToken : resToken,
    //             resStable: resStable, 
    //             totalSupply: formatUnit.totalSupply,
    //             totalBurn: formatUnit.totalBurn,
    //             price: price, 
    //             marketCap: marketCap,
    //             badges: globalBadges,
    //             totalBadges: totalBadges, 
    //         }


    //         this.props.dashboardAction({data : data, action: "saveData"})

    //         for(const [key, value] of Object.entries(data))
    //         {
    //             if(this.state[key] !== undefined) this.state[key] = value
    //             else console.log(`value not exist : ${key}`)
    //         }

    //         this.forceUpdate();
    //     }
    // }
    
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

                <div className="dashboard-button flex row">
                    <div className="dashboard-button-core flex row">

                        <button onClick={() => this.props.history.push("/dashboard")} className="button-dash button-protocol flex row center">Protocol</button>
                        <button onClick={() => this.props.history.push("/dashboard/personnal")} className="button-dash button-personnal flex row center">Personnal</button>

                    </div>
                </div>

                <div className="dashboard-core flex">

                    <div className="dashboard-cards flex column">
                        <p className="title-dashboard">$CREST Price</p>
                        <div className="dashboard-items flex row center">
                            <p className="dashboard-text-stat">{this.state.price}</p>
                        </div>
                    </div>

                    <div className="dashboard-cards flex column">
                        <p className="title-dashboard">Market Cap</p>
                        <div className="dashboard-items flex row center">
                            <p className="dashboard-text-stat">{this.state.marketCap}</p>
                        </div>
                    </div>

                    <div className="dashboard-cards flex column">
                        <p className="title-dashboard">Total NFT's</p>
                        <div className="dashboard-items flex row center">
                            <p className="dashboard-text-stat">{this.state.totalBadges}</p>
                        </div>
                    </div>

                    <div className="dashboard-cards flex column">
                        <p className="title-dashboard">Total Supply</p>
                        <div className="dashboard-items flex row center">
                            <p className="dashboard-text-stat">{this.state.totalSupply}</p>
                        </div>
                    </div>

                    <div className="dashboard-cards flex column">
                        <p className="title-dashboard">Total Token Burn</p>
                        <div className="dashboard-items flex row center">
                            <p className="dashboard-text-stat">{this.state.totalBurn}</p>
                        </div>
                    </div>

                    <div className="dashboard-badge-core flex column">
                        <div className="dashboard-badge flex column">

                            <div className="dashboard-badge-items flex row">
                                <p className="dashboard-badge-title">{this.state.badges.length != 0 ? this.state.badges[0].name : '' }</p>
                                <p className="dashboard-badge-count">{this.state.badges.length != 0 ? this.state.badges[0].totalSupply : ''}/{this.state.badges.length != 0 ? this.state.badges[0].max : ''}</p>
                            </div>
                            <div className="dashboard-badge-items flex row">
                                <p className="dashboard-badge-title">{this.state.badges.length != 0 ? this.state.badges[1].name : '' }</p>
                                <p className="dashboard-badge-count">{this.state.badges.length != 0 ? this.state.badges[1].totalSupply : ''}/{this.state.badges.length != 0 ? this.state.badges[1].max : ''}</p>
                            </div>
                            <div className="dashboard-badge-items flex row">
                                <p className="dashboard-badge-title">{this.state.badges.length != 0 ? this.state.badges[2].name : '' }</p>
                                <p className="dashboard-badge-count">{this.state.badges.length != 0 ? this.state.badges[2].totalSupply : ''}/{this.state.badges.length != 0 ? this.state.badges[2].max : ''}</p>
                            </div>

                        </div>
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
