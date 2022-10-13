import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { Layout } from '../../../../components/Layout';
import { Loader } from '../../../../components/Loader';

const Video: NextPage = () => {
  const router = useRouter();
  const { asPath, isReady } = router;

  useEffect(() => {
    if (isReady) {
      const arr = asPath.split('/');
      let url = '';
      arr.forEach((el, index) => {
        if (index == 1) {
          url = url + el;
          return;
        }
        if (index != arr.length - 1) url = url + '/' + el;
      });
      window.open(url + '/#' + arr[arr.length - 1], '_self');
    }
  }, [router, asPath, isReady]);
  return (
    <Layout>
      <Loader />;
    </Layout>
  );
};

export default Video;
