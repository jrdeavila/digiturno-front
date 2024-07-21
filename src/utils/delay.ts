export default async function delay<T>(
  ms: number,
  before: () => void,
  after: () => void,
  fn: () => Promise<T>
): Promise<T> {
  before();
  const result = await new Promise<T>((resolve) => {
    setTimeout(() => {
      resolve(fn());
    }, ms);
  });
  after();
  return result;
}
