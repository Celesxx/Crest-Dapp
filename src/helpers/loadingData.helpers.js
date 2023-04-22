import Address from 'contracts/address.contracts.json'
import  {ethers, BigNumber, utils, constants } from "ethers"
import ContractHelper from './contract.helpers'
import Amber from 'assets/img/amber.mp4'
import Amethyst from 'assets/img/amethyst.mp4'
import Ruby from 'assets/img/ruby.mp4'


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
        const formatUnit = await contractHelper.setFormatUnits({totalSupply: totalSupply, totalBurn: totalBurn }, 6)
        props.dashboardAction({loading : {}, action: "loading"})
        const globalBadges = await contractHelper.getGlobalBadges(provider)
        props.dashboardAction({loading : {}, action: "loading"})
        const userCrestBalance = await contractHelper.getERC20Balance(address, Address.token, provider)
        props.dashboardAction({loading : {}, action: "loading"})
        const userStableBalance = await contractHelper.getERC20Balance(address, Address.stable, provider)
        props.dashboardAction({loading : {}, action: "loading"})
        const hasAllowanceToken = await contractHelper.hasAllowance(address, Address.token, Address.lm, provider)
        props.dashboardAction({loading : {}, action: "loading"})
        const hasAllowanceStable = await contractHelper.hasAllowance(address, Address.stable, Address.lm, provider)
        props.dashboardAction({loading : {}, action: "loading"})

        let data = 
        {
            videoSrc : [Amber, Amethyst, Ruby],
            resToken : resToken,
            resStable: resStable, 
            totalSupply: formatUnit.totalSupply,
            totalBurn: formatUnit.totalBurn,
            badges: globalBadges,
            tokenUser: { balance: null, allowanceLm: hasAllowanceToken},
            stableUser: { balance: null, allowanceLm: hasAllowanceStable},
        }



        for(let i = 0; i < Address.badges.length; i++) 
        { 
            const nft = await contractHelper.nftSingleBalance(i, address, provider)
            const nftsInfo = await contractHelper.getNftsDatasAtIndex(i, address, nft, provider)
            data.badges[i]["userBadges"] = nftsInfo
            data.badges[i]["userNbrBadge"] = nft
        }
        
        
        props.dashboardAction({loading : {}, action: "loading"})
        data.tokenUser.balance = await contractHelper.setFormatUnit(userCrestBalance, 6)
        props.dashboardAction({loading : {}, action: "loading"})
        data.stableUser.balance = await contractHelper.setFormatUnit(userStableBalance, 6)
        props.dashboardAction({loading : {}, action: "loading"})

        
        await new Promise(r => setTimeout(r, 1000));
        props.dashboardAction({loading : {}, action: "loading"})
        props.dashboardAction({data : data, action: "saveData"})
        return
    }
}

export default LoadingHelper