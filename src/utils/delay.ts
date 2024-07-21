export default function delay<T>(
  ms: number,
  before: () => void,
  after: () => void,
  fn: () => Promise<T>
): Promise<T> {
  before();
  const result = fn();
  setTimeout(after, ms);
  return result;
}
