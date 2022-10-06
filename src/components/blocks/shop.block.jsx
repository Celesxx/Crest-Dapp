import 'assets/css/animation/keyframes.assets.css'
import 'assets/css/index.assets.css';
import 'assets/css/global.assets.css';
import 'assets/css/pages/shop.assets.css'
import React from "react";
import Navbar from "components/blocks/navbar.block.jsx"
import Leftbar from "components/blocks/leftbar.block.jsx"
import Sphere from "assets/img/sphere.svg"
import Badge1Popup from "components/popup/buy-badge1.components"
import Ruby from 'assets/img/ruby.mp4'
import Amber from 'assets/img/amber.mp4'
import Amethyst from 'assets/img/amethyst.mp4'
import { connect } from 'react-redux'
import { LoginActions } from 'store/actions/login.actions.js'
import { DashboardActions } from 'store/actions/dashboard.actions.js'
import Restricted from "components/blocks/restricted.block.jsx"
import LoadingData from "components/blocks/loading-data.block.jsx"
import ContractHelper from "helpers/contract.helpers";
import Address from 'contracts/address.contracts.json'
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
        erc20DispatchManager: state.dashboard.erc20DispatchManager,
        videoSrc: state.dashboard.videoSrc,
        language: state.login.language,
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
            badges: this.props.badges,
            videoSrc: this.props.videoSrc,
            erc20DispatchManager: this.props.erc20DispatchManager,
            language: this.props.language,
        }
    }

    async UNSAFE_componentWillMount()
    {
        if(Object.keys(this.props.erc20DispatchManager).length == 0 && this.props.address !== "")
        {
            let contractHelper = new ContractHelper()
            const provider = await contractHelper.getProvider()
            let data = {}
            for(const address of Address.erc20Token)
            {
                data[address] = 
                {
                    name: await contractHelper.getNameContract(address, provider),
                    allowance: await contractHelper.hasAllowance(this.state.address, address, Address.dispatchManager, provider)
                }
            }
            this.props.dashboardAction({data : {erc20DispatchManager: data}, action:"saveData"})
        }
    }


    async componentDidUpdate(prevProps, prevState, snapshot) 
    {
        for(const [key, value] of Object.entries(this.state))
        {
            if (prevProps[key] !== this.props[key])
            {   
                this.state[key] = this.props[key] 
                if(this.props.address != "" && key == "address")
                {
                    let contractHelper = new ContractHelper()
                    const provider = await contractHelper.getProvider()
                    let data = {}
                    for(const address of Address.erc20Token)
                    {
                        data[address] = 
                        {
                            name: await contractHelper.getNameContract(address, provider),
                            allowance: await contractHelper.hasAllowance(this.state.address, address, Address.dispatchManager, provider)
                        }
                    }
                    this.props.dashboardAction({data : {erc20DispatchManager: data}, action:"saveData"})
                }
                this.forceUpdate();
            }
        }
    }

    render()
    {
      return(
      
        <div className="home-body flex column">

            {
                this.state.address == "" &&
                ( <Restricted /> )
            }

            <div className="shop-about-core flex column">

                <h1 className="shop-title">{ Language[this.state.language].shop.title }</h1>
                <p className="shop-description">{ Language[this.state.language].shop.description }</p>

            </div>

            <div className="shop-items-core flex row">

                {
                    this.state.badges.map((value, key) =>
                    {
                        return(
                        <div key={`shop-${key}`} className="shop-items-cards flex column">

                            <h3 className="shop-items-title">{value.name} </h3>
                            <div className="shop-items">
                                <video className="shop-video" autoPlay muted loop>
                                    <source src={this.state.videoSrc[key]} type="video/mp4" />
                                </video>
                            </div>
                            <p className="shop-items-description">{ Language[this.state.language].shop.badgeDescription[key] }</p>
                            <Badge1Popup badgesIndex={key} ></Badge1Popup>

                        </div>
                        )
                    })
                    
                }

            </div>

        </div>
      );
    }
}

export default connect(MapStateToProps, mapDispatchToProps)(Dashboard);
