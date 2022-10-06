import 'assets/css/blocks/leftbar.assets.css';
import 'assets/css/global.assets.css';
import React from "react";
import Twitter from 'assets/img/twitter.png'
import Medium from 'assets/img/medium.png'
import Discord from 'assets/img/discord.png'
import Telegram from 'assets/img/telegram.png'
import { Link } from "react-router-dom";
import { connect } from 'react-redux'
import { LoginActions } from 'store/actions/login.actions.js'
import { DashboardActions } from 'store/actions/dashboard.actions.js'
import Language from 'assets/data/language.json'


const MapStateToProps = (state) => {
  return { 
    language: state.login.language,
  }; 
};


const mapDispatchToProps = (dispatch) => {
  return {
      loginAction: (data) => { dispatch(LoginActions(data)); },
  };
};


class Leftbar extends React.Component 
{

    constructor(props) 
    {
        super(props);

        this.state = 
        {
        language: this.props.language,
        };
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
      return(
          <div className="leftbar flex column">

            <div className="leftbar-hidden"></div>

            <div className="leftbar-core flex column">

                <div className="leftbar-link flex column">
                    <Link to="/home" className="link"><p>{ Language[this.state.language].leftbar.homeTitle }</p></Link>
                    <div className="link-bar"></div>
                </div>

                <div className="leftbar-link flex column">
                    <Link to="/dashboard" className="link"><p>{ Language[this.state.language].leftbar.dashboard }</p></Link>
                    <div className="link-bar"></div>
                </div>

                <div className="leftbar-link flex column">
                    <Link to="/shop" className="link"><p>{ Language[this.state.language].leftbar.shop }</p></Link>
                    <div className="link-bar"></div>
                </div>

                <div className="leftbar-link flex column">
                    <Link to="/profile" className="link"><p>{ Language[this.state.language].leftbar.myNft }</p></Link>
                    <div className="link-bar"></div>
                </div>

                <div className="leftbar-link flex column">
                    <Link to="/swap" className="link"><p>{ Language[this.state.language].leftbar.swap }</p></Link>
                    <div className="link-bar"></div>
                </div>

                <div className="social-link flex column">
                    <a href="https://twitter.com/playCrest" className="link"><img src={Twitter} alt={Twitter} /> </a>
                    <a href="https://medium.com/@playCrest" className="link"><img src={Medium} alt={Medium} /></a>
                    <a href="https://discord.com/invite/mUHGNqN8Vj" className="link"><img src={Discord} alt={Discord} /></a>
                </div>

            </div>
          </div>
      );
    }
}

export default connect(MapStateToProps, mapDispatchToProps)(Leftbar);
