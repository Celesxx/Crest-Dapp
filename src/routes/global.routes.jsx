import { BrowserRouter as Router, Route } from "react-router-dom";
import Index from "components/pages/home.components.jsx";
import DashboardProtocol from "components/pages/dashboard-pe.components.jsx";
import DashboardPersonnal from "components/pages/dashboard-pr.components.jsx";
import Shop from "components/pages/shop.components.jsx";
import Profile from "components/pages/profile.components.jsx";
import Swap from "components/pages/swap.components.jsx";

function BaseRoute()
{
    return(
        <Router>
            <Route path="/" exact component={Index} />
            <Route path="/home" exact component={Index} />
            <Route path="/dashboard" exact component={DashboardProtocol} />
            <Route path="/dashboard/personnal" exact component={DashboardPersonnal} />
            <Route path="/shop" exact component={Shop} />
            <Route path="/profile" exact component={Profile} />
            <Route path="/swap" exact component={Swap} />
        </Router>
    );
}

export default BaseRoute;
