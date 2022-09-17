import 'assets/animation/keyframes.assets.css'
import 'assets/index.assets.css';
import 'assets/global.assets.css';
import 'assets/pages/profile.assets.css'
import React from "react";
import Navbar from "components/blocks/navbar.components.jsx"
import Leftbar from "components/blocks/leftbar.components.jsx"
import Sphere from "assets/img/sphere.svg"
import { LoginActions } from 'store/actions/login.actions.js'
import { DashboardActions } from 'store/actions/dashboard.actions.js'
import { connect } from 'react-redux'
import ContractHelper from "helpers/contract.helpers";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck } from '@fortawesome/free-solid-svg-icons'
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
            badges: JSON.parse(JSON.stringify(this.props.badges)),
            claimBadges : JSON.parse(JSON.stringify(this.props.claimBadges)),
            address: this.props.address,
            allChecked: false,
            nbrCheck: 0,
            totalReward: this.props.totalReward,
            startLoading: this.props.startLoading,
            loading: this.props.loading,
            loadingMax: this.props.loadingMax,
            loadingOver: this.props.loadingOver,
        }
    }

    // async UNSAFE_componentWillMount() 
    // {
    //     let contractHelper = new ContractHelper()

    //     let claimBadges = []
    //     for(const [key, value] of Object.entries(this.state.badges))
    //     {
    //         for(const [keyNft, valueNft] of Object.entries(value.userBadges))
    //         {
    //             let data = 
    //             { 
    //                 badgeId: key,
    //                 nft : value.name, 
    //                 id : valueNft.tokenId, 
    //                 date : null, 
    //                 claimDate : null,
    //                 roi: null, 
    //                 lifetime: null, 
    //                 rewards: null,
    //                 checked: false, 
    //             }

    //             data.date = await contractHelper.formatEpochToDate(new Date(valueNft.creationTime * 1000))
    //             data.claimDate = await contractHelper.formatEpochToDate(new Date(valueNft.lastClaim * 1000))

    //             let [ formatPrice, formatRewardAmount ] = [ await contractHelper.setFormatUnit(value.price, 6), await contractHelper.setFormatUnit(value.rewardAmount, 6) ]
    //             let roiTime = (formatPrice / formatRewardAmount) * 24 * 3600

    //             data.roi = await contractHelper.formatEpochToDate(new Date((valueNft.creationTime + parseInt(roiTime)) * 1000))
    //             data.lifetime = await contractHelper.formatEpochToDate(new Date((valueNft.creationTime + parseInt(365 * 24 * 3600)) * 1000))
    //             let formatRewards = await contractHelper.getPendingRewards(valueNft, value.rewardAmount)
    //             data.rewards = await contractHelper.setFormatUnit(formatRewards.toString(), 6)

    //             claimBadges.push(data)
    //         }

    //         this.state.totalReward[key] = 0.0
    //     }

    //     for(const badge of this.state.claimBadges) { this.state.totalReward[badge.badgeId] += badge.rewards }
    //     await this.props.dashboardAction({claimBadges: claimBadges, action: "saveData"})
    // }

    async singleSelect(key, value)
    {
        let contractHelper = new ContractHelper()
        const provider = await contractHelper.getProvider()
        await contractHelper.claimBadge(this.state.address, [value.badgeId], [[value.id]], provider)
    }

    multipleSelect(key, value)
    {
        let claimBadges = JSON.parse(JSON.stringify(this.state.claimBadges))
        claimBadges[key].checked = !claimBadges[key].checked
        this.state.claimBadges = claimBadges
        claimBadges[key].checked === true ? this.state.nbrCheck += 1 : this.state.nbrCheck -= 1
        this.forceUpdate();
    }

    allSelect()
    {
        let claimBadges = JSON.parse(JSON.stringify(this.state.claimBadges))
        claimBadges.map(badge => {badge.checked = !badge.checked})
        claimBadges.map(badge => {badge.checked == true ? this.state.nbrCheck += 1 : this.state.nbrCheck -= 1})
        this.state.claimBadges = claimBadges
        this.state.allChecked = !this.state.allChecked
        this.forceUpdate();
    }

    async claimAllBadges()
    {
        let contractHelper = new ContractHelper()
        const provider = await contractHelper.getProvider()

        let data = {}
        for(const badge of this.state.claimBadges) 
        {
            if(badge.checked)
            {
                if(data[badge.badgeId] === undefined) data[badge.badgeId] = [badge.id] 
                else data[badge.badgeId].push(badge.id)
            }
        }
        let tokenIds = []
        let badgeIndex = []

        Object.keys(data).map((key) => {badgeIndex.push(parseInt(key))})
        Object.values(data).map((value) => {tokenIds.push(value)})

        console.log(badgeIndex)
        console.log(tokenIds)
        await contractHelper.claimBadge(this.state.address, badgeIndex, tokenIds, provider)
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

                <div className="profile-laderboard flex row">

                    <div className="profile-laderboard-core flex row">

                        {
                            this.state.badges.map((value, key) => 
                            {
                                return (
                                    <div key={key} className="profile-laderboard-cards flex column">
                                        <p className="profile-title">{value.name}</p>
                                        <div className="profile-score flex row center">{this.state.totalReward[key]}</div>
                                    </div>
                                )
                            })
                        }
                        

                    </div>

                    <button className="claim-all-button button" onClick={() => this.claimAllBadges()}>Claim selected NFT'S ({this.state.nbrCheck}/{this.state.claimBadges.length})</button>

                </div>

                <div className="profile-table-core flex column">
                    
                    <div className="profile-table-heads flex row">
                        <div className="profile-table-radio profile-table-title flex row center">
                            <div className="profile-table-radio-core flex row center">
                                <div className="profile-table-input flex row center">
                                    <input type="checkbox" checked={this.state.allChecked} className="profile-radio-input" id="radio-all" name="radio-all" onChange={() => this.allSelect()} />
                                    { this.state.allChecked != false && <FontAwesomeIcon icon={faCheck} className="profile-radio-checked"/> }
                                </div>
                            </div>
                        </div>
                        <p className="profile-table-title">NFT's</p>
                        <p className="profile-table-title">ID</p>
                        <p className="profile-table-title">Date</p>
                        <p className="profile-table-title">Claim date</p>
                        <p className="profile-table-title">ROI DATE</p>
                        <p className="profile-table-title">Lifetime</p>
                        <p className="profile-table-title">Rewards</p>
                        <p className="profile-table-title"></p>
                    </div>

                    {
                        this.state.claimBadges.length != 0 && 
                        (
                            this.state.claimBadges.map((value, key) => 
                            {
                                return (
                                    <div key={key} className="profile-table-data flex row">
                                        <div className="profile-table-radio profile-table-title flex row center" >
                                            <div className="profile-table-radio-core flex row center">
                                                <div className="profile-table-input flex row center">
                                                    <input type="checkbox" checked={this.state.claimBadges[key].checked} className="profile-radio-input" id={`radio-${key}`} name={`radio-${key}`} onChange={() => this.multipleSelect(key, value)} />
                                                    { this.state.claimBadges[key].checked != false && <FontAwesomeIcon icon={faCheck} className="profile-radio-checked"/> }
                                                </div>
                                            </div>
                                        </div>
                                        <p className="profile-table-desc">{value.nft}</p>
                                        <p className="profile-table-desc">{value.id}</p>
                                        <p className="profile-table-desc">{value.date}</p>
                                        <p className="profile-table-desc">{value.claimDate}</p>
                                        <p className="profile-table-desc">{value.roi}</p>
                                        <p className="profile-table-desc">{value.lifetime}</p>
                                        <p className="profile-table-desc">{value.rewards}</p>
                                        <div className="profile-table-desc profile-table-button-core flex row center">
                                            <button className="button profile-table-button" onClick={() => this.singleSelect(key, value)}>claim</button>
                                        </div>
                                    </div>
                                )
                            })
                        )
                    }

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
