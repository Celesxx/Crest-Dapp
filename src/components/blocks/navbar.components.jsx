import 'assets/blocks/navbar.assets.css';
import 'assets/global.assets.css';
import React from "react";
import Logo from 'assets/img/crest-icon.png'
import LogoName from 'assets/img/crest-name.png'
// import { login, disconnect } from 'store/reducers/login.reducer.js'
import { connect } from 'react-redux'
import { LoginActions } from 'store/actions/login.actions.js'
import Web3 from 'web3'
// import Web3ContextProvider from 'components/pages/test2';
import { ethers, providers } from 'ethers'
import Notiflix from 'notiflix';
import Web3Modal from 'web3modal'
import WalletConnectProvider from "@walletconnect/web3-provider";
import network from 'contracts/network.contracts.js'
import UserContext from 'userContext.js'

const MapStateToProps = (state) => {
  return { address: state.login.address }; 
};


const mapDispatchToProps = (dispatch) => {
  return {
    loginAction: (loginState, data) => {
      dispatch(LoginActions(loginState, data));
    },
  };
};


class Navbar extends React.Component 
{
  static contextType = UserContext
  
  constructor(props) 
  {
      super(props);

      this.state = 
      {
        address: "",
        isMetamaskSupported: false,
        isLoggedIn: false,
        provider: {},
      };

      // this.connectWallet = this.connectWallet.bind(this);
  }

  async UNSAFE_componentWillMount() 
  {
    if (window.ethereum) 
    {
        this.state.isMetamaskSupported = true
        if(this.props.address != "") 
        {
          this.state.isLoggedIn = true
          this.state.address = this.props.address
        }
        this.state.provider = new ethers.providers.JsonRpcProvider(network.rpcUrls[0])
    }
  }

  componentDidUpdate (prevProps, prevState) {
    this.state.address = this.props.address
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
          this.state.provider = newProvider
          this.state.address = await newProvider.getSigner().getAddress()
          this.state.isLoggedIn = true

          this.props.loginAction({address: this.state.address, action: 'address'})
          this.context.provider = newProvider
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

                <select className="navbar-select" onChange={event => this.handleLanguage(event.target.value)}>
                  <option>Language</option>
                  <option value="east">French</option>
                  <option value="west">English</option>
                  <option value="south">Japanese</option>
                </select>

                <select className="navbar-select" onChange={event => this.handleLanguage(event.target.value)}>
                  <option>Ressources</option>
                  <option value="east">Charts</option>
                  <option value="west">Documentation</option>
                  <option value="south">Disclaimer</option>
                  <option value="south">Teams</option>
                </select>
                
            </div>

            <div className="navbar-title flex row center">
              <img className="title-crest" src={LogoName} alt={LogoName} />
            </div>
            <div className="navbar-button flex row">
              <div className="navbar-button-core flex row">
                <button className="button market-button flex row center"> <p>Buy/Sell $CREST</p> </button>
                {
                  this.state.isLoggedIn 
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
