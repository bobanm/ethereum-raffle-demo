import { React } from "react";
import { Image, Icon } from "semantic-ui-react";
import logo from "../assets/images/rocket-engin.png";

const Footer = () => {
    return (
        <footer>
            <div className="contact-links">
                <a href="">
                    <Icon name="world" size="large" link />
                </a>
                <a href="">
                    <Icon name="youtube" size="large" link />
                </a>
                <a href="">
                    <Icon name="facebook" size="large" link />
                </a>
            </div>
            <div className="copy-right">
                <Icon name="copyright outline" />
                Rocket Engin
            </div>
            <div className="logo">
                <Image src={logo} size="tiny" />
            </div>
        </footer>
    );
};

export default Footer;
