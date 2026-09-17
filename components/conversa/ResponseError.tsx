export function ResponseError({ error }: { error: string }) {
  return (
    <div className="figma-response-error" role="alert">
      {error}
    </div>
  );
}
