import { Interpolation, Theme } from "@emotion/react";
function createStyles<T extends { [key: string]: Interpolation<Theme> }>(
  arg: T
): T {
  return arg;
}
export { createStyles };
