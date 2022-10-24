import 'assets/css/animation/keyframes.assets.css'
import 'assets/css/index.assets.css';
import 'assets/css/global.assets.css';
import 'assets/css/pages/swap.assets.css'
import 'assets/css/blocks/mobile/swap.assets.css'
import React from "react";
import Address from 'contracts/address.contracts.json'
import ContractHelper from "helpers/contract.helpers";
import LogoCrest from "assets/img/logoCrest.svg"
import LogoBusd from "assets/img/logoBusd.svg"
import ArrowUpDown from "assets/img/arrowUpDown.svg"
import Restricted from "components/blocks/restricted.block.jsx"
import Language from "assets/data/language.json"
import LogoSwap from "assets/img/swap-dev.mp4"
import { connect } from 'react-redux'
import { LoginActions } from 'store/actions/login.actions.js'
import { DashboardActions } from 'store/actions/dashboard.actions.js'




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
        language: state.login.language,
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
          dataIn: { name: "$BUSD", balance: null, logo: LogoBusd },
          dataOut: { name: "$CREST", balance: null, logo: LogoCrest },
          sellLoader: "usdt",
          startLoading: this.props.startLoading,
          loading: this.props.loading,
          loadingMax: this.props.loadingMax,
          loadingOver: this.props.loadingOver,
          amountPrice: null,
          language: this.props.language,
          width : props.width

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
                  this.state.dataIn.balance = this.props.tokenUser.balance;
                  this.state.dataOut.balance = this.props.stableUser.balance;
                
                }else if(this.state.sellLoader == "usdt" && this.props.address != "" && key == "tokenUser") 
                {
                  this.state.dataIn.balance = this.props.stableUser.balance
                  this.state.dataOut.balance = this.props.tokenUser.balance;
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
        let value = contractHelper.setBignumberUnit(target.value, 18)
        let amountOut = contractHelper.getAmountOut(value, this.state.resToken, this.state.resStable, false)
        this.state.amountPrice = contractHelper.setFormatUnit(amountOut, 18)
      }
      else if(this.state.sellLoader == "usdt" && target.value != "") 
      {
        let value = contractHelper.setBignumberUnit(target.value, 18)
        let amountOut = contractHelper.getAmountOut(value, this.state.resStable, this.state.resToken, true)
        this.state.amountPrice = contractHelper.setFormatUnit(amountOut, 18)
      
      }else if(target.value == "") this.state.amountPrice = null
      this.forceUpdate()

    }

    async setAllowance()
    {
      let contractHelper = new ContractHelper()
      let provider = await contractHelper.getProvider()
      document.getElementById('WEB3_CONNECT_MODAL_ID').remove()

      if(this.state.sellLoader === "token")
      {
        await contractHelper.setApproveAllowance(Address.token, Address.lm, provider)
        this.props.dashboardAction({data: {tokenUser: {allowanceLm : true}}, action: "saveData"})
      }else if(this.state.sellLoader === "usdt")
      {
        await contractHelper.setApproveAllowance(Address.stable, Address.lm, provider)
        this.props.dashboardAction({data: {stableUser: {allowanceLm : true}}, action: "saveData"})
      }
    }

    async swapToken()
    {
      let contractHelper = new ContractHelper()
      let provider = await contractHelper.getProvider()
      document.getElementById('WEB3_CONNECT_MODAL_ID').remove()
      let path, amountIn

      if(this.state.sellLoader === "token") path = [Address.token, Address.stable]
      else if(this.state.sellLoader === "usdt") path = [Address.stable, Address.token] 
      
      amountIn = await contractHelper.setBignumberUnit(document.getElementById("balanceIn").value, 18)
      
      const deadline = Math.floor((new Date()).getTime() / 1000) + 600
      await contractHelper.swapToken(this.state.address, amountIn, 0, path, deadline, provider)

      const { resToken, resStable } = await contractHelper.getReserves(provider)
      const { totalSupply, totalBurn } = await contractHelper.getTotalSuplyAndBurn(provider)
      const userCrestBalance = await contractHelper.getERC20Balance(this.state.address, Address.token, provider)
      const userStableBalance = await contractHelper.getERC20Balance(this.state.address, Address.stable, provider)
      const formatUnit = await contractHelper.setFormatUnits({totalSupply: totalSupply, totalBurn: totalBurn, userCrestBalance: userCrestBalance, userStableBalance: userStableBalance }, 18)
      
      let data = 
      {
        resToken: resToken,
        resStable: resStable,
        totalSupply: formatUnit.totalSupply,
        totalBurn: formatUnit.totalBurn,
        tokenUser: {balance: formatUnit.userCrestBalance},
        stableUser: {balance: formatUnit.userStableBalance}
      }
      this.props.dashboardAction({data: data, action: "saveData"})

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
        this.state.dataIn.name = "$BUSD"
        this.state.dataIn.logo = LogoBusd
        this.state.dataOut.balance = this.props.tokenUser.balance;
        this.state.dataOut.name = "$CREST";
        this.state.dataOut.logo = LogoCrest
      }
      else if(this.state.sellLoader === "usdt") 
      {
        this.state.sellLoader = "token"
        this.state.dataOut.balance = this.props.stableUser.balance;
        this.state.dataOut.name = "$BUSD"
        this.state.dataOut.logo = LogoBusd
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
        let contractHelper = new ContractHelper()
      return(
    
        <div className="home-body flex column">

            {
                this.state.address == "" &&
                ( <Restricted /> )
            }

            {
              this.state.width > 1500 &&
              (
                <div className="swap-title-core flex column">
                <h1 className="swap-title unpadding unmargin">{ Language[this.state.language].swap.title }</h1>
                <p className="swap-description unpadding unmargin">{ Language[this.state.language].swap.description }</p>
                </div>
              )
            }

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
                        <p className="card-balance-text unmargin unpadding">{ Language[this.state.language].swap.balance } : {contractHelper.getNb(this.state.dataIn.balance, 2)}</p>
                    </div>
                    </div>

                    <div className="card-input-core">
                    <input className="card-input" type="text" name="crest" id="balanceIn" onKeyPress={this.checkNumber} onChange={this.handleChange}></input>
                    <button className="card-max" onClick={() => this.setMaxValue()}>{ Language[this.state.language].swap.maxBtn }</button>
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
                        <p className="card-balance-text unmargin unpadding">{ Language[this.state.language].swap.balance } : {contractHelper.getNb(this.state.dataOut.balance, 2)}</p>
                    </div>
                    </div>

                    <div className="card-input-core">
                      <div className="card-input flex row center" type="text" name="crest">{this.state.amountPrice != null ? contractHelper.getNb(this.state.amountPrice, 6) : this.state.amountPrice}</div>
                    </div>

                </div>
                
                </div>
                

                <div className="swap-button-core flex row center">
                {
                    this.state.sellLoader === "token" && this.state.tokenUser.allowanceLm 
                    ?( <button className="swap-button button" name="submit" onClick={() => this.swapToken()}>{ Language[this.state.language].swap.swapBtn }</button> )

                    : this.state.sellLoader === "usdt" && this.state.stableUser.allowanceLm 
                    ?( <button className="swap-button button" name="submit" onClick={() => this.swapToken()}>{ Language[this.state.language].swap.swapBtn }</button> )
                    
                    :( <button className="swap-button button" name="submit" onClick={() => this.setAllowance()}>{ Language[this.state.language].swap.approveBtn }</button> )
                }
                </div>

              </div>

              

              <div className="swap-design flex row center">
                  <video className="swap-video" playsInline autoPlay muted loop>
                  <source src={LogoSwap} type="video/mp4" />
                  </video>
              </div>


            </div>


        </div>



      );
    }
}

export default connect(MapStateToProps, mapDispatchToProps)(Dashboard);
