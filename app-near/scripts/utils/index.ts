export const parseArgs = () => {
  const rawArgs = process.argv.slice(2);
  const args: Record<string, string | boolean> = {};

  rawArgs.forEach((arg) => {
    if (arg.includes("=")) {
      const [key, value] = arg.split("=");
      if (key && value !== undefined) args[key] = value;
    }
  });

  return args;
};
