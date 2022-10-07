import 'assets/css/animation/keyframes.assets.css'
import 'assets/css/index.assets.css';
import 'assets/css/global.assets.css';
import 'assets/css/pages/profile.assets.css'
import 'assets/css/globalMobile.assets.css';
import React from "react";
import Navbar from "components/blocks/navbar.block.jsx"
import Leftbar from "components/blocks/leftbar.block.jsx"
import NavbarMobile from "components/blocks/mobile/navbar.mobile.jsx"
import Dashboard from 'components/blocks/dashboard-pr.block.jsx'
import TopBarMobile from "components/blocks/mobile/topbar.mobile.jsx"
import { connect } from 'react-redux'

const MapStateToProps = (state) => {
    return { 
        address: state.login.address,
        startLoading: state.dashboard.startLoading,
        loadingOver: state.dashboard.loadingOver,
    }; 
};


class DashboardGlobal extends React.Component 
{

    constructor(props) 
    {
        super(props);
        this.state = 
        {
            address: this.props.address,
            startLoading: this.props.startLoading,
            loadingOver: this.props.loadingOver,
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
      this.state.width = document.documentElement.clientWidth
      if(this.state.width <= 1500) this.state.isMobile = true
      else this.state.isMobile = false
      this.forceUpdate()
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

    render()
    {
        
        if(this.state.isMobile != true)
        {
            return(
                <div className="home home-dashboard-personnal">
                    <Navbar></Navbar> 
                    <Leftbar></Leftbar>
                    <Dashboard width={this.state.width} />
                </div>
            )
        }else
        {
            return(
                <div className="home home-dashboard-personnal">
                    <TopBarMobile></TopBarMobile>
                    <NavbarMobile currentPage="dashboard"></NavbarMobile>
                    <Dashboard width={this.state.width} />
                </div>
            )
        }
       
    }
}

export default connect(MapStateToProps)(DashboardGlobal);
