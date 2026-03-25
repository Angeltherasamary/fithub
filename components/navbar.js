import React from "react";
import styles from "../styles/Home.module.scss";
import Head from "next/head";
import Link from "next/link";
const Navbar = () => {
  return (
    <div>
      <Head>
        <title>Fitness</title>
        <meta
          name="description"
          content="Created for Enhancing Gym Performance"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className={styles.header}>
        <div className={styles.left}>
          <Link href="/" legacyBehavior>
            <a className={styles.logo}>Fitness</a>
          </Link>
        </div>

        <div className={styles.right}>
          <Link href="#" passHref legacyBehavior>
            <a className={styles.cta}>Stay Strong</a>
          </Link>
        </div>
      </header>
    </div>
  );
};

export default Navbar;
