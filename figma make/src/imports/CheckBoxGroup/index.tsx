import svgPaths from "./svg-c7scc90qoa";
type CheckBoxProps = {
  className?: string;
  property1?: "preenchdio";
};

function CheckBox({ className, property1 = "preenchdio" }: CheckBoxProps) {
  return (
    <div className={className || "relative size-[24px]"}>
      <div className="absolute inset-0 overflow-clip" data-name="check_box">
        <svg className="absolute block inset-0 size-full" fill="none" height="32" preserveAspectRatio="none" viewBox="0 0 32 32" width="32">
          <g id="Vector" />
        </svg>
        <div className="absolute inset-[12.5%]" data-name="Vector">
          <svg className="absolute block inset-0 size-full" fill="none" height="18" preserveAspectRatio="none" viewBox="0 0 18 18" width="18">
            <path d={svgPaths.p3d0d6e00} fill="#055C40" id="Vector" />
          </svg>
        </div>
      </div>
    </div>
  );
}
type CheckBoxGroupProps = {
  className?: string;
  padding?: "Relaxed";
  state?: "Selected";
  text?: string;
  text1?: boolean;
  title?: string;
  title1?: boolean;
};

function CheckBoxGroup({ className, padding = "Relaxed", state = "Selected", text = "Buscar acolhimento multidisciplinar gratuito, como uma unidade do CAPS AD ou uma equipe de saúde de confiança, para estruturar um acompanhamento contínuo e sem cobranças punitivas.", text1 = true, title = "Titulo vai aqui", title1 = true }: CheckBoxGroupProps) {
  return (
    <div className={className || "bg-white relative rounded-[12px] w-[376px]"}>
      <div aria-hidden className="absolute border-[#171b18] border-[0.5px] border-solid inset-[-0.5px] pointer-events-none rounded-[12.5px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[8px] items-center px-[10px] py-[12px] relative size-full">
          <CheckBox className="relative shrink-0 size-[24px]" />
          <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[2px] items-start justify-center min-w-px not-italic relative text-[#171b18]">
            {title1 && <p className="font-['inter:Medium',sans-serif] leading-[16px] relative shrink-0 text-[14px] w-full">{title}</p>}
            {text1 && <p className="font-['inter:Regular',sans-serif] leading-[18px] relative shrink-0 text-[12px] w-full">{text}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckBoxGroup1() {
  return <CheckBoxGroup className="bg-white relative rounded-[12px] size-full" text="Ligar pra CAPS ou UBS mais perto pra saber como funciona" title1={false} />;
}