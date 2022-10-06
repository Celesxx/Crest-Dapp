import 'assets/css/index.assets.css';
import 'assets/css/global.assets.css';
import 'assets/css/pages/dashboard.assets.css'
import 'assets/css/pages/dashboard-pe.assets.css'
import React from "react";
import Navbar from "components/blocks/navbar.block.jsx"
import Leftbar from "components/blocks/leftbar.block.jsx"
import Restricted from "components/blocks/restricted.block.jsx"
import LoadingData from "components/blocks/loading-data.block.jsx"
import Sphere from "assets/img/sphere.svg"
import { LoginActions } from 'store/actions/login.actions.js'
import { DashboardActions } from 'store/actions/dashboard.actions.js'
import { connect } from 'react-redux'
import ContractHelper from 'helpers/contract.helpers.js'
import Language from 'assets/data/language.json'

const MapStateToProps = (state) => {
    return { 
        address: state.login.address,
        resToken: state.dashboard.resToken,
        resStable: state.dashboard.resStable,
        totalSupply: state.dashboard.totalSupply,
        totalBurn: state.dashboard.totalBurn,
        badges: state.dashboard.badges,
        startLoading: state.dashboard.startLoading,
        loading: state.dashboard.loading,
        loadingMax: state.dashboard.loadingMax,
        loadingOver: state.dashboard.loadingOver,
        language: state.login.language
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
            totalSupply: this.props.totalSupply,
            totalBurn: this.props.totalBurn,
            price: null,
            marketCap: null,
            totalBadges: null,
            badges: this.props.badges,
            startLoading: this.props.startLoading,
            loading: this.props.loading,
            loadingMax: this.props.loadingMax,
            loadingOver: this.props.loadingOver,
            language: this.props.language,
            width : props.width,
        };

    }


    UNSAFE_componentWillMount()
    {
        if(this.state.resStable != null && this.props.resToken && this.state.totalSupply != null && this.state.address != 0 && this.state.badges.length != 0)
        {
            let contractHelper = new ContractHelper()
            const { price, marketCap } = contractHelper.getMarketCapAndPrice(this.props.resStable, this.props.resToken, this.props.totalSupply, 6)
            const totalNbrBadges = contractHelper.getTotalNft(this.props.badges)
            this.state.price = price
            this.state.marketCap = marketCap
            this.state.totalBadges = totalNbrBadges
            this.forceUpdate()
        } 
    }

    
    componentDidUpdate(prevProps, prevState, snapshot) 
    {
        for(const [key, value] of Object.entries(this.state))
        {
            if (prevProps[key] !== this.props[key])
            {   
                if(this.state.resStable != null && this.props.resToken && this.state.totalSupply != null && this.props.address != "" && this.state.badges.length != 0)
                {
                    let contractHelper = new ContractHelper()
                    const { price, marketCap } = contractHelper.getMarketCapAndPrice(this.props.resStable, this.props.resToken, this.props.totalSupply, 6)
                    const totalNbrBadges = contractHelper.getTotalNft(this.props.badges)
                    this.state.price = price
                    this.state.marketCap = marketCap
                    this.state.totalBadges = totalNbrBadges
                }
                this.state[key] = this.props[key] 
                this.forceUpdate();
            }
        }
    }


    render()
    {
        let contractHelper = new ContractHelper()

        return(
            <div className="home-body flex column">

                {
                    this.state.address == "" &&
                    ( <Restricted /> )
                }

                <div className="dashboard-button flex row">
                    <div className="dashboard-button-core flex row">

                        <button onClick={() => this.props.history.push("/dashboard")} className="button-dash button-protocol flex row center">{ Language[this.state.language].dashboard.protocolTitle }</button>
                        <button onClick={() => this.props.history.push("/dashboard/personnal")} className="button-dash button-personnal flex row center">{ Language[this.state.language].dashboard.personalTitle }</button>

                    </div>
                </div>

                <div className="dashboard-core flex">

                    <div className="dashboard-cards flex column">
                        <p className="title-dashboard">{ Language[this.state.language].dashboard.crestPrice }</p>
                        <div className="dashboard-items flex row center">
                            <p className="dashboard-text-stat">{contractHelper.getNb(this.state.price, 2)}</p>
                        </div>
                    </div>

                    <div className="dashboard-cards flex column">
                        <p className="title-dashboard">{ Language[this.state.language].dashboard.marketcap }</p>
                        <div className="dashboard-items flex row center">
                            <p className="dashboard-text-stat">{contractHelper.getNb(this.state.marketCap, 0)}</p>
                        </div>
                    </div>

                    <div className="dashboard-cards flex column">
                        <p className="title-dashboard">{ Language[this.state.language].dashboard.totalNft }</p>
                        <div className="dashboard-items flex row center">
                            <p className="dashboard-text-stat">{contractHelper.getNb(this.state.totalBadges, 0)}</p>
                        </div>
                    </div>

                    <div className="dashboard-cards flex column">
                        <p className="title-dashboard">{ Language[this.state.language].dashboard.totalSupply }</p>
                        <div className="dashboard-items flex row center">
                            <p className="dashboard-text-stat">{contractHelper.getNb(this.state.totalSupply, 0)}</p>
                        </div>
                    </div>

                    <div className="dashboard-cards flex column">
                        <p className="title-dashboard">{ Language[this.state.language].dashboard.totalBurn }</p>
                        <div className="dashboard-items flex row center">
                            <p className="dashboard-text-stat">{contractHelper.getNb(this.state.totalBurn, 0)}</p>
                        </div>
                    </div>

                    <div className="dashboard-badge-core flex column">
                        <div className="dashboard-badge flex column">

                        {
                            this.state.badges.length != 0 &&
                            (
                                this.state.badges.map((value, key) => 
                                {
                                    if(this.state.width <= 1500)
                                    {
                                        return(
                                            <div className="dashboard-badge-items-core flex column center">
                                                <div className="dashboard-badge-img-core flex center">
                                                    <h1>TEST</h1>
                                                </div>
                                                <div key={`dashboard-${key}`} className="dashboard-badge-items flex row">
                                                    <p className="dashboard-badge-title">{value.name }</p>
                                                    <p className="dashboard-badge-count">{contractHelper.getNb(value.totalSupply, 0)}/{contractHelper.getNb(value.max, 0)}</p>
                                                </div>
                                            </div>
                                        )
                                    }else 
                                    {
                                        return(
                                            <div key={`dashboard-${key}`} className="dashboard-badge-items dashboard-badge-web flex row">
                                                <p className="dashboard-badge-title">{value.name }</p>
                                                <p className="dashboard-badge-count">{contractHelper.getNb(value.totalSupply, 0)}/{contractHelper.getNb(value.max, 0)}</p>
                                            </div>
                                        )
                                    } 

                                })
                            )                    
                        }
                        </div>
                    </div>

                </div>

            </div>
        );
    }
}

export default connect(MapStateToProps, mapDispatchToProps)(Dashboard);