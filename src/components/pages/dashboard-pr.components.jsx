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
        badges: state.dashboard.badges
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
            crestBalance: this.props.crestBalance,
            dailyReward: this.props.dailyReward,
            pendingReward: this.props.pendingReward,

        }
    }

    async UNSAFE_componentWillMount() 
    {
        let contractHelper = new ContractHelper() 
        const provider = await contractHelper.getProvider()

        let data = 
        {
            badges: this.state.badges,
            pendingReward: BigNumber.from(0),
            dailyReward: null,
            crestBalance: null
        }

        for(let i = 0; i < Address.badges.length; i++) 
        { 
            const nft = await contractHelper.nftSingleBalance(i, this.props.address, provider)
            const nftsInfo = await contractHelper.getNftsDatasAtIndex(i, this.props.address, nft, provider)
            data.badges[i]["userBadges"] = nftsInfo
            data.badges[i]["userNbrBadge"] = nft
        }

        let crestBalance = await contractHelper.getERC20Balance(this.props.address, Address.token, provider)
        data.crestBalance = await contractHelper.setFormatUnit(crestBalance, 6)
        
        for(const badgesInfo of data.badges)
        {
            for(const singleBadges of badgesInfo.userBadges)
            {
                let total = await contractHelper.getPendingRewards(singleBadges, badgesInfo.rewardAmount)
                data.pendingReward = data.pendingReward.add(total)
            }
        }

        data.pendingReward = await contractHelper.setFormatUnit(data.pendingReward.toString(), 6)
        for(const badge of data.badges) data.dailyReward += badge.userNbrBadge * await contractHelper.setFormatUnit(badge.rewardAmount,6)

        for(const [key, value] of Object.entries(data))
        {
            if(this.state[key] !== undefined) this.state[key] = value
            else console.log(`value not exist : ${key}`)
        }
        this.props.dashboardAction({data: data, action: "dashboard-pr"})


        this.forceUpdate();
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

            <div className="home-body flex column">

                <div className="dashboard-button flex row">
                    <div className="dashboard-button-core flex row">

                    <button onClick={() => this.props.history.push("/dashboard")} className="button-dash button-protocol flex row center">Protocol</button>
                        <button onClick={() => this.props.history.push("/dashboard/personnal")} className="button-dash button-personnal flex row center">Personnal</button>

                    </div>
                </div>

                <div className="dashboard-personnal-cards flex">

                    {
                        this.state.badges[0].userNbrBadge != 0 &&
                        (
                            <div className="personnal-cards flex column">
                                <video className="shop-video" autoPlay muted loop>
                                    <source src={Amber} type="video/mp4" />
                                </video>
                            </div>
                            
                        )
                    }

                    {
                        this.state.badges[0].userNbrBadge != 0 && 
                        (
                            <div className="personnal-cards flex column">
                                <video className="shop-video" autoPlay muted loop>
                                    <source src={Amethyst} type="video/mp4" />
                                </video>
                            </div>
                            
                        )
                    }

                    {
                        this.state.badges[0].userNbrBadge != 0 && 
                        (
                            <div className="personnal-cards flex column">
                                <video className="shop-video" autoPlay muted loop>
                                    <source src={Ruby} type="video/mp4" />
                                </video>
                            </div>
                            
                        )
                    }

                </div>

                <div className="dashboard-personnal-info flex row">

                    <div className="personnal-info-cards flex column">
                        <p className="info-title">My NFT's</p>
                        <div className="info-cards flex row center">
                            <p className="info-text">
                                {this.state.badges[0].userNbrBadge + this.state.badges[1].userNbrBadge + this.state.badges[2].userNbrBadge}
                            </p>
                        </div>
                    </div>

                    <div className="personnal-info-cards flex column">
                        <p className="info-title">My $CREST Balance</p>
                        <div className="info-cards flex row center">
                            <p className="info-text">
                                {this.state.crestBalance}
                            </p>
                        </div>
                    </div>

                    <div className="personnal-info-cards flex column">
                        <p className="info-title">My Daily Rewards</p>
                        <div className="info-cards flex row center">
                            <p className="info-text">
                                {this.state.dailyReward}
                            </p>
                        </div>
                    </div>

                    <div className="personnal-info-cards flex column">
                        <p className="info-title">My Pending Reward</p>
                        <div className="info-cards flex row center">
                            <p className="info-text">
                                {this.state.pendingReward}
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
