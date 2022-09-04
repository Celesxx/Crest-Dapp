import 'assets/animation/keyframes.assets.css'
import 'assets/index.assets.css';
import 'assets/global.assets.css';
import 'assets/pages/profile.assets.css'
import React from "react";
import Navbar from "components/blocks/navbar.components.jsx"
import Leftbar from "components/blocks/leftbar.components.jsx"
import Sphere from "assets/img/sphere.svg"

class Dashboard extends React.Component 
{

    render()
    {
        
      return(
        <div className="home p1">

            <Navbar></Navbar>
            <Leftbar></Leftbar>

            <div className="home-body flex column">

                <div className="profile-laderboard flex row">

                    <div className="profile-laderboard-core flex row">

                        <div className="profile-laderboard-cards flex column">
                            <p className="profile-title">My NFT's</p>
                            <div className="profile-score flex row center">0</div>
                        </div>

                        <div className="profile-laderboard-cards flex column">
                            <p className="profile-title">My NFT's</p>
                            <div className="profile-score flex row center">0</div>
                        </div>

                        <div className="profile-laderboard-cards flex column">
                            <p className="profile-title">My NFT's</p>
                            <div className="profile-score flex row center">0</div>
                        </div>

                    </div>

                    <button className="claim-all-button button">Claim selected NFT'S (0/3)</button>

                </div>

                <div className="profile-table-core flex column">
                    
                    <div className="profile-table-heads flex row">
                        <div className="profile-table-radio profile-table-title flex row center">
                            <div className="profile-table-radio-core flex row center">
                                <input type="radio" className="profile-radio-input" id="radio-0" name="radio-all" />
                            </div>
                        </div>
                        <p className="profile-table-title">NFT's</p>
                        <p className="profile-table-title">ID</p>
                        <p className="profile-table-title">Date</p>
                        <p className="profile-table-title">Claim date</p>
                        <p className="profile-table-title">ROI DATE</p>
                        <p className="profile-table-title">Lifetime</p>
                        <p className="profile-table-title">Rewards</p>
                        <p className="profile-table-title"></p>
                    </div>

                    <div className="profile-table-data flex row">
                        <div className="profile-table-radio profile-table-title flex row center">
                            <div className="profile-table-radio-core flex row center">
                                <input type="radio" className="profile-radio-input" id="radio-0" name="radio-all" />
                            </div>
                        </div>
                        <p className="profile-table-desc">Badge1</p>
                        <p className="profile-table-desc">#00000</p>
                        <p className="profile-table-desc">00/00/20xx</p>
                        <p className="profile-table-desc">00/00/20xx</p>
                        <p className="profile-table-desc">00/00/20xx</p>
                        <p className="profile-table-desc">xx:xx:xx</p>
                        <p className="profile-table-desc">xx:xx:xx</p>
                        <div className="profile-table-desc profile-table-button-core flex row center">
                            <button className="button profile-table-button">claim</button>
                        </div>
                    </div>

                    <div className="profile-table-data flex row">
                        <div className="profile-table-radio profile-table-title flex row center">
                            <div className="profile-table-radio-core flex row center">
                                <input type="radio" className="profile-radio-input" id="radio-0" name="radio-all" />
                            </div>
                        </div>
                        <p className="profile-table-desc">Badge1</p>
                        <p className="profile-table-desc">#00000</p>
                        <p className="profile-table-desc">00/00/20xx</p>
                        <p className="profile-table-desc">00/00/20xx</p>
                        <p className="profile-table-desc">00/00/20xx</p>
                        <p className="profile-table-desc">xx:xx:xx</p>
                        <p className="profile-table-desc">xx:xx:xx</p>
                        <div className="profile-table-desc profile-table-button-core flex row center">
                            <button className="button profile-table-button">claim</button>
                        </div>
                    </div>

                    <div className="profile-table-data flex row">
                        <div className="profile-table-radio profile-table-title flex row center">
                            <div className="profile-table-radio-core flex row center">
                                <input type="radio" className="profile-radio-input" id="radio-0" name="radio-all" />
                            </div>
                        </div>
                        <p className="profile-table-desc">Badge1</p>
                        <p className="profile-table-desc">#00000</p>
                        <p className="profile-table-desc">00/00/20xx</p>
                        <p className="profile-table-desc">00/00/20xx</p>
                        <p className="profile-table-desc">00/00/20xx</p>
                        <p className="profile-table-desc">xx:xx:xx</p>
                        <p className="profile-table-desc">xx:xx:xx</p>
                        <div className="profile-table-desc profile-table-button-core flex row center">
                            <button className="button profile-table-button">claim</button>
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
