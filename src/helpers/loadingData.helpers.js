import Address from 'contracts/address.contracts.json'
import  {ethers, BigNumber, utils, constants } from "ethers"
import ContractHelper from './contract.helpers'



class LoadingHelper
{



    /*------------------------------  ------------------------------*/
    /** 
    * @param {String} address
    * @param {Structure} provider
    * @param {Structure} props
    **/
    async loadAllContractFunction(address, provider, props)
    {

        let contractHelper = new ContractHelper()

        const { resToken, resStable } = await contractHelper.getReserves(provider)
        props.dashboardAction({loading : {}, action: "loading"})
        const { totalSupply, totalBurn } = await contractHelper.getTotalSuplyAndBurn(provider)
        props.dashboardAction({loading : {}, action: "loading"})
        const { price, marketCap } = await contractHelper.getMarketCapAndPrice(resStable, resToken, totalSupply, 6)
        props.dashboardAction({loading : {}, action: "loading"})
        const globalBadges = await contractHelper.getGlobalBadges(provider)
        props.dashboardAction({loading : {}, action: "loading"})
        const totalNbrBadges = await contractHelper.getTotalNft(globalBadges)
        props.dashboardAction({loading : {}, action: "loading"})
        const formatUnit = await contractHelper.setFormatUnits({totalSupply: totalSupply, totalBurn: totalBurn }, 6)
        props.dashboardAction({loading : {}, action: "loading"})
        const userCrestBalance = await contractHelper.getERC20Balance(address, Address.token, provider)
        props.dashboardAction({loading : {}, action: "loading"})
        const hasAllowanceToken = await contractHelper.hasAllowance(address, Address.token, Address.lm, provider)
        props.dashboardAction({loading : {}, action: "loading"})
        const hasAllowanceStable = await contractHelper.hasAllowance(address, Address.stable, Address.lm, provider)
        props.dashboardAction({loading : {}, action: "loading"})

        let data = 
        {
            resToken : resToken,
            resStable: resStable, 
            totalSupply: formatUnit.totalSupply,
            totalBurn: formatUnit.totalBurn,
            price: price, 
            marketCap: marketCap,
            badges: globalBadges,
            totalBadges: totalNbrBadges,
            pendingReward: BigNumber.from(0),
            dailyReward: null,
            tokenUser: { balance: null, allowanceLm: hasAllowanceToken},
            stableUser: { balance: null, allowanceLm: hasAllowanceStable},
            claimBadges: [],
            totalReward: {}
        }



        for(let i = 0; i < Address.badges.length; i++) 
        { 
            const nft = await contractHelper.nftSingleBalance(i, address, provider)
            const nftsInfo = await contractHelper.getNftsDatasAtIndex(i, address, nft, provider)
            data.badges[i]["userBadges"] = nftsInfo
            data.badges[i]["userNbrBadge"] = nft
        }
        

        for(const badgesInfo of data.badges)
        {
            for(const singleBadges of badgesInfo.userBadges)
            {
                let total = await contractHelper.getPendingRewards(singleBadges, badgesInfo.rewardAmount)
                data.pendingReward = data.pendingReward.add(total)
            }
        }
        props.dashboardAction({loading : {}, action: "loading"})
       
        data.tokenUser.balance = await contractHelper.setFormatUnit(userCrestBalance, 6)
        data.pendingReward = await contractHelper.setFormatUnit(data.pendingReward.toString(), 6)
        props.dashboardAction({loading : {}, action: "loading"})

        for(const badge of data.badges) data.dailyReward += badge.userNbrBadge * await contractHelper.setFormatUnit(badge.rewardAmount,6)
        props.dashboardAction({loading : {}, action: "loading"})



        for(const [key, value] of Object.entries(data.badges))
        {
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

                dataClaim.date = await contractHelper.formatEpochToDate(new Date(valueNft.creationTime * 1000))
                dataClaim.claimDate = await contractHelper.formatEpochToDate(new Date(valueNft.lastClaim * 1000))

                let [ formatPrice, formatRewardAmount ] = [ await contractHelper.setFormatUnit(value.price, 6), await contractHelper.setFormatUnit(value.rewardAmount, 6) ]
                let roiTime = (formatPrice / formatRewardAmount) * 24 * 3600

                dataClaim.roi = await contractHelper.formatEpochToDate(new Date((valueNft.creationTime + parseInt(roiTime)) * 1000))
                dataClaim.lifetime = await contractHelper.formatEpochToDate(new Date((valueNft.creationTime + parseInt(365 * 24 * 3600)) * 1000))
                let formatRewards = await contractHelper.getPendingRewards(valueNft, value.rewardAmount)
                dataClaim.rewards = await contractHelper.setFormatUnit(formatRewards.toString(), 6)

                data.claimBadges.push(dataClaim)
            }

            data.totalReward[key] = 0.0
        }
        props.dashboardAction({loading : {}, action: "loading"})
        for(const badge of data.claimBadges) { data.totalReward[badge.badgeId] += badge.rewards }

        
        await new Promise(r => setTimeout(r, 1000));
        props.dashboardAction({loading : {}, action: "loading"})
        props.dashboardAction({data : data, action: "saveData"})
    }
}

export default LoadingHelper