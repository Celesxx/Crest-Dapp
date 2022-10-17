import Address from 'contracts/address.contracts.json'
import AbiUniswap from 'contracts/abis/router/UniswapV2Pair.sol/UniswapV2Pair.json'
import AbiToken from 'contracts/abis/Token.sol/Token.json'
import abiBadges from 'contracts/abis/Badge.sol/Badge.json'
import abiSplitter from 'contracts/abis/splitter/Splitter.sol/Splitter.json'
import abiBadgeManager from 'contracts/abis/BadgeManager.sol/BadgeManager.json'
// import abiErc20 from 'contracts/abis/erc20/ERC20.sol/erc20.json'
import  {ethers, BigNumber, utils, constants } from "ethers"
import Web3Modal from 'web3modal'
import network from 'contracts/network.contracts.js'
import WalletConnectProvider from "@walletconnect/web3-provider";
import Notiflix from 'notiflix'

function displayError(str) {
	Notiflix.Notify.warning(
		str,
		{
			timeout: 1500,
			width: '500px',
			position: 'center-top',
			fontSize: '22px'
		}
	)
}

class ContractHelper
{

    /**
     *
    */
    async getProvider()
    {
        let web3Modal = new Web3Modal({ cacheProvider: true });
        let provider
        if (web3Modal.cachedProvider) provider = await new ethers.providers.Web3Provider(await web3Modal.connect())
        else 
        {
            const providerOptions = { walletconnect: { package: WalletConnectProvider, options: { rpc: { [network.chainId]: network.rpcUrls[0] } } } }
            web3Modal = await new Web3Modal({ cacheProvider: true, providerOptions, disableInjectedProvider: false, theme: "dark" });
            const instance = await web3Modal.connect(); 
            provider = await new ethers.providers.Web3Provider(instance);
        }
        return provider
    }

    async getInstance()
    {
        let web3Modal = new Web3Modal({ cacheProvider: true });
        let provider, instance
        if (web3Modal.cachedProvider) 
        {
            instance = await web3Modal.connect()
            provider = await new ethers.providers.Web3Provider(instance); 
        }
        else 
        {
            const providerOptions = { walletconnect: { package: WalletConnectProvider, options: { rpc: { [network.chainId]: network.rpcUrls[0] } } } }
            web3Modal = await new Web3Modal({ cacheProvider: true, providerOptions, disableInjectedProvider: false, theme: "dark" });
            instance = await web3Modal.connect();
            provider = await new ethers.providers.Web3Provider(instance); 
        }
        return {instance, provider}
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
        if (isNaN(number)) return null
        return parseFloat(number).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: fractionDigits })
    }





    /*------------------------------ set format units object ------------------------------*/
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



    /*------------------------------ set format units ------------------------------*/
    /**
     * @param {Object} data
     * @param {Number} decimal
    */
     setFormatUnit(data, decimal) { return parseFloat(ethers.utils.formatUnits(data, decimal)) }
    





    
    
    /*------------------------------ set bignumber format units ------------------------------*/
    /**
     * @param {Object} data
     * @param {Number} decimal
    */
     setBignumberUnit(data, decimal) { return ethers.utils.parseUnits(data.toString(), decimal)}











    /*------------------------------ Get reserves ------------------------------*/
    /**
     * @param {Circular structure} provider
    */
     async getReserves(provider)
     {
         let uniswap = await new ethers.Contract(Address.pair, AbiUniswap, provider)
         let data = await uniswap.getReserves()
         let resToken, resStable
         if (ethers.BigNumber.from(Address.token).lt(Address.stable)) 
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
        const totalSupply = parseFloat(totalSupplyToken)

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







    /*------------------------------ Get totalNft ------------------------------*/
    /** 
    * @param {Object} badgesGlobal
    **/
    getTotalNft(badgesGlobal) 
    {
        let total = 0
        for (let badge of badgesGlobal) 
        {
            total += parseInt(badge.totalSupply)
        }

        return total
    }




    /*------------------------------ Get balance single nft ------------------------------*/
    /** 
    * @param {Number} index
    * @param {String} userAddress
    * @param {Structure} provider
    **/
    async nftSingleBalance(index, userAddress, provider) 
    {
        const badge = new ethers.Contract(Address.badges[index], abiBadges, provider)
        return (await badge.balanceOf(userAddress)).toNumber()
    }



    
    /*------------------------------ Get balance single nft ------------------------------*/
    /** 
    * @param {Number} index
    * @param {Structure} provider
    **/
    async nftSingleTotalsupply(index, provider) 
    {
        const badge = new ethers.Contract(Address.badges[index], abiBadges, provider)
        return (await badge.totalSupply()).toString()
    }
 



    /*------------------------------ Get erc20 balance of user ------------------------------*/
    /** 
    * @param {String} userAddress
    * @param {String} erc20Address
    * @param {Structure} provider
    **/
    async getERC20Balance(userAddress, erc20Address, provider) 
    {
        const erc20 = new ethers.Contract(erc20Address, abiBadges, provider)
        return (await erc20.balanceOf(userAddress)).toString()
    }









    /*------------------------------  ------------------------------*/
    /** 
    * @param {String} userAddress
    * @param {String} erc20Address
    * @param {String} targetAddress
    * @param {Structure} provider
    **/
    async hasAllowance(userAddress, erc20Address, targetAddress, provider,) 
    {
        const erc20 = new ethers.Contract(erc20Address, AbiToken, provider)
        return (await erc20.allowance(userAddress, targetAddress)).gt(0)
    }







    /*------------------------------  ------------------------------*/
    /** 
    * @param {String} erc20Address
    * @param {String} targetAddress
    * @param {Structure} provider
    **/
    async setApproveAllowance(erc20Address, targetAddress, provider) 
    {
		try {
			const erc20 = new ethers.Contract(erc20Address, AbiToken, provider)
			return (await erc20.connect(provider.getSigner()).approve(targetAddress, ethers.constants.MaxUint256)).wait()
		} catch(e) {
			if (e.reason != undefined)
				displayError(e.reason)
			throw "Error"
		}
    }






    /*------------------------------  ------------------------------*/
    /** 
    * @param {Number} index
    * @param {String} userAddress
    * @param {Object} badgesUser
    * @param {Structure} provider
    **/
    async getNftsDatasAtIndex(index, userAddress, badgesUser, provider) 
    {
        const badge = new ethers.Contract(Address.badges[index], abiBadges, provider)
        const length = badgesUser
    
        let nfts = []
        const incr = 10;
        const dataNb = 4;
    
        for (let i=0; i < length; i += incr) 
        {
            const tokenIds = (await badge.viewTokensOfOwnerByIndex(userAddress, i, incr))[0]
            const tokenIdsData = await badge.viewDataBatch(tokenIds, 0, dataNb)
    
            for (let j=0; j < tokenIdsData.length; j++) 
            {
                nfts.push(
                {
                    tokenId: tokenIds[j].toNumber(),
                    creationTime: tokenIdsData[j][0].toNumber(), // toNumber important here
                    lastClaim: tokenIdsData[j][1].toNumber(), // same
                    boostId: tokenIdsData[j][2].toNumber(), // same
                    boostRate: tokenIdsData[j][3].toNumber(), // same
                })
            }
        }
    
        return nfts
    }














    /*------------------------------  ------------------------------*/
    /** 
    * @param {Object} nftData
    * @param {Object} badgeReward
    **/
    getPendingRewards(nftData, badgeReward) 
    {
        const creationTime = BigNumber.from(nftData.creationTime)
        const lastClaim = BigNumber.from(nftData.lastClaim)
        const rewardAmount = BigNumber.from(badgeReward)
        const rewardAmountTime = BigNumber.from(24 * 3600)
        const lifespan = BigNumber.from(365 * 24 * 3600)
        const timestamp = BigNumber.from(Math.floor((new Date()).getTime() / 1000))

        if (creationTime.eq(0)) { // only during presale
            return 0; // User must claim once to activate his presale badge
        }

        if (creationTime.add(lifespan).lt(timestamp)) {
            return rewardAmount.mul( creationTime.add(lifespan).sub(lastClaim) ).div(rewardAmountTime)
        }

        return rewardAmount.mul( timestamp.sub(lastClaim) ).div(rewardAmountTime)
    }








    /*------------------------------  ------------------------------*/
    /** 
    * @param {Structure} provider
    **/

    async getPayees(provider) 
    {
        const splitter = new ethers.Contract(Address.splitter, abiSplitter, provider)
        const size = (await splitter.payeesSize()).toNumber()
        const addresses = await splitter.payeesBetweenIndexes(0, size)
        const shares = await splitter.sharesBetweenIndexes(0, size)

        let payees = []
        for (let i=0; i < size; i++) 
        {
            payees.push({
                address: addresses[i],
                shares: shares[i].toString(),
                pending: (await splitter['pendingOf(address,address)'](Address.stable, addresses[i])).toString(),
                released: (await splitter['released(address,address)'](Address.stable, addresses[i])).toString(),
            })
        }

        return payees
    }







    /*------------------------------  ------------------------------*/
    /** 
    * @param {Structure} userAddress
    * @param {Object} userAddress
    **/
    displayPayee(userAddress, payees) 
    {
        userAddress = userAddress.toLowerCase()
        for (let payee of payees) if (payee.address.toLowerCase() == userAddress) return true
        return false
    }







    /*------------------------------  ------------------------------*/
    /** 
    * @param {Number} num
    **/
    formatEpochToDate(num) 
    {
        return [ num.getDate(), num.getMonth() + 1, num.getFullYear(), ].join('/');
    }
    
      




    /*------------------------------  ------------------------------*/
    /** 
    * @param {String} address
    * @param {Array} badgeIndex
    * @param {Array} tokenIds
    * @param {Structure} provider
    **/
    async claimBadge(address, badgeIndex, tokenIds, provider)
    {
		try {
			const badgeManager = new ethers.Contract(Address.badgeManager, abiBadgeManager, provider)
			await(await badgeManager.connect(provider.getSigner()).claim(address, badgeIndex, tokenIds)).wait()
		} catch(e) {
			if (e.reason != undefined)
				displayError(e.reason)
			throw "Error"
		}
    }






    /*------------------------------  ------------------------------*/
    /** 
    * @param {String} address
    * @param {Number} amountIn
    * @param {Number} amountOutMin
    * @param {Array} path
    * @param {Number} deadline
    * @param {Structure} provider
    **/
    async swapToken(address, amountIn, amountOutMin, path, deadline,  provider)
	{
		try {
			const token = new ethers.Contract(Address.token, AbiToken, provider)
			await(await token.connect(provider.getSigner()).swapExactTokensForTokens(amountIn, amountOutMin, path, address, deadline)).wait()
		} catch(e) {
			if (e.reason != undefined)
				displayError(e.reason)
			throw "Error"
		}
    }







    /*------------------------------  ------------------------------*/
    /** 
    * @param {String} erc20Addr
    * @param {Number} i
    * @param {String} to
    * @param {Number} amount
    * @param {String} influId
    * @param {Structure} provider
    **/
    async createManagedTokens(erc20Addr, i, to, amount, influId, provider) 
	{
		try {
			const badgeManager = new ethers.Contract(Address.badgeManager, abiBadgeManager, provider)
			await (await badgeManager.connect(provider.getSigner()).createManagedTokens(erc20Addr, i, to, amount, influId)).wait()
		} catch(e) {
			if (e.reason != undefined)
				displayError(e.reason)
			throw "Error"
		}
    }






    /*------------------------------  ------------------------------*/
    /** 
    * @param {String} erc20Addr
    * @param {Structure} provider
    **/
    async getNameContract(erc20Addr, provider) 
    {
        const erc20 = new ethers.Contract(erc20Addr, AbiToken, provider)
        return await erc20.name()
    }








    /*------------------------------  ------------------------------*/
    /** 
    * @param {Number} amountIn
    * @param {Number} reserveIn
    * @param {Number} reserveOut
    **/
    getAmountOutUniV2(amountIn, reserveIn, reserveOut) 
    {
        const amountInWithFee = ethers.BigNumber.from(amountIn).mul(9975)
        const numerator = amountInWithFee.mul(reserveOut)
        const denominator = ethers.BigNumber.from(reserveIn).mul(10000).add(amountInWithFee)
        return numerator.div(denominator)
    }
    





    /*------------------------------  ------------------------------*/
    /** 
    * @param {Number} amountIn
    * @param {Number} reserveIn
    * @param {Number} reserveOut
    * @param {Boolean} fromStable
    **/
    getAmountOut(amountIn, reserveIn, reserveOut, fromStable) 
    {
        if (fromStable) { return this.getAmountOutUniV2(amountIn, reserveIn, reserveOut).toString() } 
        else 
        {
            const amountOut = this.getAmountOutUniV2(amountIn, reserveIn, reserveOut)
            return amountOut.sub(amountOut.mul(1000).div(10000)).toString()
        }
    }





    /*------------------------------  ------------------------------*/
    /** 
    * @param {Number} index
    * @param {Number} tokenId
    * @param {Strucuture} provider
    **/
    async getNftDatas(index, tokenId, provider) 
    {
        const badge = new ethers.Contract(Address.badges[index], abiBadges, provider)
    
        const dataNb = 4;
    
        let data = (await badge.viewData(tokenId, 0, dataNb))[0]
        return {
            tokenId: tokenId,
            creationTime: data[0].toNumber(),
            lastClaim: data[1].toNumber(),
            boostId: data[2].toNumber(),
            boostRate: data[3].toNumber(),
        }
    }


}


export default ContractHelper