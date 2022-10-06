import 'assets/css/global.assets.css';
import 'assets/css/blocks/navbarMobile.assets.css';
import React from "react";
import Logo from 'assets/img/crest-icon.png'
import MobileBar from 'assets/img/mobile/mobile-bar.svg'
import MobileBuy from 'assets/img/mobile/mobile-buy.svg'
import MobileLeftRight from 'assets/img/mobile/mobile-left-right.svg'
import MobileStack from 'assets/img/mobile/mobile-stack.svg'
import { Link } from "react-router-dom";


class NavbarMobile extends React.Component 
{
  
  constructor(props) 
  {
      super(props);

      this.state = 
      {
        currentPage: props.currentPage,
        nav : ["", "", "", "", ""]
      };

  }

  UNSAFE_componentWillMount()
  {
    console.log(this.state.currentPage)
    if(this.state.currentPage == "home") this.state.nav[2] = "current"
    else if(this.state.currentPage == "dashboard") this.state.nav[0] = "current"
    else if(this.state.currentPage == "shop") this.state.nav[1] = "current"
    else if(this.state.currentPage == "profile") this.state.nav[3] = "current"
    else if(this.state.currentPage == "swap") this.state.nav[4] = "current"
  }
  render()
    {
      return(
          <div className="mobile-navbar-base flex row">

              {/* <svg className="mobile-navbar-svg" width="280" height="63" viewBox="0 0 280 63" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M113.563 14.334C105.45 7.32959 96.2887 0 85.5706 0H1C0.447715 0 0 0.447715 0 1V62C0 62.5523 0.447721 63 1.00001 63H279C279.552 63 280 62.5523 280 62V1C280 0.447715 279.552 0 279 0H194.429C183.711 0 174.55 7.32959 166.437 14.334C159.487 20.3345 150.201 24 140 24C129.799 24 120.513 20.3345 113.563 14.334Z" fill="white"/>
              </svg> */}

              <div className="mobile-navbar-card flex row center" id={this.state.nav[0]}>
                <Link to="/dashboard" className="mobile-navbar-link flex row center">
                  <img className="mobile-navbar-icon" src={MobileBar} alt={MobileBar} />  
                </Link>
              </div>

              <div className="mobile-navbar-card flex row center" id={this.state.nav[1]}>
                <Link to="/shop" className="mobile-navbar-link flex row center">
                  <img className="mobile-navbar-icon" src={MobileBuy} alt={MobileBuy} />
                </Link> 
              </div>

              <div className="mobile-navbar-card flex row center" id={this.state.nav[2]}>
                <Link to="/home" className="mobile-navbar-link flex row center">
                  <img className="mobile-navbar-icon" src={Logo} alt={Logo} />
                </Link>  
              </div>

              <div className="mobile-navbar-card flex row center" id={this.state.nav[3]}>
                <Link to="/profile" className="mobile-navbar-link flex row center">
                  <img className="mobile-navbar-icon" src={MobileStack} alt={MobileStack} /> 
                </Link>
              </div>

              <div className="mobile-navbar-card flex row center" id={this.state.nav[4]}>
                <Link to="/swap" className="mobile-navbar-link flex row center">
                  <img className="mobile-navbar-icon" src={MobileLeftRight} alt={MobileLeftRight} />
                </Link> 
              </div>

          </div>

      );
    }
}


export default NavbarMobile;
