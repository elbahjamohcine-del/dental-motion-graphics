// French typography: a non-breaking space before « ? ! : ; » and inside
// guillemets, so punctuation never starts a new line.
export const frenchText = (text: string): string =>
  text
    .replace(/ ([?!:;»])/g, " $1")
    .replace(/« /g, "« ");
