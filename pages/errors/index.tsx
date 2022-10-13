import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { Layout } from '../../components/Layout';

const WPError: NextPage = () => {
  const router = useRouter();
  const message = router.query.message as string | undefined;

  const regexForStripHTML = /<([^</> ]+)[^<>]*?>[^<>]*?<\/\1> */gi;
  let cleaned = '';
  if (message && message.length) cleaned = message.replaceAll(regexForStripHTML, '');

  return (
    <Layout>
      <h1>Oops.. something went wrong</h1>
      <p>{cleaned}</p>
    </Layout>
  );
};

export default WPError;
