"use client";

import { UserMessage } from "./UserMessage";
import { ResponseLoading } from "./ResponseLoading";
import { ResponseError } from "./ResponseError";
import { ResponseCopy } from "./ResponseCopy";
import type { OrientationResult } from "./types";

type ResultMessagesProps = {
  message: string;
  orientation: OrientationResult | null;
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
};

export function ResultMessages({ message, orientation, isLoading, error, onRetry }: ResultMessagesProps) {
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
