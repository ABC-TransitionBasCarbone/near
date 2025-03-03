// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const buildRequest = (payload: any, signature: string) => ({
  text: async () => JSON.stringify(payload),
  headers: {
    get: () => signature,
  },
});
