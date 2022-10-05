import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
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
      // console.log(url + '/#' + arr[arr.length - 1]);
    }
  }, [router, asPath, isReady]);
  return <Loader />;
};

export default Video;
