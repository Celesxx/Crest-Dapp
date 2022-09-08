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
import Address from 'contracts/address.contracts.json'
import AbiUniswap from 'contracts/abis/router/UniswapV2Pair.sol/UniswapV2Pair.json'
import { ethers } from "ethers";
import Web3Modal from 'web3modal'
import ContractHelper from 'helpers/contract.helpers.js'

const MapStateToProps = (state) => {
    return { 
        address: state.login.address,
        provider : state.login.provider,
        price : state.dashboard.price
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
            price: null,
        };

        // this.getDataDashBoard = this.getDataDashBoard.bind(this);
    }

    async UNSAFE_componentWillMount () 
    {
        if(this.props.address != "")
        {
            let contractHelper = new ContractHelper()
            const data = await contractHelper.getProvider()
            const price = await contractHelper.getPrice(data)
            this.state.price = price
            this.forceUpdate();
        }else
        {
            console.log("test0")
        }
    }
    
    componentDidUpdate(prevProps, prevState) {
        this.state.provider = this.props.provider
        this.state.price = this.props.price
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
                        <div className="dashboard-items flex row center"><p className="dashboard-text-stat">{this.state.price}</p></div>
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

            <div className="home-sphere flex column center flex row center">
                <img src={Sphere} alt={Sphere} className="sphere-img" />
            </div>

        </div>

      );
    }
}

export default connect(MapStateToProps, mapDispatchToProps)(Dashboard);
