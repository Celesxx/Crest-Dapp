import 'assets/blocks/navbar.assets.css';
import 'assets/global.assets.css';
import React from "react";
import Logo from 'assets/img/crest-icon.png'
import LogoName from 'assets/img/crest-name.png'


class Navbar extends React.Component 
{

  handleLanguage(value) 
  {
    console.log("test")
    console.log(value)
  }

  render()
    {
      return(
          <div className="navbar flex row">

            <div className="navbar-logo flex row center">
              <img className="logo-crest" src={Logo} alt={Logo} />
            </div>

            <div className="navbar-core flex row">

                <select className="navbar-select" onChange={event => this.handleLanguage(event.target.value)}>
                  <option>Language</option>
                  <option value="east">French</option>
                  <option value="west">English</option>
                  <option value="south">Japanese</option>
                </select>

                <select className="navbar-select" onChange={event => this.handleLanguage(event.target.value)}>
                  <option>Ressources</option>
                  <option value="east">Charts</option>
                  <option value="west">Documentation</option>
                  <option value="south">Disclaimer</option>
                  <option value="south">Teams</option>
                </select>
                
            </div>

            <div className="navbar-title flex row center">
              <img className="title-crest" src={LogoName} alt={LogoName} />
            </div>

            <div className="navbar-button flex row">
              <div className="navbar-button-core flex row">
                <button className="button market-button flex row center"> <p>Buy/Sell $CREST</p> </button>
                <button className="button dapp-button flex row center"> <p>Connect Wallet</p> </button>
              </div>
            </div>

          </div>

      );
    }
}

export default Navbar;
