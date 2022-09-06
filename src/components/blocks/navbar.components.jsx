import 'assets/blocks/navbar.assets.css';
import 'assets/global.assets.css';
import React from "react";
import Logo from 'assets/img/crest-icon.png'
import LogoName from 'assets/img/crest-name.png'
import { login, disconnect } from 'store/reducers/login.reducer.js'
import { useSelector, useDispatch, connect } from 'react-redux'
import { LoginActions } from 'store/actions/login.actions.js'


const MapStateToProps = (state) => {
  return { address: state.login }; 
};



const mapDispatchToProps = (dispatch) => {
  return {
    loginAction: (loginState, address, setErrorHandler) => {
      dispatch(LoginActions(loginState, address, setErrorHandler));
    },
  };
};

class Navbar extends React.Component 
{

  constructor(props) 
  {
      super(props);
      this.state = 
      {
        address: "test1",
        dispatch: null,
      };

      // this.connectWallet = this.connectWallet.bind(this);
      this.test = this.test.bind(this);
  }

  componentDidUpdate (prevProps, prevState) {
    console.log("test000000")
    console.log(this.props.address)
    this.state.address = this.props.address
  }

  test = () =>
  {
    this.props.loginAction({address: this.state.address})
  }

  // async connectWallet()
  // {
  //     if (window.ethereum) 
  //     {
        
  //       window.web3 = new Web3(window.ethereum)
  //       await window.ethereum.enable()
        
  //       const web3 = window.web3
  //       const accounts = await web3.eth.getAccounts()
  //       this.$store.commit('setAccount', accounts[0])
  //       this.isLoggedIn = true

  //     }
  //     else if (window.web3) window.web3 = new Web3(window.web3.currentProvider)
  //     else window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
  // }


  
  async componentWillMount() 
  {
    // this.state.address = await this.props.login  
    console.log("willMountFunction")
    console.log(`test props : ${this.props}`)
    // let test = await useSelector((state) => state.loginMetamask.value)

    // if (window.ethereum) 
    // {
    //     this.isMetamaskSupported = true
    //     if(this.$store.state.account != null) this.isLoggedIn = true
    // }
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
                <button className="button dapp-button flex row center" onClick={() => this.test()}> <p>Connect Wallet</p> </button>
              </div>
            </div>

          </div>

      );
    }
}




export default connect(MapStateToProps, mapDispatchToProps)(Navbar);
