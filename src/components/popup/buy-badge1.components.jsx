import React from "react";
import Popup from 'reactjs-popup';
import 'assets/animation/keyframes.assets.css'
import 'assets/index.assets.css';
import 'assets/global.assets.css';
import 'assets/pages/shop.assets.css'
import 'assets/popup/buy-badge1.assets.css'

class BuyPopup extends React.Component 
{  

    render()
    {
        return(
            <Popup trigger={<button className="button shop-items-button">Buy for 100$CREST</button>} modal nested>
            {
                close => (
                    <div className="shop-popup-base flex row">
                        
                        <button className="shop-popup-close button" onClick={close}> &times; </button>
                        <div className="shop-popup-items"></div>

                        <div className="shop-popup-cards flex column">

                            <h1 className="shop-popup-title">Badge Name1</h1>

                            <div className="shop-popup-count-core flex row center">
                                <button className="button shop-popup-min">-</button>
                                <h1 className="shop-popup-count-text">0</h1>
                                <button className="button shop-popup-max">+</button>
                            </div>

                            <div className="shop-popup-info-core flex row">

                                <div className="shop-popup-info-title flex column">
                                    <p className="shop-popup-text-title">Cost</p>
                                    <p className="shop-popup-text-title">Lifetime</p>
                                    <p className="shop-popup-text-title">Daily Rewards</p>
                                    <p className="shop-popup-text-title">TAX Before ROI</p>
                                    <p className="shop-popup-text-title">TAX After ROI</p>
                                </div>

                                <div className="shop-popup-info-desc flex column">
                                    <p className="shop-popup-text-desc">100 $CREST</p>
                                    <p className="shop-popup-text-desc">120 Days</p>
                                    <p className="shop-popup-text-desc">1.2 $CREST</p>
                                    <p className="shop-popup-text-desc">10%</p>
                                    <p className="shop-popup-text-desc">5%</p>
                                </div>

                            </div>

                            <button className="button shop-popup-button">Buy</button>
                            
                        </div>
                        
                    </div>
                )
            }
            </Popup>
        )
    }
}


export default BuyPopup
    