import 'assets/index.assets.css';
import 'assets/global.assets.css';
import 'assets/pages/dashboard.assets.css'
import 'assets/pages/dashboard-pe.assets.css'
import React from "react";
import Navbar from "components/blocks/navbar.components.jsx"
import Leftbar from "components/blocks/leftbar.components.jsx"
import Sphere from "assets/img/sphere.svg"
import Web3 from 'web3'

class Dashboard extends React.Component 
{

    constructor(props) 
    {
        super(props);
        this.state = 
        {
            price: 0,
        };
        this.handleChange = this.handleChange.bind(this);
    }
    
    getPrice(event) 
    {
        this.setState(
        {
            [event.target.name]: event.target.value
        });  
    }

    async componentWillMount() 
    {
        await this.loadWeb3()
        await this.loadBlockchainData()
    }

    async checkWeb3()
    {
        if(this.$store.state.connected)
        {
            window.web3 = new Web3(window.ethereum)
            await window.ethereum.enable()

            const web3 = window.web3
            this.contract = new web3.eth.Contract(this.contract_abi, this.contract_address);
            this.connected = true
            this.getEvent()
        }
    }

    render()
    {
        

      return(
        <div className="home p1">

            <Navbar></Navbar>
            <Leftbar></Leftbar>

            <div className="home-body flex column">

                <div className="dashboard-button flex row">
                    <div className="dashboard-button-core flex row">

                        <button onClick={() => this.props.history.push("/dashboard")} className="button-dash button-protocol flex row center">Protocol</button>
                        <button onClick={() => this.props.history.push("/dashboard/personnal")} className="button-dash button-personnal flex row center">Personnal</button>

                    </div>
                </div>

                <div className="dashboard-core flex">

                    <div className="dashboard-cards flex column">
                        <p className="title-dashboard">$CREST Price</p>
                        <div className="dashboard-items flex row center">{this.state.price}</div>
                    </div>

                    <div className="dashboard-cards flex column">
                        <p className="title-dashboard">Market Cap</p>
                        <div className="dashboard-items"></div>
                    </div>

                    <div className="dashboard-cards flex column">
                        <p className="title-dashboard">Total NFT's</p>
                        <div className="dashboard-items"></div>
                    </div>

                    <div className="dashboard-cards flex column">
                        <p className="title-dashboard">Total Supply</p>
                        <div className="dashboard-items"></div>
                    </div>

                    <div className="dashboard-cards flex column">
                        <p className="title-dashboard">Total Token Burn</p>
                        <div className="dashboard-items"></div>
                    </div>

                    <div className="dashboard-badge-core flex column">
                        <div className="dashboard-badge flex column">

                            <div className="dashboard-badge-items flex row">
                                <p className="dashboard-badge-title">Total badge 1:</p>
                                <p className="dashboard-badge-count">0/0</p>
                            </div>
                            <div className="dashboard-badge-items flex row">
                                <p className="dashboard-badge-title">Total badge 1:</p>
                                <p className="dashboard-badge-count">0/0</p>
                            </div>
                            <div className="dashboard-badge-items flex row">
                                <p className="dashboard-badge-title">Total badge 1:</p>
                                <p className="dashboard-badge-count">0/0</p>
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

export default Dashboard;
