import { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';

const Year: NextPage = () => {
  const router = useRouter();
  const { year } = router.query;
  return (
    <>
      <Head>
        <title>Events {year} | bestpicture.pro</title>
      </Head>
      {year}
    </>
  );
};

export default Year;
