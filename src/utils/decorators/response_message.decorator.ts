import { SetMetadata } from "@nestjs/common";

export const RESPONSE_MESSAGE = "Response message";
export const ResponseMessage = (message: string) => {
  return SetMetadata(RESPONSE_MESSAGE, message);
}