import { NextPage } from 'next';
import { Layout } from '../components/Layout';

const ServerError: NextPage = () => {
  return (
    <Layout>
      <h1>Oops.. something went wrong.</h1>;
    </Layout>
  );
};

export default ServerError;
