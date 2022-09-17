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
          crestAmount: null,
          usdtAmount: null,
          sellLoader: "token",
          balanceStable: null,
          balanceToken: null,
          startLoading: this.props.startLoading,
          loading: this.props.loading,
          loadingMax: this.props.loadingMax,
          loadingOver: this.props.loadingOver,
        }

        this.handleChange = this.handleChange.bind(this)
    }

    // async UNSAFE_componentWillMount() 
    // {
    //   let contractHelper = new ContractHelper()
    //   let provider = await contractHelper.getProvider()
    //   let hasAllowanceToken = await contractHelper.hasAllowance(this.state.address, Address.token, Address.lm, provider)
    //   let hasAllowanceStable = await contractHelper.hasAllowance(this.state.address, Address.stable, Address.lm, provider)

    //   this.state.balanceToken = await contractHelper.setFormatUnit(this.state.tokenUser.balance, 6)
    //   this.state.balanceStable = await contractHelper.setFormatUnit(this.state.stableUser.balance, 6)
    //   let data = 
    //   {
    //     tokenUser: { allowanceLm: hasAllowanceToken },
    //     stableUser: { allowanceLm: hasAllowanceStable },
    //   }

    //   this.props.dashboardAction({data: data, action: "saveData"})
    //   this.forceUpdate()
    // }

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
    
    handleChange(event)
    {
      let target = event.target
      if(target.name == "crest") this.state.crestAmount = target.value
      else if(target.name == "usdt") this.state.usdtAmount = target.value
    }

    async setAllowance()
    {
      let contractHelper = new ContractHelper()
      let provider = await contractHelper.getProvider()

      if(this.state.sellLoader === "token")
      {
        await contractHelper.setApproveAllowance(Address.token, Address.lm, provider)
        this.props.dashboardAction({data: {tokenUser: {allowanceLm : true}}, action: "swap"})
      }else if(this.state.sellLoader === "usdt")
      {
        await contractHelper.setApproveAllowance(Address.token, Address.lm, provider)
        this.props.dashboardAction({data: {stableUser: {allowanceLm : true}}, action: "swap"})
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

      let crestBalance = await contractHelper.getERC20Balance(this.props.address, Address.token, provider)
      let stableBalance = await contractHelper.getERC20Balance(this.props.address, Address.stable, provider)
      const { resToken, resStable } = await contractHelper.getReserves(provider)

      let data = 
      {
        tokenUser : { balance : crestBalance }, 
        stableUser : { balance: stableBalance },
        resToken : resToken, 
        resStable: resStable,
      }

      this.props.dashboardAction({data: data, action : "swap" })

    }

    changeOrder()
    {
      if(this.state.sellLoader === "token") this.state.sellLoader = "usdt"
      else if(this.state.sellLoader === "usdt") this.state.sellLoader = "token"
      this.forceUpdate();
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
                          <img className="card-logo" src={LogoCrest} alt={LogoCrest}></img>
                          <h2 className="card-title">CREST</h2>
                        </div>

                        <div className="card-balance flex row center">
                          <p className="card-balance-text unmargin unpadding">balance : {this.state.balanceToken}</p>
                        </div>
                      </div>

                      <div className="card-input-core">
                        <input className="card-input" type="text" name="crest" onChange={this.handleChange}></input>
                        <button className="card-max">max</button>
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
                          <img className="card-logo" src={LogoCrest} alt={LogoCrest}></img>
                          <h2 className="card-title">USDT</h2>
                        </div>

                        <div className="card-balance flex row center">
                          <p className="card-balance-text unmargin unpadding">balance : {this.state.balanceToken}</p>
                        </div>
                      </div>

                      <div className="card-input-core">
                        <input className="card-input" type="text" name="crest" onChange={this.handleChange}></input>
                      </div>

                    </div>
                  
                  </div>
                  

                  <div className="swap-button-core flex row center">
                    {
                      this.state.sellLoader === "token" && this.state.tokenUser.allowanceLm 
                      ?( <button className="swap-button button" name="submit" onClick={() => this.swapToken()}>Swap</button> )

                      : this.state.sellLoader === "usdt" && this.state.stableUser.allowanceLm 
                      ?( <button className="swap-button button" name="submit" onClick={() => this.swapUsdt()}>Swap</button> )
                      
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
