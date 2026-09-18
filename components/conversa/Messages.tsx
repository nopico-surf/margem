"use client";

import { UserMessage } from "./UserMessage";
import { ResponseLoading } from "./ResponseLoading";
import { ResponseError } from "./ResponseError";
import { ResponseCopy } from "./ResponseCopy";
import type { OrientationResult } from "./types";

type MessagesProps = {
  message: string;
  orientation: OrientationResult | null;
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
};

export function Messages({ message, orientation, isLoading, error, onRetry }: MessagesProps) {
  return (
    <section className="figma-result-messages">
      <UserMessage message={message} />
      {isLoading ? (
        <ResponseLoading />
      ) : error ? (
        <ResponseError error={error} onRetry={onRetry} />
      ) : orientation ? (
        <ResponseCopy orientation={orientation} />
      ) : null}
    </section>
  );
}
