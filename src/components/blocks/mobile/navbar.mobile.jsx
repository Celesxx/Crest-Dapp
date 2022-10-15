import 'assets/css/global.assets.css';
import 'assets/css/blocks/navbarMobile.assets.css';
import 'assets/css/blocks/mobile/navbarMobile.assets.css';
import React from "react";
import Logo from 'assets/img/crest-icon.png'
import MobileBar from 'assets/img/mobile/mobile-bar.svg'
import MobileBuy from 'assets/img/mobile/mobile-buy.svg'
import MobileLeftRight from 'assets/img/mobile/mobile-left-right.svg'
import MobileStack from 'assets/img/mobile/mobile-stack.svg'
import { Link } from "react-router-dom";
import { connect } from 'react-redux'
import { DashboardActions } from 'store/actions/dashboard.actions.js'

const MapStateToProps = (state) => {
  return { 
    navbarPosition: state.dashboard.navbarPosition,
    address: state.login.address,
  }; 
}; 

const mapDispatchToProps = (dispatch) => {
  return {
      dashboardAction: (data) => { dispatch(DashboardActions(data)); },
  };
};

class NavbarMobile extends React.Component 
{
  
  constructor(props) 
  {
      super(props);

      this.state = 
      {
        address: this.props.address,
        currentPage: props.currentPage,
        nav: ["", "", "", "", ""],
        navbarPosition: this.props.navbarPosition,
        oldPosition: this.props.navbarPosition,
      };

  }

  async componentDidUpdate(prevProps, prevState, snapshot) 
  {
    for(const [key, value] of Object.entries(this.state))
    {
      if (prevProps[key] !== this.props[key] && this.state[key] != undefined)
      {   
        this.state[key] = this.props[key]
        if(key === "address") document.getElementById("navbar-mobile").style.zIndex="unset";
        this.forceUpdate();
      }
    }
  }

  UNSAFE_componentWillMount()
  {
    if(this.state.currentPage == "home") 
    { 
      this.state.nav[2] = "current"
      this.props.dashboardAction({navbarPosition : 200, action: "navbarPosition"})

    }
    else if(this.state.currentPage == "dashboard") 
    { 
      this.state.nav[0] = "current"
      this.props.dashboardAction({navbarPosition : 0, action: "navbarPosition"})
    }
    else if(this.state.currentPage == "shop") 
    { 
      this.state.nav[1] = "current"
      this.props.dashboardAction({navbarPosition : 100, action: "navbarPosition"})
    }
    else if(this.state.currentPage == "profile") 
    { 
      this.state.nav[3] = "current"
      this.props.dashboardAction({navbarPosition : 300, action: "navbarPosition"})
    }
    else if(this.state.currentPage == "swap") 
    { 
      this.state.nav[4] = "current" 
      this.props.dashboardAction({navbarPosition : 400, action: "navbarPosition"})
    }
  }

  componentDidMount() { if(this.state.address !== "") document.getElementById("navbar-mobile").style.zIndex="unset"; }

  render()
    {
      return(
          <div className="mobile-navbar-base-core flex row" id="navbar-mobile">

              <svg className="mobile-navbar-card-outer" style={{"--currentposition": `${this.state.navbarPosition}%`, "--oldposition": `${this.state.oldPosition}%`}} viewBox="0 0 350 480" xmlns="http://www.w3.org/2000/svg">
                <ellipse cx="176" cy="241" fill="#000000" id="svg_7" rx="170.5" ry="234" stroke="#000000" strokeOpacity="0.01"/>
              </svg>

              <div className="mobile-navbar-card flex row center" style={{"--currentposition": `${this.state.navbarPosition}%`, "--oldposition": `${this.state.oldPosition}%`}} id={this.state.nav[0]}>
                <Link to="/dashboard" className="mobile-navbar-link flex row center">
                  <img className="mobile-navbar-icon" src={MobileBar} alt={MobileBar} />  
                </Link>
              </div>

              <div className="mobile-navbar-card flex row center" style={{"--currentposition": `${this.state.navbarPosition}%`, "--oldposition": `${this.state.oldPosition}%`}} id={this.state.nav[1]}>
                <Link to="/shop" className="mobile-navbar-link flex row center">
                  <img className="mobile-navbar-icon" src={MobileBuy} alt={MobileBuy} />
                </Link> 
              </div>

              <div className="mobile-navbar-card flex row center" style={{"--currentposition": `${this.state.navbarPosition}%`, "--oldposition": `${this.state.oldPosition}%`}} id={this.state.nav[2]}>
                <Link to="/home" className="mobile-navbar-link flex row center">
                  <img className="mobile-navbar-icon" src={Logo} alt={Logo} />
                </Link>  
              </div>

              <div className="mobile-navbar-card flex row center" style={{"--currentposition": `${this.state.navbarPosition}%`, "--oldposition": `${this.state.oldPosition}%`}} id={this.state.nav[3]}>
                <Link to="/profile" className="mobile-navbar-link flex row center">
                  <img className="mobile-navbar-icon" src={MobileStack} alt={MobileStack} /> 
                </Link>
              </div>

              <div className="mobile-navbar-card flex row center" style={{"--currentposition": `${this.state.navbarPosition}%`, "--oldposition": `${this.state.oldPosition}%`}} id={this.state.nav[4]}>
                <Link to="/swap" className="mobile-navbar-link flex row center">
                  <img className="mobile-navbar-icon" src={MobileLeftRight} alt={MobileLeftRight} />
                </Link> 
              </div>

          </div>

      );
    }
}


export default connect(MapStateToProps, mapDispatchToProps)(NavbarMobile);
