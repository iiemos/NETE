import { Icon } from "@iconify/react";
import { NavLink } from "react-router-dom";
import logoIcon from "../../assets/images/logo-icon.svg";

export default function FooterSection() {
  return (
    <footer className="footer" role="contentinfo" aria-label="Site footer">
      <div className="container">
        <div className="footer__inner">
          <div className="footer__brand">
            <NavLink className="nav__logo" to="/" aria-label="NETE — Home">
              <span className="nav__logo-mark" aria-hidden="true">
                <img src={logoIcon} alt="" />
              </span>
              NETE
            </NavLink>
            <p>透明、可持续、社区共治的链上时间价值生态。</p>
          </div>

          <nav aria-label="Product links">
            <div className="footer__links-title">Product</div>
            <ul className="footer__links-list" role="list">
              <li>
                <NavLink className="footer__link" to="/mining">
                  矿机
                </NavLink>
              </li>
              <li>
                <NavLink className="footer__link" to="/c2c/market">
                  C2C 市场
                </NavLink>
              </li>
              <li>
                <NavLink className="footer__link" to="/vip">
                  VIP
                </NavLink>
              </li>
              <li>
                <NavLink className="footer__link" to="/">
                  项目介绍
                </NavLink>
              </li>
            </ul>
          </nav>

          <nav aria-label="Developer links">
            <div className="footer__links-title">Developers</div>
            <ul className="footer__links-list" role="list">
              <li>
                <NavLink className="footer__link" to="/my">
                  我的面板
                </NavLink>
              </li>
              <li>
                <NavLink className="footer__link" to="/account/team">
                  团队中心
                </NavLink>
              </li>
              <li>
                <a className="footer__link" href="https://github.com" target="_blank" rel="noopener noreferrer">
                  GitHub
                </a>
              </li>
              <li>
                <NavLink className="footer__link" to="/">
                  Changelog
                </NavLink>
              </li>
            </ul>
          </nav>

          <nav aria-label="Company links">
            <div className="footer__links-title">Company</div>
            <ul className="footer__links-list" role="list">
              <li>
                <NavLink className="footer__link" to="/">
                  首页
                </NavLink>
              </li>
              <li>
                <NavLink className="footer__link" to="/mining">
                  矿机
                </NavLink>
              </li>
              <li>
                <NavLink className="footer__link" to="/c2c">
                  C2C
                </NavLink>
              </li>
              <li>
                <NavLink className="footer__link" to="/account/team">
                  团队
                </NavLink>
              </li>
            </ul>
          </nav>
        </div>


        <div className="footer__bottom">
          <span>© 2024 NETE. All rights reserved.</span>
          <span>Built with ♥ on Ethereum</span>
          <nav aria-label="Legal">
            <NavLink className="footer__link footer__link--inline" to="/">
              Privacy
            </NavLink>
            &nbsp;·&nbsp;
            <NavLink className="footer__link footer__link--inline" to="/">
              Terms
            </NavLink>
          </nav>
        </div>
      </div>
    </footer>
  );
}
