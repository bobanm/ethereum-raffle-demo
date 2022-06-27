import { React } from "react";
import { Switch, Route } from "react-router-dom";
import "./App.scss";
import RafflePage from "./features/raffle/components/RafflePage";
import PageNotFound from "./features/PageNotFound";
import Footer from "./features/footer/components/Footer";
import Header from "./features/header/components/Header";

const App = () => (
    <div className="layout">
        <Header />
        <main>
            <Switch>
                <Route exact path="/" component={RafflePage} />
                <Route path="*" component={PageNotFound} />
            </Switch>
        </main>
        <Footer />
    </div>
);

export default App;
