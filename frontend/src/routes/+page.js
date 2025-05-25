
import { API_URL } from '$lib/config';
export const load = async ({ fetch }) => {
  const res = await fetch(`${API_URL}/eventi`);
  const eventi = await res.json();
  console.log(eventi);
  return { eventi };
};