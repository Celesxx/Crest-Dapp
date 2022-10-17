import 'assets/css/animation/keyframes.assets.css'
import 'assets/css/index.assets.css';
import 'assets/css/global.assets.css';
import 'assets/css/pages/shop.assets.css'
import 'assets/css/popup/buy-badge1.assets.css'
import React from "react";
import Popup from 'reactjs-popup';
import Ruby from 'assets/img/ruby.mp4'
import Amber from 'assets/img/amber.mp4'
import Amethyst from 'assets/img/amethyst.mp4'
import ContractHelper from "helpers/contract.helpers";
import Address from 'contracts/address.contracts.json'
import Language from 'assets/data/language.json'
import { connect } from 'react-redux'
import { LoginActions } from 'store/actions/login.actions.js'
import { DashboardActions } from 'store/actions/dashboard.actions.js'

const MapStateToProps = (state) => {
    return { 
        address: state.login.address,
        resToken: state.dashboard.resToken,
        resStable: state.dashboard.resStable,
        totalSupply: state.dashboard.totalSupply,
        totalBurn: state.dashboard.totalBurn,
        badges: state.dashboard.badges,
        claimBadges: state.dashboard.claimBadges,
        totalReward: state.dashboard.totalReward,
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
            videoSrc: this.props.videoSrc,
            language: this.props.language,
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
        document.getElementById('WEB3_CONNECT_MODAL_ID').remove()
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
        document.getElementById('WEB3_CONNECT_MODAL_ID').remove()
        await contractHelper.createManagedTokens(this.state.tokenChoices, this.state.badgesIndex, this.state.address, this.state.buyNbr, '', provider)

        const newBalance = await contractHelper.nftSingleBalance(this.state.badgesIndex, this.state.address, provider)
        const newTotalSupply = await contractHelper.nftSingleTotalsupply(this.state.badgesIndex, provider)
        const { totalSupply, totalBurn } = await contractHelper.getTotalSuplyAndBurn(provider)
        const formatUnit = await contractHelper.setFormatUnits({totalBurn : totalBurn, totalSupply: totalSupply}, 18)
        const getAllUserBadges = await contractHelper.getNftsDatasAtIndex(this.state.badgesIndex, this.state.address, newBalance, provider)

        let badge = {}
        badge[this.state.badgesIndex] = {}
        badge[this.state.badgesIndex] = { userNbrBadge : newBalance, totalSupply : newTotalSupply, userBadges : getAllUserBadges}

        this.props.dashboardAction({data: {badges :  badge, totalSupply: formatUnit.totalSupply, totalBurn: formatUnit.totalBurn} , action : 'saveData'})
    }
    
    render()
    {
        let contractHelper = new ContractHelper()
        return(
            <Popup trigger={<button className="button shop-items-button">{ Language[this.state.language].shop.badgeBuy } { contractHelper.setFormatUnit(this.state.badges[this.state.badgesIndex].price, 18)}$CREST</button>} modal nested>
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
                                    <p className="shop-popup-text-title">{ Language[this.state.language].shopPop.price }</p>
                                    <p className="shop-popup-text-title">{ Language[this.state.language].shopPop.remaining }</p>
                                    <p className="shop-popup-text-title">{ Language[this.state.language].shopPop.lifetime }</p>
                                    <p className="shop-popup-text-title">{ Language[this.state.language].shopPop.dailyReward }</p>
                                    <p className="shop-popup-text-title">{ Language[this.state.language].shopPop.dailyRoi }</p>
                                </div>

                                <div className="shop-popup-info-desc flex column">
                                    <p className="shop-popup-text-desc">{ contractHelper.setFormatUnit(this.state.badges[this.state.badgesIndex].price, 18) * this.state.buyNbr } $CREST</p>
                                    <p className="shop-popup-text-desc">
                                        {
                                            contractHelper.getNb(parseInt(this.state.badges[this.state.badgesIndex].max) - parseInt(this.state.badges[this.state.badgesIndex].totalSupply), 0) 
                                        }
                                    </p>
                                    <p className="shop-popup-text-desc">{ Language[this.state.language].shopPop.lifetimeValue }</p>
                                    <p className="shop-popup-text-desc">{contractHelper.setFormatUnit(this.state.badges[this.state.badgesIndex].rewardAmount, 18)} $CREST</p>
                                    <p className="shop-popup-text-desc">
                                        {
                                            parseFloat(contractHelper.setFormatUnit(this.state.badges[this.state.badgesIndex].rewardAmount, 18))
                                            / 
                                            parseFloat  (contractHelper.setFormatUnit(this.state.badges[this.state.badgesIndex].price, 18))
                                            * 100
                                        } %
                                    </p>
                                    
                                </div>

                            </div>
                                        
                            {
                                this.state.erc20DispatchManager[this.state.tokenChoices] !== undefined &&
                                (
                                    this.state.erc20DispatchManager[this.state.tokenChoices].allowance === true 
                                    ? <button className="button shop-popup-button" onClick={() => this.buyBadges()}>{ Language[this.state.language].shopPop.buyBtn }</button>
                                    : <button className="button shop-popup-button" onClick={() => this.setAllowance()}>{ Language[this.state.language].shopPop.approveBtn }</button>
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
    