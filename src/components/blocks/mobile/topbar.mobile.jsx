import 'assets/css/animation/keyframes.assets.css'
import 'assets/css/global.assets.css';
import 'assets/css/blocks/mobile/topbar.mobile.css';
import React from "react";
import walletImg from "assets/img/wallet-mobile.png"
import buyImg from "assets/img/buy.svg"
import Web3 from 'web3'
import Notiflix from 'notiflix'
import Web3Modal from 'web3modal'
import WalletConnectProvider from "@walletconnect/web3-provider"
import network from 'contracts/network.contracts.js'
import Address from 'contracts/address.contracts.json'
import ContractHelper from "helpers/contract.helpers.js"
import LoadingHelper from 'helpers/loadingData.helpers.js'
import { ethers } from 'ethers'
import { connect } from 'react-redux'
import { LoginActions } from 'store/actions/login.actions.js'
import { DashboardActions } from 'store/actions/dashboard.actions.js'


const MapStateToProps = (state) => {
  return { 
    address: state.login.address,
    language: state.login.language,
    badges: state.dashboard.badges
  }; 
};

const mapDispatchToProps = (dispatch) => {
  return {
      loginAction: (data) => { dispatch(LoginActions(data)); },
      dashboardAction: (data) => { dispatch(DashboardActions(data)); },
  };
};

class Topbar extends React.Component 
{

  constructor(props) 
  {
      super(props);

      this.state = 
      {
        address: this.props.address,
        language: this.props.language,
        badges: this.props.badges,
        menuToggle: false,
        isMetamaskSupported: false,
        isLoggedIn: false,
        interval: null,
      };

  }

  async UNSAFE_componentWillMount() 
  {
    if (window.ethereum) 
    {
      this.state.isMetamaskSupported = true
      if(this.props.address != "") 
      { 
        this.state.isLoggedIn = true 
        let contractHelper = new ContractHelper()
        let loadingHelper = new LoadingHelper()
        const provider = await contractHelper.getProvider()

        await loadingHelper.loadAllContractFunction(this.state.address, provider, this.props)
        if(this.state.interval == null) this.state.interval = setInterval(() => this.loadAllContractFunction(), 10000)
      }
    }
  }

  componentWillUnmount()
  {
      clearInterval(this.state.interval)
      this.state.interval = null
  }

  componentDidUpdate(prevProps, prevState, snapshot) 
  {
      for(const [key, value] of Object.entries(this.state))
      {
          if (prevProps[key] !== this.props[key])
          {  
            this.state[key] = this.props[key]
            if(this.state.address != "" && key == "badges" && this.state.interval == null) this.state.interval = setInterval(() => this.loadAllContractFunction(), 10000)
            this.forceUpdate();
          }
      }
  }

  connectWallet = async () => 
  {
      if (this.state.isMetamaskSupported) 
      {

        const providerOptions = { walletconnect: { package: WalletConnectProvider, options: { rpc: { [network.chainId]: network.rpcUrls[0] } } } }
        let web3Modal = new Web3Modal( { cacheProvider: true, providerOptions, disableInjectedProvider: false, theme: "dark" })

        const instance = await web3Modal.connect()
        const newProvider = new ethers.providers.Web3Provider(instance);
        const chainId = (await newProvider.getNetwork()).chainId

        if (chainId == network.chainId) 
        {
          this.state.isLoggedIn = true
          this.props.loginAction({address: await newProvider.getSigner().getAddress(), action: 'address'})
          this.props.dashboardAction({loading : {}, action: "startLoading"})

          let loadingHelper = new LoadingHelper()
          await loadingHelper.loadAllContractFunction(await newProvider.getSigner().getAddress(), newProvider, this.props)
          this.props.dashboardAction({loading : {}, action: "endLoading"})

        }else 
        {
          Notiflix.Notify.warning(
          "Required Network - " + network.chainName, { timeout: 1500, width: '500px', position: 'center-top', fontSize: '22px' });
        }

      }else if (window.web3) window.web3 = new Web3(window.web3.currentProvider)
      else window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
  }

  async loadAllContractFunction()
  {
    let contractHelper = new ContractHelper()
    const provider = await contractHelper.getProvider()

    const { resToken, resStable } = await contractHelper.getReserves(provider)
    const { totalSupply, totalBurn } = await contractHelper.getTotalSuplyAndBurn(provider)
    const formatUnit = await contractHelper.setFormatUnits({totalSupply: totalSupply, totalBurn: totalBurn }, 6)


    let data = 
    {
        resToken : resToken,
        resStable: resStable, 
        totalSupply: formatUnit.totalSupply,
        totalBurn: formatUnit.totalBurn,
        badges: {},
    }
  
    for(let i = 0; i < Address.badges.length; i++) 
    { 
      data.badges[i] = {}
      const newTotalSupply = await contractHelper.nftSingleTotalsupply(i, provider)
      data.badges[i]["totalSupply"] = newTotalSupply
    }
    this.props.dashboardAction({data : data, action: "saveData"})
  }

  toggleMenu()
  {
    this.state.menuToggle = !this.state.menuToggle
    if(this.state.menuToggle) document.querySelectorAll('.home').forEach((element) => { element.classList.add("menu-toggle") })
    else if(!this.state.menuToggle) document.querySelectorAll('.home').forEach((element) => { element.classList.remove("menu-toggle") })
  }

  render()
    {
      return(
        <div className="navbar-mobile-core flex row">

          <input id="navbar-toggle" type="checkbox" onClick={() => this.toggleMenu()} />
          <label className="navbar-mobile-label" htmlFor="navbar-toggle">
            <span className="navbar-mobile-span"></span>
          </label>

          <ul className="navbar-mobile">
              <li><a className="navbar-mobile-item" href="https://playcrest.xyz">Crest</a></li>
              <li><a className="navbar-mobile-item" href="https://discord.com/invite/mUHGNqN8Vj">Community</a></li>
              <li><a className="navbar-mobile-item" href="https://medium.com/@playCrest">Doc</a></li>
              <li><a className="navbar-mobile-item" href="https://twitter.com/playCrest">Twitter</a></li>
          </ul>

          <div className='navbar-mobile-wallet-core flex center'>
           
            {
              this.state.address !== "" 
              ?<div className="navbar-mobile-wallet-address flex row center"><p className='navbar-address'>{ this.state.address.substr(0, 6) + '...' +  this.state.address.substr( this.state.address.length - 6,  this.state.address.length)  }</p></div>
              :(
                <button className='navbar-mobile-wallet-button button flex center' onClick={() => this.connectWallet()}>
                  <img className='navbar-mobile-wallet-img' src={walletImg} alt={walletImg}></img>
                </button>
              )
            }
            <button className="navbar-mobile-wallet-buy button flex center">
              <img className='navbar-mobile-wallet-img' src={buyImg} alt={buyImg}></img>
            </button>
            
          </div>

            
        </div>

      );
    }
}

export default connect(MapStateToProps, mapDispatchToProps)(Topbar);