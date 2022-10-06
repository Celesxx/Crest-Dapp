import 'assets/css/global.assets.css';
import 'assets/css/blocks/navbar.assets.css';
import React from "react";
import Logo from 'assets/img/crest-icon.png'
import LogoName from 'assets/img/crest-name.png'
import { connect } from 'react-redux'
import { LoginActions } from 'store/actions/login.actions.js'
import { DashboardActions } from 'store/actions/dashboard.actions.js'
import Web3 from 'web3'
import { ethers, providers } from 'ethers'
import Notiflix from 'notiflix';
import Web3Modal from 'web3modal'
import WalletConnectProvider from "@walletconnect/web3-provider";
import network from 'contracts/network.contracts.js'
import LoadingHelper from 'helpers/loadingData.helpers.js'
import ContractHelper from "helpers/contract.helpers";
import Address from 'contracts/address.contracts.json'
import Language from 'assets/data/language.json'


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


class Navbar extends React.Component 
{
  
  constructor(props) 
  {
      super(props);

      this.state = 
      {
        badges: this.props.badges,
        address: this.props.address,
        isMetamaskSupported: false,
        isLoggedIn: false,
        loading: this.props.loading,
        loadingOver: this.props.loadingOver,
        interval: null,
        language: this.props.language,
      };

      this.handleChange = this.handleChange.bind(this)
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


  handleChange(event)
  {
    let target = event.target
    if(target.name == "french") 
    {
      console.log("test french")
      document.getElementById("french").checked = true;
      document.getElementById("english").checked = false;
      document.getElementById("japanese").checked = false;
      this.props.loginAction({language: "fr", action: "language"})
    
    }else if(target.name == "english") 
    {
      console.log("test english")
      document.getElementById("french").checked = false;
      document.getElementById("english").checked = true;
      document.getElementById("japanese").checked = false;
      this.props.loginAction({language: "en", action: "language"})
    
    }else if(target.name == "japanese") 
    {
      console.log("test japanese")
      document.getElementById("french").checked = false;
      document.getElementById("english").checked = false;
      document.getElementById("japanese").checked = true;
      this.props.loginAction({language: "jp", action: "language"})
    
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

  render()
    {
      
      return(
          <div className="navbar flex row">

            <div className="navbar-logo flex row center">
              <img className="logo-crest" src={Logo} alt={Logo} />  
            </div>

            <div className="navbar-core flex row">

                
                <div className="navbar-select" tabIndex="1">
                  <input name="english" className="navbar-input" type="radio" id="english" checked onChange={event => {}} onClick={this.handleChange}/>
                  <label htmlFor="english" className="navbar-option">English</label>
                  <input name="french" className="navbar-input" type="radio" id="french" onChange={event => {}} onClick={this.handleChange}/>
                  <label htmlFor="french" className="navbar-option">French</label>
                  <input name="japanese" className="navbar-input" type="radio" id="japanese" onChange={event => {}} onClick={this.handleChange}/>
                  <label htmlFor="japanese" className="navbar-option navbar-option-last">Don't click</label>
                </div>


                <div className="navbar-select" tabIndex="1">
                  <input name="Charts" className="navbar-input" type="radio" id="opt1" checked onChange={event => {}}/>
                  <label htmlFor="opt1" className="navbar-option"> { Language[this.state.language].navbar.selectDocs.chart } </label>
                  <input name="Documentation" className="navbar-input" type="radio" id="opt2" onChange={event => {}}/>
                  <label htmlFor="opt2" className="navbar-option">{ Language[this.state.language].navbar.selectDocs.doc }</label>
                  <input name="Disclaimer" className="navbar-input" type="radio" id="opt3" onChange={event => {}}/>
                  <label htmlFor="opt3" className="navbar-option">{ Language[this.state.language].navbar.selectDocs.disclaimer }</label>
                  <input name="Teams" className="navbar-input" type="radio" id="opt3" onChange={event => {}}/>
                  <label htmlFor="opt3" className="navbar-option navbar-option-last">{ Language[this.state.language].navbar.selectDocs.team }</label>
                </div>
                
            </div>

            <div className="navbar-title flex row center">
              <img className="title-crest" src={LogoName} alt={LogoName} />
            </div>
            <div className="navbar-button flex row">
              <div className="navbar-button-core flex row">
                <button className="button market-button flex row center"> <p>{ Language[this.state.language].navbar.buyButton }</p> </button>
                {
                  this.state.address !== "" 
                  ?<div className="navbar-address-core flex row center"><p className='navbar-address'>{ this.state.address.substr(0, 6) + '...' +  this.state.address.substr( this.state.address.length - 6,  this.state.address.length)  }</p></div>
                  :<button className="button dapp-button flex row center" onClick={() => this.connectWallet()}> <p>Connect Wallet</p> </button>
                }
                
              </div>
            </div>

          </div>

      );
    }
}


export default connect(MapStateToProps, mapDispatchToProps)(Navbar);
