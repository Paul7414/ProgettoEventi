export const load = async ({ fetch }) => {
  const res = await fetch('http://localhost:3000/eventi');
  const eventi = await res.json();
  console.log(eventi);
  return { eventi };
};