export const generateUUID = () => {
  // eslint-disable-next-line no-bitwise
  let d = new Date().getTime() + performance.now();
  const uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    // eslint-disable-next-line no-bitwise
    const r = (d + Math.random() * 16) % 16 | 0;
    // eslint-disable-next-line no-bitwise
    d = Math.floor(d / 16);
    // eslint-disable-next-line no-bitwise
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
  return uuid;
};
