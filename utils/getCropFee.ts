import { cropFeePercent, minCropFee } from './constants';

// Crop fee = cropFeePercent% of price, rounded UP to 1 decimal place,
// floored at minCropFee (so anything below the minimum, incl. 0, charges minCropFee).
export const getCropFee = (price: string | number | undefined): number => {
  const numeric =
    typeof price === 'number' ? price : price ? parseFloat(price.replace('€', '')) : 0;
  const calculated = Math.ceil(((numeric * cropFeePercent) / 100) * 10) / 10;
  return Math.max(calculated, minCropFee);
};
