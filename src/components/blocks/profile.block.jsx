import 'assets/css/animation/keyframes.assets.css'
import 'assets/css/index.assets.css';
import 'assets/css/global.assets.css';
import 'assets/css/pages/profile.assets.css'
import 'assets/css/blocks/mobile/profile.assets.css'
import React from "react";
import ContractHelper from "helpers/contract.helpers";
import Restricted from "components/blocks/restricted.block.jsx"
import Address from 'contracts/address.contracts.json'
import Language from 'assets/data/language.json'
import { LoginActions } from 'store/actions/login.actions.js'
import { DashboardActions } from 'store/actions/dashboard.actions.js'
import { connect } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck } from '@fortawesome/free-solid-svg-icons'

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
            badges: this.props.badges,
            claimBadges : [],
            address: this.props.address,
            allChecked: false,
            nbrCheck: 0,
            checked: [],
            firstLoad: true,
            startLoading: this.props.startLoading,
            loading: this.props.loading,
            loadingMax: this.props.loadingMax,
            loadingOver: this.props.loadingOver,
            totalReward: [],
            interval : null,
            language : this.props.language,
            emptyRow : [0,1,2,3],
            width: props.width
        }
    }

    
    UNSAFE_componentWillMount()
    {
        if(this.state.interval == null) { this.state.interval = setInterval(() => this.loadClaimDatas(), 1000) }
    }

    componentDidUpdate(prevProps, prevState, snapshot) 
    {
        for(const [key, value] of Object.entries(this.state))
        {
            if (prevProps[key] !== this.props[key])
            {   
                this.state[key] = this.props[key] 
                if(key == "badges" && this.state.address != "") 
                {
                    if(this.state.interval == null) this.state.interval = setInterval(() => this.loadClaimDatas(), 1000)
                }
                this.forceUpdate();
            }
        }
    }

    componentWillUnmount()
    {
        clearInterval(this.state.interval)
        this.state.interval = null
    }
    

    loadClaimDatas()
    {
        this.state.claimBadges = []
        this.state.totalReward = []
        let contractHelper = new ContractHelper()
        for(const [key, value] of Object.entries(this.state.badges))
        {
            let amountReward = 0.0
            for(const [keyNft, valueNft] of Object.entries(value.userBadges))
            {
                let dataClaim = 
                { 
                    badgeId: key,
                    nft : value.name, 
                    id : valueNft.tokenId, 
                    date : null, 
                    claimDate : null,
                    roi: null, 
                    lifetime: null, 
                    rewards: null,
                }
                
                if(this.state.firstLoad) this.state.checked.push(false)
                dataClaim.date = contractHelper.formatEpochToDate(new Date(valueNft.creationTime * 1000))
                dataClaim.claimDate = contractHelper.formatEpochToDate(new Date(valueNft.lastClaim * 1000))

                let [ formatPrice, formatRewardAmount ] = [ contractHelper.setFormatUnit(value.price, 18), contractHelper.setFormatUnit(value.rewardAmount, 18) ]
                let roiTime = (formatPrice / formatRewardAmount) * 24 * 3600

                dataClaim.roi = contractHelper.formatEpochToDate(new Date((valueNft.creationTime + parseInt(roiTime)) * 1000))
                dataClaim.lifetime = contractHelper.formatEpochToDate(new Date((valueNft.creationTime + parseInt(365 * 24 * 3600)) * 1000))
                let formatRewards = contractHelper.getPendingRewards(valueNft, value.rewardAmount)
                dataClaim.rewards = contractHelper.setFormatUnit(formatRewards.toString(), 18)
                amountReward += parseFloat(dataClaim.rewards)

                this.state.claimBadges.push(dataClaim)
            }
            this.state.totalReward.push(amountReward)
        }
        this.state.firstLoad = false
        this.forceUpdate()
    }


    multipleSelect(key, value)
    {
        this.state.checked[key] = !this.state.checked[key]
        this.state.checked[key] === true ? this.state.nbrCheck += 1 : this.state.nbrCheck -= 1
        this.forceUpdate();
    }

    allSelect()
    {
        this.state.allChecked = !this.state.allChecked

        this.state.checked.map((value, key) => 
        {
            this.state.checked[key] = this.state.allChecked
            // this.state.checked[key] === true ? this.state.nbrCheck += 1 : this.state.nbrCheck -= 1
        })
        if(this.state.allChecked) this.state.nbrCheck = this.state.claimBadges.length 
        else this.state.nbrCheck = 0
        this.forceUpdate();
    }

    async singleSelect(key, value)
    {
        let contractHelper = new ContractHelper()
        const provider = await contractHelper.getProvider()
        document.getElementById('WEB3_CONNECT_MODAL_ID').remove()
        await contractHelper.claimBadge(this.state.address, [value.badgeId], [[value.id]], provider)
        await this.reloadDataClaim()
        this.state.allChecked = false
    }

    async claimAllBadges()
    {
        let contractHelper = new ContractHelper()
        const provider = await contractHelper.getProvider()
        document.getElementById('WEB3_CONNECT_MODAL_ID').remove()

        let data = {}
        for(const [key, value] of Object.entries(this.state.checked)) 
        {
            if(value)
            {
                if(data[this.state.claimBadges[key].badgeId] === undefined) data[this.state.claimBadges[key].badgeId] = [this.state.claimBadges[key].id] 
                else data[this.state.claimBadges[key].badgeId].push(this.state.claimBadges[key].id)
            }
        }
        let tokenIds = []
        let badgeIndex = []

        Object.keys(data).map((key) => {badgeIndex.push(parseInt(key))})
        Object.values(data).map((value) => {tokenIds.push(value)})

        await contractHelper.claimBadge(this.state.address, badgeIndex, tokenIds, provider)
        this.state.allChecked = false

        await this.reloadDataClaim()

    }

    async reloadDataClaim()
    {
        let contractHelper = new ContractHelper()
        const provider = await contractHelper.getProvider()
        document.getElementById('WEB3_CONNECT_MODAL_ID').remove()
        let newData = []
        for(let i = 0; i < Address.badges.length; i++) 
        { 
            const nftsInfo = await contractHelper.getNftsDatasAtIndex(i, this.state.address, this.state.badges[i].userNbrBadge, provider)
            newData.push({userBadges: nftsInfo})
        }

        for(const [key, value] of Object.entries(this.state.badges))
        {
            let badge = {}
            badge[key] = {}
            badge[key] = newData[key]
            this.props.dashboardAction({data: {badges :  badge} , action : 'saveData'})
        }

        const userCrestBalance = await contractHelper.getERC20Balance(this.state.address, Address.token, provider)
        const { totalSupply, totalBurn } = await contractHelper.getTotalSuplyAndBurn(provider)
        const formatUnit = await contractHelper.setFormatUnits({userCrestBalance : userCrestBalance, totalSupply: totalSupply}, 18)
        this.props.dashboardAction({data : {tokenUser: {balance : formatUnit.userCrestBalance}, totalSupply : formatUnit.totalSupply}, action : 'saveData'})
        
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

            <div className="profile-laderboard flex row">

                <div className="profile-laderboard-core flex row">

                    {
                        this.state.badges.map((value, key) => 
                        {
                            return (
                                <div key={`profile-${key}`} className="profile-laderboard-cards flex column">
                                    <p className="profile-title">{value.name}</p>
                                    <div className="profile-score flex row center">{contractHelper.getNb(this.state.totalReward[key], 6)}</div>
                                </div>
                            )
                        })
                    }
                    

                </div>

                <button className="claim-all-button button" onClick={() => this.claimAllBadges()}>{ Language[this.state.language].profile.claimAllBtn } ({this.state.nbrCheck}/{this.state.claimBadges.length})</button>

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
                    {
                        this.state.width > 1500
                        ?(
                            Language[this.state.language].profile.tableTitle.map((value, key) => 
                            {
                                return( <p key={`table-${key}`} className="profile-table-title">{value}</p> )
                            })
                        ):(
                            Language[this.state.language].profile.tableTitle.map((value, key) => 
                            {
                                if(
                                    parseInt(key) === parseInt(Object.keys(Language[this.state.language].profile.tableTitle)[0])
                                    ||
                                    parseInt(key) === parseInt(Object.keys(Language[this.state.language].profile.tableTitle).slice(-2)[0])
                                    ||
                                    parseInt(key) === parseInt(Object.keys(Language[this.state.language].profile.tableTitle).slice(-1)[0])
                                ) return( <p key={`table-${key}`} className="profile-table-title">{value}</p> )
                            })
                        )
                    }
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
                                                <input type="checkbox" checked={this.state.checked[key]} className="profile-radio-input" id={`radio-${key}`} name={`radio-${key}`} onChange={() => this.multipleSelect(key, value)} />
                                                { this.state.checked[key] != false && <FontAwesomeIcon icon={faCheck} className="profile-radio-checked"/> }
                                            </div>
                                        </div>
                                    </div>
                                    <p className="profile-table-desc">{value.nft}</p>
                                    { this.state.width > 1500 && <p className="profile-table-desc">{value.id}</p> }
                                    { this.state.width > 1500 && <p className="profile-table-desc">{value.date}</p> }
                                    { this.state.width > 1500 && <p className="profile-table-desc">{value.claimDate}</p> }
                                    { this.state.width > 1500 && <p className="profile-table-desc">{value.roi}</p> }
                                    { this.state.width > 1500 && <p className="profile-table-desc">{value.lifetime}</p> }
                                    <p className="profile-table-desc">{contractHelper.getNb(value.rewards, 6)}</p>
                                    <div className="profile-table-desc profile-table-button-core flex row center">
                                        <button className="button profile-table-button" onClick={() => this.singleSelect(key, value)}>{ Language[this.state.language].profile.claimBtn }</button>
                                    </div>
                                </div>
                            )
                        })
                    )
                }

            </div>

        </div>

      );
    }
}

export default connect(MapStateToProps, mapDispatchToProps)(Dashboard);
