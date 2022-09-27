import 'assets/index.assets.css';
import 'assets/global.assets.css';
import 'assets/pages/home.assets.css'
import React from "react";
import Navbar from "components/blocks/navbar.block.jsx"
import NavbarMobile from "components/blocks/navbarMobile.block.jsx"
import Leftbar from "components/blocks/leftbar.block.jsx"
import Home from "components/blocks/home.block.jsx"

class Index extends React.Component 
{

  constructor(props) 
  {
      super(props);

      this.state = 
      {
        width: window.innerWidth,
      };

  }

  UNSAFE_componentWillMount() { window.addEventListener('resize', this.handleWindowSizeChange); }
  componentWillUnmount() { window.removeEventListener('resize', this.handleWindowSizeChange); }
  handleWindowSizeChange = () => { this.state.width = window.innerWidth };

  render()
    {
      const isMobile = this.state.width <= 500;

      if(!isMobile)
      {
        return(
          <div className="home p1">

            <Navbar></Navbar>
            <Leftbar></Leftbar>
            <Home></Home>
          
          </div>

        );
      }
      else
      {
        return(
          <NavbarMobile currentPage="home"></NavbarMobile>
        )
      }
    }
}

export default Index;
