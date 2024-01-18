export const buildLogMessage = (
  message: string,
  reqBody?: string,
  response?: string,
  stack?: string,
): string => {
  const args = [
    { label: 'RequestBody', value: reqBody },
    { label: 'Response', value: response },
    { label: 'Stack', value: stack },
  ];

  return args.reduce((previousValue: string, currentValue) => {
    if (currentValue.value) {
      return `${previousValue}-[${currentValue.label}: ${currentValue.value}]`;
    } else {
      return previousValue;
    }
  }, `[Message: ${message}]`);
};
