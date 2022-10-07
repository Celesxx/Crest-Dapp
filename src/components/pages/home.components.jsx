import 'assets/css/index.assets.css';
import 'assets/css/global.assets.css';
import 'assets/css/pages/home.assets.css'
import 'assets/css/globalMobile.assets.css';
import React from "react";
import Navbar from "components/blocks/navbar.block.jsx"
import NavbarMobile from "components/blocks/mobile/navbar.mobile.jsx"
import Leftbar from "components/blocks/leftbar.block.jsx"
import Home from "components/blocks/home.block.jsx"
import TopBarMobile from "components/blocks/mobile/topbar.mobile.jsx"

class Index extends React.Component 
{

  constructor(props) 
  {
      super(props);

      this.state = 
      {
        width: window.innerWidth,
        isMobile: false

      };
      this.handleWindowSizeChange = this.handleWindowSizeChange.bind(this)
  }

  UNSAFE_componentWillMount() 
  { 
    window.addEventListener('resize', this.handleWindowSizeChange);
    this.state.width = document.documentElement.clientWidth
    if(this.state.width <= 1500) this.state.isMobile = true
    else this.state.isMobile = false
    this.forceUpdate()
  }
  componentWillUnmount() { window.removeEventListener('resize', this.handleWindowSizeChange); }
  handleWindowSizeChange(event) 
  { 
    console.log("test")
    this.state.width = document.documentElement.clientWidth
    if(this.state.width <= 1500) this.state.isMobile = true
    else this.state.isMobile = false
    this.forceUpdate()
  }

  render()
  {
    if(this.state.isMobile != true)
    {
      return(
          <div className="home">
              <Navbar></Navbar> 
              <Leftbar></Leftbar>
              <Home />
          </div>
      )
    }else
    {
      return(
          <div className="home">
              <TopBarMobile></TopBarMobile>
              <NavbarMobile currentPage="home"></NavbarMobile>
          </div>
      )
    }
  }
}

export default Index;
