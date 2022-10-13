import "assets/css/index.assets.css";
import "assets/css/global.assets.css";
import "assets/css/pages/dashboard.assets.css"
import "assets/css/pages/dashboard-pr.assets.css"
import 'assets/css/blocks/mobile/dashboard-pr.assets.css'
import React from "react";
import ContractHelper from "helpers/contract.helpers";
import Language from 'assets/data/language.json'
import PersonnalIcon from 'assets/img/dashboard-personnal.svg'
import GlobalIcon from 'assets/img/dashboard-global.svg'
import Restricted from "components/blocks/restricted.block.jsx"
import { connect } from 'react-redux'
import { LoginActions } from 'store/actions/login.actions.js'
import { DashboardActions } from 'store/actions/dashboard.actions.js'
import { withRouter } from 'react-router' 

const MapStateToProps = (state) => {
    return { 
        address: state.login.address,
        resToken: state.dashboard.resToken,
        resStable: state.dashboard.resStable,
        totalSupply: state.dashboard.totalSupply,
        totalBurn: state.dashboard.totalBurn,
        tokenUser: state.dashboard.tokenUser,
        badges: state.dashboard.badges,
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
            badges: this.props.badges,
            tokenUser: this.props.tokenUser,
            videoSrc: this.props.videoSrc,
            amountDailyReward: null,
            amountNft: null,
            amountPendingRewards: [],
            amountTotalPendingRewards: null,
            language: this.props.language,
            width : props.width,
        }
    }

    
    UNSAFE_componentWillMount()
    {
        if(this.state.badges.length !=0 && this.state.address != 0)
        {
            let [amountDailyReward, amountNft, amountTotalPendingRewards] = [0,0,0]
            let contractHelper = new ContractHelper()
            for(const [key, value] of Object.entries(this.state.badges))
            {
                let amountPendingRewards = 0
                amountDailyReward += parseFloat(contractHelper.setFormatUnit(value.rewardAmount, 18)) * value.userNbrBadge
                amountNft += value.userNbrBadge
                for(const value1 of value.userBadges)
                {
                    amountPendingRewards += parseFloat(contractHelper.setFormatUnit((contractHelper.getPendingRewards(value1, value.rewardAmount)).toString(),18))
                }
                amountTotalPendingRewards += amountPendingRewards
                this.state.amountPendingRewards.push(amountPendingRewards)
            }
            
            this.state.amountDailyReward = amountDailyReward
            this.state.amountNft = amountNft
            this.state.amountTotalPendingRewards = amountTotalPendingRewards
            this.state.interval = setInterval(() => this.reloadDataTimer(), 1000)
            
            this.forceUpdate()
        } 
    }

    componentWillUnmount()
    {
        clearInterval(this.state.interval)
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


    async reloadDataTimer()
    {
        if(this.state.badges.length !=0 && this.state.address != 0)
        {
            let contractHelper = new ContractHelper()
            let amountTotalPendingRewards = 0

            for(const [key, value] of Object.entries(this.state.badges))
            {
                let amountPendingRewards = 0
                for(const value1 of value.userBadges)
                {
                    amountPendingRewards += parseFloat(contractHelper.setFormatUnit((contractHelper.getPendingRewards(value1, value.rewardAmount)).toString(),18))
                }
                amountTotalPendingRewards += amountPendingRewards
                this.state.amountPendingRewards.push(amountPendingRewards)
            }
            this.state.amountTotalPendingRewards = amountTotalPendingRewards
            this.forceUpdate()
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

                        <button onClick={() => this.props.history.push("/dashboard")} className="button-dash button-protocol flex row center">
                            { 
                                this.state.width <= 1500
                                ? <img className="dashboard-button-logo" src={GlobalIcon} alt={GlobalIcon}></img>
                                : Language[this.state.language].dashboard.protocolTitle
                            }
                        </button>
                        <button onClick={() => this.props.history.push("/dashboard/personnal")} className="button-dash button-personnal flex row center" id="currentDashboard">
                            { 
                                this.state.width <= 1500
                                ? <img className="dashboard-button-logo" src={PersonnalIcon} alt={PersonnalIcon}></img>
                                : Language[this.state.language].dashboard.personalTitle
                            }
                        </button>

                    </div>
                </div>

                <div className="dashboard-personnal-card-core flex column center">
                        
                    <div className="dashboard-personnal-cards flex">

                        {
                            this.state.badges.length != 0 &&
                            (
                                this.state.badges.map((value, key) => 
                                {
                                    if(value.userNbrBadge != 0)
                                    {
                                        return(
                                            <div key={`personal-${key}`} className="personnal-cards flex column">
                                                <video className="personnal-video" autoPlay muted loop>
                                                    <source src={this.state.videoSrc[key]} alt={this.state.videoSrc[key]} type="video/mp4" />
                                                </video>

                                            </div>
                                        )
                                    } else 
                                    {
                                        return(
                                            <div key={`personal-${key}`} className="personnal-cards flex column">
                                                <video className="personnal-video" autoPlay muted loop>
                                                    <source src={this.state.videoSrc[key]} alt={this.state.videoSrc[key]} type="video/mp4" />
                                                </video>

                                                <div className="personnal-cards-locked flex row center">
                                                    <h2 className="personnal-cards-title-locked">{Language[this.state.language].personnal.lockedTitle}</h2>
                                                </div>
                                            </div>
                                        )
                                    }
                                })
                                
                            )
                            
                        }

                    </div>

                    <div className="dashboard-personnal-info flex row">

                        <div className="personnal-info-cards flex column">
                            <p className="info-title">{ Language[this.state.language].personnal.myNft }</p>
                            <div className="info-cards flex row center">
                                <p className="info-text">
                                    { this.state.amountNft }
                                </p>
                            </div>
                        </div>

                        <div className="personnal-info-cards flex column">
                            <p className="info-title">{ Language[this.state.language].personnal.crestBalance }</p>
                            <div className="info-cards flex row center">
                                <p className="info-text">
                                    {contractHelper.getNb(this.state.tokenUser.balance, 2)}
                                </p>
                            </div>
                        </div>

                        <div className="personnal-info-cards flex column">
                            <p className="info-title">{ Language[this.state.language].personnal.dailyReward }</p>
                            <div className="info-cards flex row center">
                                <p className="info-text">
                                    {contractHelper.getNb(this.state.amountDailyReward, 2)}
                                </p>
                            </div>
                        </div>

                        <div className="personnal-info-cards flex column">
                            <p className="info-title">{ Language[this.state.language].personnal.pendingReward }</p>
                            <div className="info-cards flex row center">
                                <p className="info-text">
                                    {contractHelper.getNb(this.state.amountTotalPendingRewards, 6)}
                                </p>
                            </div>
                        </div>

                    </div>

                </div>

            </div>
        );
    }
}

export default withRouter(connect(MapStateToProps, mapDispatchToProps)(Dashboard));
