import { NextPage } from 'next';
import { useRouter } from 'next/router';

const ThankYou: NextPage = () => {
  const router = useRouter();
  const { orderId, key } = router.query;

  return (
    <>
      Thank you. Your order #{orderId} has been received. You will get an email with all the details
      soon.
    </>
  );
};

export default ThankYou;
