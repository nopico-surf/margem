import { IconeLoader } from "@/components/icons";

export function ResponseLoading() {
  return (
    <div className="figma-response-loading" aria-live="polite">
      <span>Preparando informações...</span>
      <div className="figma-response-loader" aria-hidden="true">
        <IconeLoader className="figma-response-loader-icon figma-response-loader-icon-1" />
        <IconeLoader className="figma-response-loader-icon figma-response-loader-icon-2" />
        <IconeLoader className="figma-response-loader-icon figma-response-loader-icon-3" />
      </div>
    </div>
  );
}
