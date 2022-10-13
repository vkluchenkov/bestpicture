import { NextPage } from 'next';
import Head from 'next/head';
import { Layout } from '../../components/Layout';
import styles from '../../styles/Faq.module.css';
import { questions } from '../../utils/faqQuestions';

const Faq: NextPage = () => {
  const renderedQuestions = questions.map((q, index) => {
    return (
      <li className={styles.questionContainer} key={'q' + index}>
        <h2 className={styles.questionTitle}>{q.question}</h2>
        <p className={styles.questionAnswer}>{q.answer}</p>
      </li>
    );
  });

  return (
    <Layout>
      <Head>
        <title>Frequently asked questions | bestpicture.pro</title>
      </Head>
      <h1 className={styles.title}>FAQ</h1>
      <ul className={styles.questions}>{renderedQuestions}</ul>
    </Layout>
  );
};
export default Faq;
