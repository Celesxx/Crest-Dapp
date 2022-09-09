import Address from 'contracts/address.contracts.json'
import AbiUniswap from 'contracts/abis/router/UniswapV2Pair.sol/UniswapV2Pair.json'
import AbiToken from 'contracts/abis/Token.sol/Token.json'
import abiBadges from 'contracts/abis/Badge.sol/Badge.json'
import { ethers } from "ethers";
import Web3Modal from 'web3modal'


class ContractHelper
{

    /**
     *
    */
    async getProvider()
    {
        const web3Modal = new Web3Modal({ cacheProvider: true, theme: "dark" });
        const instance = await web3Modal.connect(); 
        const provider = await new ethers.providers.Web3Provider(instance);

        return provider
    }

    



    /*------------------------------ Get Price ------------------------------*/
    /**
     * @param {Number} number
     * @param {Number} decimal
    */
    getNb(number, decimal) 
    {
        let fractionDigits = 0;
        if (decimal) fractionDigits = decimal;
        if (isNaN(number)) throw "NaN"
        return parseFloat(number).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: fractionDigits })
    }





    /*------------------------------ Get Price ------------------------------*/
    /**
     * @param {Object} data
     * @param {Number} decimal
    */
    async setFormatUnits(data, decimal)
    {
        let newData = data
       
        for(const [key, value] of Object.entries(data))
        {
            newData[key] = parseFloat(ethers.utils.formatUnits(value, decimal))
        }

        return newData
    }











    /*------------------------------ Get reserves ------------------------------*/
    /**
     * @param {Circular structure} provider
    */
     async getReserves(provider)
     {
         let uniswap = await new ethers.Contract(Address.pair, AbiUniswap, provider)
         let data = await uniswap.getReserves()
         let resToken, resStable
         if (ethers.BigNumber.from(Address.token).lt(Address.mockStable)) 
         {
             resToken = data[0].toString()
             resStable = data[1].toString()
         }else 
         {
             resToken = data[1].toString()
             resStable = data[0].toString()
         }
 
         return {resToken: resToken, resStable: resStable}
     }







    /*------------------------------ Get Price ------------------------------*/
    /**
     * @param {Circular structure} provider
    */
     async getTotalSuplyAndBurn(provider)
     {
        const token = await new ethers.Contract(Address.token, AbiToken, provider)

        return {
            totalSupply: (await token.totalSupply()).toString(),
            totalBurn: (await token.totalBurn()).toString()
        }

     }







    /*------------------------------ Get market cap and price ------------------------------*/
    /**
     * @param {String} reserveStable
     * @param {String} reserveToken
     * @param {String} totalSupplyToken
     * @param {Number} decimal
    */
    getMarketCapAndPrice(reserveStable, reserveToken, totalSupplyToken, decimal) 
    {
        const price = parseFloat(ethers.utils.formatUnits(reserveStable, decimal)) / parseFloat(ethers.utils.formatUnits(reserveToken, decimal))
        const totalSupply = parseFloat(ethers.utils.formatUnits(totalSupplyToken, decimal))

        return { price: price, marketCap: price * totalSupply }
    }





    /*------------------------------ Get global badges ------------------------------*/
    /** 
    * @param {Structure} provider
    **/
    async getGlobalBadges(provider) 
    {
	    const globalBadges = []

        for (let i = 0; i < Address.badges.length; i++) {
            const badge = new ethers.Contract(Address.badges[i], abiBadges, provider)

            globalBadges.push(
                {
                    name: await badge.name(),
                    totalSupply: (await badge.totalSupply()).toString(),
                    price: (await badge.price()).toString(),
                    max: (await badge.max()).toString(),
                    rewardAmount: (await badge.rewardAmount()).toString()
                }
            )
        }

	    return globalBadges
    }


    /** 
    * @param {Object} badgesGlobal
    **/
    getTotalNft(badgesGlobal) 
    {
        let total = 0
        for (let badge of badgesGlobal) 
        {
            console.log(badge)
            total += parseInt(badge.totalSupply)
        }

        return total
    }



}


export default ContractHelper