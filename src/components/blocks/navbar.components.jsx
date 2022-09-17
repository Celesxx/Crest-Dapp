import 'assets/blocks/navbar.assets.css';
import 'assets/global.assets.css';
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

const MapStateToProps = (state) => {
  return { 
    address: state.login.address,
    loading: state.dashboard.loading,
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
        address: this.props.address,
        isMetamaskSupported: false,
        isLoggedIn: false,
        loading: this.props.loading,
        loadginOver: this.props.loadingOver,
      };
  }

  async UNSAFE_componentWillMount() 
  {
    if (window.ethereum) 
    {
        this.state.isMetamaskSupported = true
        if(this.props.address != "") { this.state.isLoggedIn = true }
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) 
  {
      for(const [key, value] of Object.entries(this.state))
      {
          if (prevProps[key] !== this.props[key])
          {   
            this.state[key] = this.props[key]
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

        }else 
        {
          Notiflix.Notify.failure(
          "Required Network - " + network.chainName, { timeout: 2500, width: '300px', position: 'right-top' });
        }

      }else if (window.web3) window.web3 = new Web3(window.web3.currentProvider)
      else window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
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
                  <input name="french" className="navbar-input" type="radio" id="opt1" checked onChange={event => {}}/>
                  <label htmlFor="opt1" className="navbar-option">French</label>
                  <input name="english" className="navbar-input" type="radio" id="opt2" onChange={event => {}}/>
                  <label htmlFor="opt2" className="navbar-option">English</label>
                  <input name="japanese" className="navbar-input" type="radio" id="opt3" onChange={event => {}}/>
                  <label htmlFor="opt3" className="navbar-option navbar-option-last">Japanese</label>
                </div>


                <div className="navbar-select" tabIndex="1">
                  <input name="Charts" className="navbar-input" type="radio" id="opt1" checked onChange={event => {}}/>
                  <label htmlFor="opt1" className="navbar-option">Charts</label>
                  <input name="Documentation" className="navbar-input" type="radio" id="opt2" onChange={event => {}}/>
                  <label htmlFor="opt2" className="navbar-option">Docs</label>
                  <input name="Disclaimer" className="navbar-input" type="radio" id="opt3" onChange={event => {}}/>
                  <label htmlFor="opt3" className="navbar-option">Disclaimer</label>
                  <input name="Teams" className="navbar-input" type="radio" id="opt3" onChange={event => {}}/>
                  <label htmlFor="opt3" className="navbar-option navbar-option-last">Teams</label>
                </div>
                
            </div>

            <div className="navbar-title flex row center">
              <img className="title-crest" src={LogoName} alt={LogoName} />
            </div>
            <div className="navbar-button flex row">
              <div className="navbar-button-core flex row">
                <button className="button market-button flex row center"> <p>Buy/Sell $CREST</p> </button>
                {
                  this.state.address !== "" 
                  ?<div className="navbar-address-core flex row center"><p className='navbar-address'>{this.state.address}</p></div>
                  :<button className="button dapp-button flex row center" onClick={() => this.connectWallet()}> <p>Connect Wallet</p> </button>
                }
                
              </div>
            </div>

          </div>

      );
    }
}


export default connect(MapStateToProps, mapDispatchToProps)(Navbar);
