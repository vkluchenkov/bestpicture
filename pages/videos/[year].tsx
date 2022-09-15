import { NextPage } from 'next';
import { useRouter } from 'next/router';

const Year: NextPage = () => {
  const router = useRouter();
  const { year } = router.query;
  return <>{year}</>;
};

export default Year;
