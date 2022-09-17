import 'assets/animation/keyframes.assets.css'
import 'assets/index.assets.css';
import 'assets/global.assets.css';
import 'assets/pages/swap.assets.css'
import React from "react";
import Navbar from "components/blocks/navbar.components.jsx"
import Leftbar from "components/blocks/leftbar.components.jsx"
import Sphere from "assets/img/sphere.svg"
import { LoginActions } from 'store/actions/login.actions.js'
import { DashboardActions } from 'store/actions/dashboard.actions.js'
import { connect } from 'react-redux'
import Address from 'contracts/address.contracts.json'
import ContractHelper from "helpers/contract.helpers";
import LogoCrest from "assets/img/logoCrest.svg"
import ArrowUpDown from "assets/img/arrowUpDown.svg"
import Restricted from "components/blocks/restricted.components.jsx"
import LoadingData from "components/blocks/loadingData.components.jsx"

const MapStateToProps = (state) => {
    return { 
        address: state.login.address,
        resToken: state.dashboard.resToken,
        resStable: state.dashboard.resStable,
        tokenUser: state.dashboard.tokenUser,
        stableUser: state.dashboard.stableUser,
        startLoading: state.dashboard.startLoading,
        loading: state.dashboard.loading,
        loadingMax: state.dashboard.loadingMax,
        loadingOver: state.dashboard.loadingOver,
    }; 
};

const mapDispatchToProps = (dispatch) => {
    return {
        loginAction: (data) => { dispatch(LoginActions(data)); },
        dashboardAction: (data) => { dispatch(DashboardActions(data)); },
    };
};
class Dashboard extends React.Component 
{

  constructor(props) 
    {
        super(props);
        this.state = 
        {
          tokenUser: this.props.tokenUser,
          stableUser: this.props.stableUser,
          resToken: this.props.resToken,
          resStable: this.props.resStable,
          address: this.props.address,
          dataIn: { name: "$CREST", balance: null, logo: LogoCrest },
          dataOut: { name: "$USDC", balance: null, logo: LogoCrest },
          sellLoader: "token",
          startLoading: this.props.startLoading,
          loading: this.props.loading,
          loadingMax: this.props.loadingMax,
          loadingOver: this.props.loadingOver,
          amountPrice: null,
        }

        this.handleChange = this.handleChange.bind(this)
    }

    async UNSAFE_componentWillMount()
    {
        if(this.props.tokenUser.balance != null && this.state.address != "")
        {
            if(this.state.sellLoader == "token") 
            {
              this.state.dataIn.balance = this.props.tokenUser.balance;
              this.state.dataOut.balance = this.props.stableUser.balance;
            }
            else if(this.state.sellLoader == "usdt") 
            {
              this.state.dataIn.balance = this.props.stableUser.balance
              this.state.dataOut.balance = this.props.tokenUser.balance;
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

                if(this.state.sellLoader == "token" && this.props.address != "" && key == "tokenUser") 
                {
                  this.state.balanceIn = this.props.tokenUser.balance;
                  this.state.balanceOut = this.props.stableUser.balance;
                
                }else if(this.state.sellLoader == "usdt" && this.props.address != "" && key == "tokenUser") 
                {
                  this.state.balanceIn = this.props.stableUser.balance
                  this.state.balanceOut = this.props.tokenUser.balance;
                }

                this.forceUpdate();
            }
        }
    }
    
    handleChange(event, type)
    {
      let target
      if(type === undefined) target = event.target
      else if(type == "setMaxValue") target = event
      let contractHelper = new ContractHelper()

      if(this.state.sellLoader == "token" && target.value != "") 
      {
        let value = contractHelper.setBignumberUnit(target.value, 6)
        let amountOut = contractHelper.getAmountOut(value, this.state.resToken, this.state.resStable, false)
        this.state.amountPrice = contractHelper.setFormatUnit(amountOut, 6)
      }
      else if(this.state.sellLoader == "usdt" && target.value != "") 
      {
        let value = contractHelper.setBignumberUnit(target.value, 6)
        let amountOut = contractHelper.getAmountOut(value, this.state.resStable, this.state.resToken, true)
        this.state.amountPrice = contractHelper.setFormatUnit(amountOut, 6)
      
      }else if(target.value == "") this.state.amountPrice = null
      this.forceUpdate()

    }

    async setAllowance()
    {
      let contractHelper = new ContractHelper()
      let provider = await contractHelper.getProvider()

      if(this.state.sellLoader === "token")
      {
        await contractHelper.setApproveAllowance(Address.token, Address.lm, provider)
        this.props.dashboardAction({data: {tokenUser: {allowanceLm : true}}, action: "saveData"})
      }else if(this.state.sellLoader === "usdt")
      {
        await contractHelper.setApproveAllowance(Address.token, Address.lm, provider)
        this.props.dashboardAction({data: {stableUser: {allowanceLm : true}}, action: "saveData"})
      }
    }

    async swapToken()
    {
      let contractHelper = new ContractHelper()
      let provider = await contractHelper.getProvider()
      let path, amountIn

      if(this.state.sellLoader === "token")
      {
        path = [Address.token, Address.stable]
        amountIn = await contractHelper.setBignumberUnit(this.state.crestAmount, 6)
      }
      else if(this.state.sellLoader === "usdt")
      {
        path = [Address.stable, Address.token] 
        amountIn = await contractHelper.setBignumberUnit(this.state.usdtAmount, 6)
      } 

      const deadline = Math.floor((new Date()).getTime() / 1000) + 600
      await contractHelper.swapToken(this.state.address, amountIn, 0, path, deadline, provider)

    }

    setMaxValue()
    {
      document.getElementById("balanceIn").value = (this.state.dataIn.balance)
      this.handleChange(document.getElementById("balanceIn"), "setMaxValue")
    }

    changeOrder()
    {
      if(this.state.sellLoader === "token") 
      {
        this.state.sellLoader = "usdt"
        this.state.dataIn.balance = this.props.stableUser.balance;
        this.state.dataIn.name = "$USDC"
        this.state.dataIn.logo = LogoCrest
        this.state.dataOut.balance = this.props.tokenUser.balance;
        this.state.dataOut.name = "$CREST";
        this.state.dataOut.logo = LogoCrest
      }
      else if(this.state.sellLoader === "usdt") 
      {
        this.state.sellLoader = "token"
        this.state.dataOut.balance = this.props.stableUser.balance;
        this.state.dataOut.name = "$USDC"
        this.state.dataOut.logo = LogoCrest
        this.state.dataIn.balance = this.props.tokenUser.balance;
        this.state.dataIn.name = "$CREST";
        this.state.dataIn.logo = LogoCrest
      }
      this.forceUpdate();
    }

    checkNumber(event)
    {
      let target = event.target
      let theEvent = event
      let key
      if (theEvent.type === 'paste') 
      {
          key = event.clipboardData.getData('text/plain');
      } else 
      {
          key = theEvent.keyCode || theEvent.which;
          key = String.fromCharCode(key);
      }

      let regex = /^[0-9]+[.]{0,1}[0-9]{0,6}$/
      
      if( !regex.test(target.value + key) )
      {
        theEvent.returnValue = false;
        if(theEvent.preventDefault) theEvent.preventDefault();
      }
    }

    render()
    {
        
      return(
        <div className="home p1">

            <Navbar></Navbar>
            <Leftbar></Leftbar>

            {
                this.state.startLoading == true && this.state.loadingOver == false && this.state.address !== null &&
                ( <LoadingData /> )
            }
            <div className="home-body flex column">

                {
                    this.state.address == "" &&
                    ( <Restricted /> )
                }

              <div className="swap-title-core flex column">
                <h1 className="swap-title unpadding unmargin">Swap</h1>
                <p className="swap-description unpadding unmargin">Trade tokens in an instant</p>
              </div>

              <div className="swap-core-base flex row">
                <div className="swap-core flex column">
                  <div className="swap-content-core">

                    <div className="card-core flex column center">
                    
                      <div className="card-content flex row">
                        <div className="card-title-core flex row">
                          <img className="card-logo" src={this.state.dataIn.logo} alt={this.state.dataIn.logo}></img>
                          <h2 className="card-title">{this.state.dataIn.name}</h2>
                        </div>

                        <div className="card-balance flex row center">
                          <p className="card-balance-text unmargin unpadding">balance : {this.state.dataIn.balance}</p>
                        </div>
                      </div>

                      <div className="card-input-core">
                        <input className="card-input" type="text" name="crest" id="balanceIn" onKeyPress={this.checkNumber} onChange={this.handleChange}></input>
                        <button className="card-max" onClick={() => this.setMaxValue()}>max</button>
                      </div>

                    </div>


                    <div className="card-swap-core flex row center">
                      <button className="card-swap-button" onClick={() => this.changeOrder()}>
                        <img src={ArrowUpDown} alt={ArrowUpDown} className="card-swap-arrow" />
                      </button>
                    </div>


                    <div className="card-core flex column center">
                    
                      <div className="card-content flex row">
                        <div className="card-title-core flex row">
                          <img className="card-logo" src={this.state.dataOut.logo} alt={this.state.dataOut.logo}></img>
                          <h2 className="card-title">{this.state.dataOut.name}</h2>
                        </div>

                        <div className="card-balance flex row center">
                          <p className="card-balance-text unmargin unpadding">balance : {this.state.dataOut.balance}</p>
                        </div>
                      </div>

                      <div className="card-input-core">
                        <div className="card-input flex row center" type="text" name="crest">{this.state.amountPrice}</div>
                      </div>

                    </div>
                  
                  </div>
                  

                  <div className="swap-button-core flex row center">
                    {
                      this.state.sellLoader === "token" && this.state.tokenUser.allowanceLm 
                      ?( <button className="swap-button button" name="submit" onClick={() => this.swapToken()}>Swap</button> )

                      : this.state.sellLoader === "usdt" && this.state.stableUser.allowanceLm 
                      ?( <button className="swap-button button" name="submit" onClick={() => this.swapToken()}>Swap</button> )
                      
                      :( <button className="swap-button button" name="submit" onClick={() => this.setAllowance()}>Approve</button> )
                    }
                  </div>

                </div>

                <div className="swap-design">

                </div>


              </div>


            </div>

            <div className="home-sphere flex column center flex row center">
                <img src={Sphere} alt={Sphere} className="sphere-img" />
            </div>

        </div>

      );
    }
}

export default connect(MapStateToProps, mapDispatchToProps)(Dashboard);
