import 'assets/global.assets.css';
import 'assets/blocks/navbarMobile.assets.css';
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
