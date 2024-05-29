import { format } from "date-fns";

export const formatDateTime = (date) => {
  return format(date, "yyyyMMdd'T'HHmmss");
};
