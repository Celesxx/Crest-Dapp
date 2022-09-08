import Address from 'contracts/address.contracts.json'
import AbiUniswap from 'contracts/abis/router/UniswapV2Pair.sol/UniswapV2Pair.json'
import { ethers } from "ethers";
import Web3Modal from 'web3modal'


class ContractHelper
{

    /**
     *
    */
    async getProvider()
    {
        const web3Modal = new Web3Modal({ cacheProvider: true });
        const instance = await web3Modal.connect(); 
        const provider = await new ethers.providers.Web3Provider(instance);

        let uniswap = await new ethers.Contract(Address.pair, AbiUniswap, provider)
        let data = await uniswap.getReserves()
        return data
    }





    /*------------------------------ Get Price ------------------------------*/
    /**
     * @param {Circular structure} data
    */
    async getPrice(data)
    {
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

        let price = parseFloat(ethers.utils.formatUnits(resStable, 0)) / parseFloat(ethers.utils.formatUnits(resToken, 0))
        return price
    }
    
}


export default ContractHelper