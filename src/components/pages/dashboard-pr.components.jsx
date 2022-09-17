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
import Address from 'contracts/address.contracts.json'
import ContractHelper from "helpers/contract.helpers";
import { BigNumber } from "ethers";
import Amber from 'assets/img/amber.mp4'
import Amethyst from 'assets/img/amethyst.mp4'
import Ruby from 'assets/img/ruby.mp4'
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
        tokenUser: state.dashboard.tokenUser,
        nftsDatas: state.dashboard.nftsDatas,
        totalBadges: state.dashboard.totalBadges,
        badges: state.dashboard.badges,
        videoSrc: state.dashboard.videoSrc,
        amounDailyReward : 0,
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
            badges: JSON.parse(JSON.stringify(this.props.badges)),
            tokenUser: this.props.tokenUser,
            videoSrc: this.props.videoSrc,
            amountDailyReward: null,
            amountNft: null,
            amountPendingRewards: null,

        }
    }

    async UNSAFE_componentWillMount()
    {
        if(this.state.badges.length !=0)
        {
            let [amountDailyReward, amountNft, amountPendingRewards] = [0,0,0]
            let contractHelper = new ContractHelper()
            for(const [key, value] of Object.entries(this.state.badges))
            {
                amountDailyReward += parseFloat(contractHelper.setFormatUnit(value.rewardAmount, 6)) * value.userNbrBadge
                amountNft += value.userNbrBadge
                for(const value1 of value.userBadges)
                {
                    amountPendingRewards += parseFloat(await contractHelper.setFormatUnit((await contractHelper.getPendingRewards(value1, value.rewardAmount)).toString(),6))
                }
            }
            this.state.amountDailyReward = amountDailyReward
            this.state.amountNft = amountNft
            this.state.amountPendingRewards = amountPendingRewards
            this.forceUpdate()
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

                <div className="dashboard-button flex row">
                    <div className="dashboard-button-core flex row">

                    <button onClick={() => this.props.history.push("/dashboard")} className="button-dash button-protocol flex row center">Protocol</button>
                        <button onClick={() => this.props.history.push("/dashboard/personnal")} className="button-dash button-personnal flex row center">Personnal</button>

                    </div>
                </div>

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
                                            <video className="shop-video" autoPlay muted loop>
                                                <source src={this.state.videoSrc[key]} alt={this.state.videoSrc[key]} type="video/mp4" />
                                            </video>
                                        </div>
                                    )
                                }
                            })
                            
                        )
                        
                    }

                </div>

                <div className="dashboard-personnal-info flex row">

                    <div className="personnal-info-cards flex column">
                        <p className="info-title">My NFT's</p>
                        <div className="info-cards flex row center">
                            <p className="info-text">
                                { this.state.amountNft }
                            </p>
                        </div>
                    </div>

                    <div className="personnal-info-cards flex column">
                        <p className="info-title">My $CREST Balance</p>
                        <div className="info-cards flex row center">
                            <p className="info-text">
                                {this.state.tokenUser.balance}
                            </p>
                        </div>
                    </div>

                    <div className="personnal-info-cards flex column">
                        <p className="info-title">My Daily Rewards</p>
                        <div className="info-cards flex row center">
                            <p className="info-text">
                                {this.state.amountDailyReward}
                            </p>
                        </div>
                    </div>

                    <div className="personnal-info-cards flex column">
                        <p className="info-title">My Pending Reward</p>
                        <div className="info-cards flex row center">
                            <p className="info-text">
                                {this.state.amountPendingRewards}
                            </p>
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
