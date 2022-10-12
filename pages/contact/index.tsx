import { NextPage } from 'next';
import Head from 'next/head';
import styles from '../../styles/Contact.module.css';

const Contact: NextPage = () => {
  const contacts = [
    {
      title: 'WhatSapp',
      link: 'https://wa.me/48516524415',
    },
    {
      title: 'Telegram',
      link: 'https://t.me/vkluchenkov',
    },
    {
      title: 'Email',
      link: 'mailto:vladimir@bestpicture.pro',
    },
    {
      title: 'Facebook',
      link: 'https://facebook.com/vkluchenkov',
    },
  ];

  return (
    <>
      <Head>
        <title>Contact | bestpicture.pro</title>
      </Head>
      <h1 className={styles.title}>Contact me</h1>
      <p className={styles.description}>Click on one of the links below to contact me.</p>
      <div className={styles.contacts}>
        {contacts.map((c, index) => {
          return (
            <a
              className={styles.contact}
              href={c.link}
              rel='noreferrer'
              target='_blank'
              key={'contact' + index}
            >
              {c.title}
            </a>
          );
        })}
      </div>
    </>
  );
};
export default Contact;
