import React from "react";
import styles from "./index.less";
import { Link, NavLink } from "umi";
import logo from "@/assets/logo.png";

export default ({ children }) => {
  return (
    <section className={styles.container}>
      <header className={styles.header}>
        <div className={styles.wide}>
          <div className={styles.box}>
            <Link to="/">
              <div className={styles.logo}>
                <span className={styles.text}>
                  <img className={styles.img} src={logo} alt="" />
                  PingOS Player
                </span>
              </div>
            </Link>

            <nav className={styles.nav}>
              <NavLink
                to="/hls/"
                className={styles["nav-link"]}
                activeClassName={styles.active}
              >
                HLS流直播
              </NavLink>
              <NavLink
                to="/hls/test"
                className={styles["nav-link"]}
                activeClassName={styles.active}
              >
                RTMP流直播
              </NavLink>
            </nav>
          </div>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.wide}>{children}</div>
      </main>
    </section>
  );
};
