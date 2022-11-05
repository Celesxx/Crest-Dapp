import 'assets/css/animation/keyframes.assets.css'
import 'assets/css/index.assets.css';
import 'assets/css/global.assets.css';
import 'assets/css/pages/shop.assets.css'
import 'assets/css/blocks/mobile/shop.assets.css'
import React from "react";
import Restricted from "components/blocks/restricted.block.jsx"
import ContractHelper from "helpers/contract.helpers";
import Address from 'contracts/address.contracts.json'
import Language from 'assets/data/language.json'
import Ruby from 'assets/img/ruby.mp4'
import Amber from 'assets/img/amber.mp4'
import Amethyst from 'assets/img/amethyst.mp4'
import cartIcon from 'assets/img/cart-icon.svg'
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

class ShopMobile extends React.Component 
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
            language: this.props.language,
            tokenChoices: Address.token,
            erc20DispatchManager: this.props.erc20DispatchManager,
            videoSrc: [Amber, Amethyst, Ruby],
            buyNbr: [1,1,1],

        }
    }

    async UNSAFE_componentWillMount()
    {
        if(Object.keys(this.props.erc20DispatchManager).length == 0 && this.props.address !== "")
        {
            let contractHelper = new ContractHelper()
            const provider = await contractHelper.getProvider()
            document.getElementById('WEB3_CONNECT_MODAL_ID').remove()
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
                    document.getElementById('WEB3_CONNECT_MODAL_ID').remove()
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

    async buyBadges(key)
    {
        let contractHelper = new ContractHelper()
        const provider = await contractHelper.getProvider()
        document.getElementById('WEB3_CONNECT_MODAL_ID').remove()
        await contractHelper.createManagedTokens(this.state.tokenChoices, key, this.state.address, this.state.buyNbr[key], '', provider)

        const newBalance = await contractHelper.nftSingleBalance(key, this.state.address, provider)
        const newTotalSupply = await contractHelper.nftSingleTotalsupply(key, provider)
        const { totalSupply, totalBurn } = await contractHelper.getTotalSuplyAndBurn(provider)
        const formatUnit = await contractHelper.setFormatUnits({totalBurn : totalBurn, totalSupply: totalSupply}, 18)
        const getAllUserBadges = await contractHelper.getNftsDatasAtIndex(key, this.state.address, newBalance, provider)

        let badge = {}
        badge[key] = {}
        badge[key] = { userNbrBadge : newBalance, totalSupply : newTotalSupply, userBadges : getAllUserBadges}

        this.props.dashboardAction({data: {badges :  badge, totalSupply: formatUnit.totalSupply, totalBurn: formatUnit.totalBurn} , action : 'saveData'})
    }

    addBadges(key)
    {
        this.state.buyNbr[key] += 1
        this.forceUpdate()
    }

    removeBadges(key)
    {
        if(this.state.buyNbr[key] > 1) this.state.buyNbr[key] -= 1
        this.forceUpdate()
    }

    render()
    {
        let contractHelper = new ContractHelper()

        return(
        
            <div className="home-body home-shop flex column">

                {
                    this.state.address == "" &&
                    ( <Restricted /> )
                }

                <div className="shop-items-core flex column">
                    {
                        this.state.badges.map((value, key) =>
                        {
                            return(
                            <div key={`shop-${key}`} className="shop-items-cards flex column">
                                
                                <div className="shop-item-head-core">
                                    
                                    <h3 className="shop-items-title">{value.name} </h3>
                                    <div className="shop-count-core flex row center">
                                        <button className="button shop-min" onClick={() => this.removeBadges(key)}>-</button>
                                        <h1 className="shop-count-text">{this.state.buyNbr[key]}</h1>
                                        <button className="button shop-max" onClick={() => this.addBadges(key)}>+</button>
                                    </div>
                                    <div className="shop-items-data-core">
                                    
                                        <div className="shop-info-title flex column">
                                            <p className="shop-text-title">{ Language[this.state.language].shopPop.price }</p>
                                            <p className="shop-text-title">{ Language[this.state.language].shopPop.lifetime }</p>
                                            <p className="shop-text-title">{ Language[this.state.language].shopPop.dailyReward }</p>
                                            <p className="shop-text-title">{ Language[this.state.language].shopPop.dailyRoi }</p>
                                            <p className="shop-text-title">{ Language[this.state.language].shopPop.remaining }</p>
                                        </div>

                                        <div className="shop-info-desc flex column">
                                            <p className="shop-text-desc">{contractHelper.setFormatUnit(value.price, 18) * this.state.buyNbr[key] } $CREST</p>
                                            <p className="shop-text-desc">{Language[this.state.language].shopPop.lifetimeValue }</p>
                                            <p className="shop-text-desc">{contractHelper.setFormatUnit(value.rewardAmount, 18)} $CREST</p>
                                            <p className="shop-text-desc">
                                                {
                                                    parseFloat(contractHelper.setFormatUnit(value.rewardAmount, 18))
                                                    / 
                                                    parseFloat  (contractHelper.setFormatUnit(value.price, 18))
                                                    * 100
                                                } %
                                            </p>
                                            <p className="shop-text-desc">
                                                {
                                                    contractHelper.getNb(parseInt(value.max) - parseInt(value.totalSupply), 0) 
                                                }
                                            </p>
                                        </div>
                                    </div>
                                    
                                    {/* {
                                        this.state.erc20DispatchManager[this.state.tokenChoices] !== undefined &&
                                        (
                                            this.state.erc20DispatchManager[this.state.tokenChoices].allowance === true 
                                            ?(
                                                <button className="button shop-items-button flex row" onClick={() => this.buyBadges(key)}> 
                                                    <img className="shop-items-button-icon" src={cartIcon} alt={cartIcon} />
                                                    <p className="shop-items-button-text">{contractHelper.setFormatUnit(value.price, 18)}$CREST</p>
                                                </button>
                                            ): <button className="button shop-items-button flex center" onClick={() => this.setAllowance()}>{ Language[this.state.language].shopPop.approveBtn }</button>
                                        )
                                    } */}

                                {
                                parseInt(value.totalSupply) < parseInt(value.max)
                                ? (
                                    this.state.erc20DispatchManager[this.state.tokenChoices] !== undefined &&
                                    (
                                        this.state.erc20DispatchManager[this.state.tokenChoices].allowance === true 
                                        ?(
                                            <button className="button shop-items-button flex row" onClick={() => this.buyBadges(key)}> 
                                                <img className="shop-items-button-icon" src={cartIcon} alt={cartIcon} />
                                                <p className="shop-items-button-text">{contractHelper.setFormatUnit(value.price, 18) * this.state.buyNbr[key]}$CREST</p>
                                            </button>
                                        ): <button className="button shop-items-button flex center" onClick={() => this.setAllowance()}>{ Language[this.state.language].shopPop.approveBtn }</button>
                                    )
                                ) : <div className="shop-popup-button">{ Language[this.state.language].shopPop.soldout }</div>
                            }
                                    
                                </div>


                                <div className="shop-items">
                                    <video className="shop-video" autoPlay muted loop>
                                        <source src={this.state.videoSrc[key]} type="video/mp4" />
                                    </video>
                                </div>

                            </div>
                            )
                        })
                        
                    }
                </div>

            </div>
        );
    }
}

export default connect(MapStateToProps, mapDispatchToProps)(ShopMobile);
