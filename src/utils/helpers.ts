import crypto from 'crypto'

export const hashFileName = (fileName: string) => {
  const extensionPosition = fileName.lastIndexOf(".");
  const extension =
    extensionPosition > -1 ? fileName.slice(extensionPosition) : "";
  return `${crypto.randomBytes(16).toString("hex")}${extension}`;
}
