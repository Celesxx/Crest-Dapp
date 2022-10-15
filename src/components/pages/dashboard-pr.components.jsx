import 'assets/css/animation/keyframes.assets.css'
import 'assets/css/index.assets.css';
import 'assets/css/global.assets.css';
import 'assets/css/pages/profile.assets.css'
import React from "react";
import Navbar from "components/blocks/navbar.block.jsx"
import Leftbar from "components/blocks/leftbar.block.jsx"
import NavbarMobile from "components/blocks/mobile/navbar.mobile.jsx"
import Dashboard from 'components/blocks/dashboard-pr.block.jsx'
import TopBarMobile from "components/blocks/mobile/topbar.mobile.jsx"
import LoadingData from "components/blocks/loading-data.block.jsx"
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
                    {
                        this.state.startLoading == true && this.state.loadingOver == false
                        && <LoadingData />
                    }
                    <Dashboard width={this.state.width} />
                </div>
            )
        }else
        {
            return(
                <div className="home home-dashboard-personnal">
                    <TopBarMobile></TopBarMobile>
                    <NavbarMobile currentPage="dashboard"></NavbarMobile>
                    {
                        this.state.startLoading == true && this.state.loadingOver == false
                        && <LoadingData />
                    }
                    <Dashboard width={this.state.width} />
                </div>
            )
        }
       
    }
}

export default connect(MapStateToProps)(DashboardGlobal);
