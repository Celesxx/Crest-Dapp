import 'assets/blocks/leftbar.assets.css';
import 'assets/global.assets.css';
import React from "react";
import Twitter from 'assets/img/twitter.png'
import Medium from 'assets/img/medium.png'
import Discord from 'assets/img/discord.png'
import Telegram from 'assets/img/telegram.png'
import { Link } from "react-router-dom";


class Leftbar extends React.Component 
{

  render()
    {
      return(
          <div className="leftbar flex column">

            <div className="leftbar-hidden"></div>

            <div className="leftbar-core flex column">

                <div className="leftbar-link flex column">
                    <Link to="/home" className="link"><p>Home</p></Link>
                    <div className="link-bar"></div>
                </div>

                <div className="leftbar-link flex column">
                    <Link to="/dashboard" className="link"><p>Dashboard</p></Link>
                    <div className="link-bar"></div>
                </div>

                <div className="leftbar-link flex column">
                    <Link to="/shop" className="link"><p>Shop</p></Link>
                    <div className="link-bar"></div>
                </div>

                <div className="leftbar-link flex column">
                    <Link to="/profile" className="link"><p>My NFT's</p></Link>
                    <div className="link-bar"></div>
                </div>

                <div className="leftbar-link flex column">
                    <Link to="/swap" className="link"><p>Swap</p></Link>
                    <div className="link-bar"></div>
                </div>

                <div className="social-link flex column">
                    <a href="http://test.com" className="link"><img src={Twitter} alt={Twitter} /> </a>
                    <a href="http://test.com" className="link"><img src={Medium} alt={Medium} /></a>
                    <a href="http://test.com" className="link"><img src={Discord} alt={Discord} /></a>
                    <a href="http://test.com" className="link"><img src={Telegram} alt={Telegram} /></a>
                </div>

            </div>
          </div>
      );
    }
}

export default Leftbar;
