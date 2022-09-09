import 'assets/index.assets.css';
import 'assets/global.assets.css';
import 'assets/pages/dashboard.assets.css'
import 'assets/pages/dashboard-pe.assets.css'
import React from "react";
import Navbar from "components/blocks/navbar.components.jsx"
import Leftbar from "components/blocks/leftbar.components.jsx"
import Sphere from "assets/img/sphere.svg"
import { LoginActions } from 'store/actions/login.actions.js'
import { DashboardActions } from 'store/actions/dashboard.actions.js'
import { connect } from 'react-redux'
import UserContext from 'userContext.js'
import ContractHelper from 'helpers/contract.helpers.js'

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
    static contextType = UserContext

    constructor(props) 
    {
        super(props);
        this.state = 
        {
            provider: {},
            resToken: this.props.resToken,
            resStable: this.props.resStable,
            totalSupply: this.props.totalSupply,
            totalBurn: this.props.totalBurn,
            price: this.props.price,
            marketCap: this.props.marketCap,
            totalBadges: this.props.totalBadges,
            globalBadges: this.props.globalBadges,
            badge1: 
            {
                name: this.props.badge1.name,
                totalSupply: this.props.badge1.totalSupply,
                max: this.props.badge1.max,
            },
            badge2:
            {
                name: this.props.badge2.name,
                totalSupply: this.props.badge2.totalSupply,
                max: this.props.badge2.max,
            },
            badge3:
            {
                name: this.props.badge3.name,
                totalSupply: this.props.badge3.totalSupply,
                max: this.props.badge3.max,
            },
        };

    }

    async UNSAFE_componentWillMount () 
    {
        if(this.props.address != "")
        {
            let contractHelper = new ContractHelper()
            const provider = await contractHelper.getProvider()

            const { resToken, resStable } = await contractHelper.getReserves(provider)
            const { totalSupply, totalBurn } = await contractHelper.getTotalSuplyAndBurn(provider)
            const { price, marketCap } = await contractHelper.getMarketCapAndPrice(resStable, resToken, totalSupply, 6)
            const globalBadges = await contractHelper.getGlobalBadges(provider)
            const totalBadges = await contractHelper.getTotalNft(globalBadges)

            this.props.dashboardAction({resToken: resToken, action: "resToken"})
            this.props.dashboardAction({resStable: resStable, action: "resStable"})
            this.props.dashboardAction({totalSupply: totalSupply, action: "totalSupply"})
            this.props.dashboardAction({totalBurn: totalBurn, action: "totalBurn"})
            this.props.dashboardAction({price: price, action: "price"})
            this.props.dashboardAction({marketCap: marketCap, action: "marketCap"})
            this.props.dashboardAction({totalBadges: totalBadges, action: "totalBadges"})
            this.props.dashboardAction({globalBadges: globalBadges, action: "globalBadges"})

            const formatUnit = await contractHelper.setFormatUnits({totalSupply: totalSupply, totalBurn: totalBurn }, 6)

            this.state.price = this.props.price
            this.state.resToken = this.props.resToken
            this.state.resStable = this.props.resStable
            this.state.totalSupply = formatUnit.totalSupply
            this.state.totalBurn = formatUnit.totalBurn
            this.state.marketCap = this.props.marketCap
            this.state.totalBadges = this.props.totalBadges
            console.log(this.props.globalBadges)
            this.state.badge1 = this.props.globalBadges[0]
            this.state.badge2 = this.props.globalBadges[1]
            this.state.badge3 = this.props.globalBadges[2]


            this.forceUpdate();
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
                                <p className="dashboard-badge-title">{this.state.badge1.name}</p>
                                <p className="dashboard-badge-count">{this.state.badge1.totalSupply}/{this.state.badge1.max}</p>
                            </div>
                            <div className="dashboard-badge-items flex row">
                                <p className="dashboard-badge-title">{this.state.badge2.name}</p>
                                <p className="dashboard-badge-count">{this.state.badge2.totalSupply}/{this.state.badge2.max}</p>
                            </div>
                            <div className="dashboard-badge-items flex row">
                                <p className="dashboard-badge-title">{this.state.badge3.name}</p>
                                <p className="dashboard-badge-count">{this.state.badge3.totalSupply}/{this.state.badge3.max}</p>
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
