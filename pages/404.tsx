import { NextPage } from 'next';
import { Layout } from '../components/Layout';

const NotFound: NextPage = () => {
  return (
    <Layout>
      <h1>Oops.. this page doesn&apos;t exist.</h1>;
    </Layout>
  );
};

export default NotFound;
