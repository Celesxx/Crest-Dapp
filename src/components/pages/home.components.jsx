import 'assets/css/index.assets.css';
import 'assets/css/global.assets.css';
import 'assets/css/pages/home.assets.css'
import 'assets/css/globalMobile.assets.css';
import 'assets/css/blocks/mobile/home.assets.css'
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

  UNSAFE_componentWillMount() { window.addEventListener('resize', this.handleWindowSizeChange); }
  componentWillUnmount() { window.removeEventListener('resize', this.handleWindowSizeChange); }
  componentDidMount()
  {
    this.state.width = document.documentElement.clientWidth
    let isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile && this.state.width <= 1500) 
    {
      this.state.isMobile = true
      const root = document.getElementById('root');
      const home = document.querySelector('.home');
      if (window.matchMedia("(orientation: landscape)").matches) 
      {
        root.style["height"] = "100vw"
        home.style["height"] = "100vw"
      }
      else 
      {
        root.style["height"] = "100vh"
        home.style["height"] = null
      }
    }else
    {
      this.state.isMobile = false
      const root = document.getElementById('root');
      const home = document.querySelector('.home');
      root.style["height"] = "100vh"
      home.style["height"] = null
    }
    this.forceUpdate()
  }

  handleWindowSizeChange(event) 
  { 
    this.state.width = document.documentElement.clientWidth
    let isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    console.log("is mobile : ", isMobile)
    if (isMobile && this.state.width <= 1500) 
    {
      this.state.isMobile = true
      const root = document.getElementById('root');
      const home = document.querySelector('.home');
      if (window.matchMedia("(orientation: landscape)").matches) 
      {
        root.style["height"] = "150vw"
        home.style["height"] = "150vw"
      }
      else 
      {
        root.style["height"] = "100vh"
        home.style["height"] = null
      }
    }else 
    {
      this.state.isMobile = false
      const root = document.getElementById('root');
      const home = document.querySelector('.home');
      root.style["height"] = "100vh"
      home.style["height"] = null
    }
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
              <Home isMobile={this.state.isMobile}/>
          </div>
      )
    }else
    {
      return(
          <div className="home">
              <TopBarMobile></TopBarMobile>
              <NavbarMobile currentPage="home"></NavbarMobile>
              <Home isMobile={this.state.isMobile}/>

          </div>
      )
    }
  }
}

export default Index;
