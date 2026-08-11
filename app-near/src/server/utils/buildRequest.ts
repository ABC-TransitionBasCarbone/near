export const buildRequest = <T>(payload: T, signature: string) => ({
  text: async () => JSON.stringify(payload),
  json: async () => payload,
  headers: {
    get: () => signature,
  },
});
