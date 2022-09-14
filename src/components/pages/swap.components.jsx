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
import { BigNumber } from "ethers";
import Amber from 'assets/img/amber.mp4'
import Amethyst from 'assets/img/amethyst.mp4'
import Ruby from 'assets/img/ruby.mp4'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck } from '@fortawesome/free-solid-svg-icons'
import { fireEvent } from '@testing-library/react';

const MapStateToProps = (state) => {
    return { 
        address: state.login.address,
        resToken: state.dashboard.resToken,
        resStable: state.dashboard.resStable,
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
          resToken: this.props.resToken,
          resStable: this.props.resStable,
          address: this.props.address,
          crestAmount: null,
          usdtAmount: null,
        }

        this.handleChange = this.handleChange.bind(this)
    }

    async UNSAFE_componentWillMount() 
    {
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
    
    handleChange(event)
    {
      let target = event.target
      if(target.name == "crest") this.state.crestAmount = target.value
      else if(target.name == "usdt") this.state.usdtAmount = target.value
    }

    async swapToken()
    {
      console.log(`crestAmount : ${this.state.crestAmount}, usdtAmount : ${this.state.usdtAmount}`)
      
      let contractHelper = new ContractHelper()
      this.state.crestAmount = await contractHelper.setBignumberUnit(this.state.crestAmount, 6)
      
      console.log(`crestAmount : ${this.state.crestAmount}, usdtAmount : ${this.state.usdtAmount}`)
    }


    render()
    {
        
      return(
        <div className="home p1">

            <Navbar></Navbar>
            <Leftbar></Leftbar>

            <div className="home-body flex column">

              <div className="swap-core flex row">

                <div className="swap-title-core flex column">
                  <h1 className="swap-title">Swap</h1>
                  <p className="swap-description">Trade tokens in an instant</p>

                  <div className="swap-cards flec column center">

                    <div className="swap">
                      <input type="text" name="crest" onChange={this.handleChange}></input>
                    </div>

                    <div className="swap">
                      <input type="text" name="usdt" onChange={this.handleChange}></input>
                    </div>

                    <div className="swap">
                      <button name="submit" onClick={() => this.swapToken()}>Swap</button>
                    </div>

                  </div>

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
