import Address from 'contracts/address.contracts.json'
import  {ethers, BigNumber, utils, constants } from "ethers"
import ContractHelper from './contract.helpers'


class ProfileHelper
{

    


    /*------------------------------------------------------------*/
    /** 
    * @param {Array} badges
    **/

    loadClaimDatas(badges)
    {
        let claimBadges = []
        let totalReward = []
        let contractHelper = new ContractHelper()
        for(const [key, value] of Object.entries(badges))
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
                    checked: false, 
                }

                dataClaim.date = contractHelper.formatEpochToDate(new Date(valueNft.creationTime * 1000))
                dataClaim.claimDate = contractHelper.formatEpochToDate(new Date(valueNft.lastClaim * 1000))

                let [ formatPrice, formatRewardAmount ] = [ contractHelper.setFormatUnit(value.price, 6), contractHelper.setFormatUnit(value.rewardAmount, 6) ]
                let roiTime = (formatPrice / formatRewardAmount) * 24 * 3600

                dataClaim.roi = contractHelper.formatEpochToDate(new Date((valueNft.creationTime + parseInt(roiTime)) * 1000))
                dataClaim.lifetime = contractHelper.formatEpochToDate(new Date((valueNft.creationTime + parseInt(365 * 24 * 3600)) * 1000))
                let formatRewards = contractHelper.getPendingRewards(valueNft, value.rewardAmount)
                dataClaim.rewards = contractHelper.setFormatUnit(formatRewards.toString(), 6)
                amountReward += parseFloat(dataClaim.rewards)

                claimBadges.push(dataClaim)
            }
            totalReward.push(amountReward)
        }
        console.log(claimBadges)
        console.log(totalReward)
        return {totalReward: totalReward, claimBadges: claimBadges}
    }








    /*------------------------------------------------------------*/
    /** 
    * @param {String} address
    * @param {Array} claimBadges
    **/

    async claimAllBadges(address, claimBadges)
    {
        let contractHelper = new ContractHelper()
        const provider = await contractHelper.getProvider()

        let data = {}
        for(const badge of claimBadges) 
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

        await contractHelper.claimBadge(address, badgeIndex, tokenIds, provider)
        // this.state.allChecked = false

        // await this.reloadDataClaim()

    }

    // async reloadDataClaim()
    // {
    //     let contractHelper = new ContractHelper()
    //     const provider = await contractHelper.getProvider()
    //     let newData = []
    //     for(let i = 0; i < Address.badges.length; i++) 
    //     { 
    //         const nftsInfo = await contractHelper.getNftsDatasAtIndex(i, this.state.address, this.state.badges[i].userNbrBadge, provider)
    //         newData.push({userBadges: nftsInfo})
    //     }

    //     for(const [key, value] of Object.entries(this.state.badges))
    //     {
    //         let badge = {}
    //         badge[key] = {}
    //         badge[key] = newData[key]
    //         this.props.dashboardAction({data: {badges :  badge} , action : 'saveData'})
    //     }

    //     const userCrestBalance = await contractHelper.getERC20Balance(this.state.address, Address.token, provider)
    //     const { totalSupply, totalBurn } = await contractHelper.getTotalSuplyAndBurn(provider)
    //     const formatUnit = await contractHelper.setFormatUnits({userCrestBalance : userCrestBalance, totalSupply: totalSupply}, 6)
    //     this.props.dashboardAction({data : {tokenUser: {balance : formatUnit.userCrestBalance}, totalSupply : formatUnit.totalSupply}, action : 'saveData'})
        
    // }
}

export default ProfileHelper