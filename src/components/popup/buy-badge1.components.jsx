import React from "react";
import Popup from 'reactjs-popup';
import 'assets/animation/keyframes.assets.css'
import 'assets/index.assets.css';
import 'assets/global.assets.css';
import 'assets/pages/shop.assets.css'
import 'assets/popup/buy-badge1.assets.css'
import { connect } from 'react-redux'
import { LoginActions } from 'store/actions/login.actions.js'
import { DashboardActions } from 'store/actions/dashboard.actions.js'
import Ruby from 'assets/img/ruby.mp4'
import Amber from 'assets/img/amber.mp4'
import Amethyst from 'assets/img/amethyst.mp4'
import ContractHelper from "helpers/contract.helpers";
import Address from 'contracts/address.contracts.json'

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
        erc20DispatchManager: state.dashboard.erc20DispatchManager,
        videoSrc: state.dashboard.videoSrc
    }; 
};

const mapDispatchToProps = (dispatch) => {
    return {
        loginAction: (data) => { dispatch(LoginActions(data)); },
        dashboardAction: (data) => { dispatch(DashboardActions(data)); },
    };
};

class BuyPopup extends React.Component 
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
            videoSrc: [Amber, Amethyst, Ruby],
            badgesIndex : props.badgesIndex,
            buyNbr : 1,
            tokenChoices: Address.token,
            erc20DispatchManager: this.props.erc20DispatchManager,
            videoSrc: this.props.videoSrc
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

    async setAllowance()
    {
        let contractHelper = new ContractHelper()
        let provider = await contractHelper.getProvider()
        let data = {}
        data[this.state.tokenChoices] = {allowance : true}
        await contractHelper.setApproveAllowance(this.state.tokenChoices, Address.dispatchManager, provider)
        this.props.dashboardAction({data: {erc20DispatchManager: data }, action: "saveData"})
    }

    addBadges()
    {
        this.state.buyNbr += 1
        this.forceUpdate()
    }

    removeBadges()
    {
        if(this.state.buyNbr > 1) this.state.buyNbr -= 1
        this.forceUpdate()
    }

    async buyBadges()
    {
        let contractHelper = new ContractHelper()
        const provider = await contractHelper.getProvider()
        await contractHelper.createManagedTokens(this.state.tokenChoices, this.state.badgesIndex, this.state.address, this.state.buyNbr, '', provider)
    }
    
    render()
    {
        let contractHelper = new ContractHelper()
        return(
            <Popup trigger={<button className="button shop-items-button">Buy for {contractHelper.setFormatUnit(this.state.badges[this.state.badgesIndex].price, 6)}$CREST</button>} modal nested>
            {
                close => (
                    <div className="shop-popup-base flex row">
                        
                        <button className="shop-popup-close button" onClick={close}> &times; </button>
                        <div className="shop-popup-items">  
                            <video className="shop-video" autoPlay muted loop>
                                <source src={this.state.videoSrc[this.state.badgesIndex]} type="video/mp4" />
                            </video>
                        </div>

                        <div className="shop-popup-cards flex column">

                            <h1 className="shop-popup-title">{this.state.badges[this.state.badgesIndex].name}</h1>

                            <div className="shop-popup-count-core flex row center">
                                <button className="button shop-popup-min" onClick={() => this.removeBadges()}>-</button>
                                <h1 className="shop-popup-count-text">{this.state.buyNbr}</h1>
                                <button className="button shop-popup-max" onClick={() => this.addBadges()}>+</button>
                            </div>

                            <div className="shop-popup-info-core flex row">

                                <div className="shop-popup-info-title flex column">
                                    <p className="shop-popup-text-title">Price</p>
                                    <p className="shop-popup-text-title">Lifetime</p>
                                    <p className="shop-popup-text-title">Daily Rewards</p>
                                    <p className="shop-popup-text-title">Daily Roi</p>
                                    <p className="shop-popup-text-title">Total Roi</p>
                                </div>

                                <div className="shop-popup-info-desc flex column">
                                    <p className="shop-popup-text-desc">{contractHelper.setFormatUnit(this.state.badges[this.state.badgesIndex].price * this.state.buyNbr, 6)} $CREST</p>
                                    <p className="shop-popup-text-desc">365 days</p>
                                    <p className="shop-popup-text-desc">{contractHelper.setFormatUnit(this.state.badges[this.state.badgesIndex].rewardAmount, 6)} $CREST</p>
                                    <p className="shop-popup-text-desc">
                                        {
                                        parseFloat(contractHelper.setFormatUnit(this.state.badges[this.state.badgesIndex].rewardAmount, 6))
                                        / 
                                        parseFloat  (contractHelper.setFormatUnit(this.state.badges[this.state.badgesIndex].price, 6))
                                        * 100
                                        } %
                                    </p>
                                    <p className="shop-popup-text-desc">
                                        {
                                        (parseFloat(contractHelper.setFormatUnit(this.state.badges[this.state.badgesIndex].rewardAmount, 6))
                                        / 
                                        parseFloat  (contractHelper.setFormatUnit(this.state.badges[this.state.badgesIndex].price, 6))
                                        * 100 * 365).toFixed(2) 
                                        } %
                                    </p>
                                </div>

                            </div>
                                        
                            {
                                this.state.erc20DispatchManager[this.state.tokenChoices] !== undefined &&
                                (
                                    this.state.erc20DispatchManager[this.state.tokenChoices].allowance === true 
                                    ? <button className="button shop-popup-button" onClick={() => this.buyBadges()}>Buy</button>
                                    : <button className="button shop-popup-button" onClick={() => this.setAllowance()}>Approve</button>
                                )
                            }
                            
                            
                        </div>
                        
                    </div>
                )
            }
            </Popup>
        )
    }
}


export default connect(MapStateToProps, mapDispatchToProps)(BuyPopup)
    