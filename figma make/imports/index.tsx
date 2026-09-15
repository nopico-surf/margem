import svgPaths from "./svg-mlrlrzikdr";
import imgHomemMeiaidadeAmarelo2 from "./4572017b9d29959242e524c747a9601cb824b403.png";
type CheckBoxProps = {
  className?: string;
  property1?: "preenchdio" | "Default";
};

function CheckBox({ className, property1 = "Default" }: CheckBoxProps) {
  return (
    <div className={className || "relative size-[24px]"}>
      {property1 === "preenchdio" && (
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
      )}
      {property1 === "Default" && <div className="absolute border border-[#171b18] border-solid left-[3px] rounded-[3px] size-[18px] top-[3px]" />}
    </div>
  );
}
type CheckBoxGroupProps = {
  className?: string;
  padding?: "Relaxed";
  state?: "Default" | "Selected";
  text?: string;
  text1?: boolean;
  title?: string;
  title1?: boolean;
};

function CheckBoxGroup({ className, padding = "Relaxed", state = "Default", text = "Buscar acolhimento multidisciplinar gratuito, como uma unidade do CAPS AD ou uma equipe de saúde de confiança, para estruturar um acompanhamento contínuo e sem cobranças punitivas.", text1 = true, title = "Titulo vai aqui", title1 = true }: CheckBoxGroupProps) {
  return (
    <div className={className || `relative rounded-[12px] w-[376px] ${state === "Default" && padding === "Relaxed" ? "" : "bg-white"}`}>
      <div aria-hidden className="absolute border-[#171b18] border-[0.5px] border-solid inset-[-0.5px] pointer-events-none rounded-[12.5px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[8px] items-center px-[10px] py-[12px] relative size-full">
          <CheckBox className="relative shrink-0 size-[24px]" property1={state === "Selected" && padding === "Relaxed" ? "preenchdio" : undefined} />
          <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[2px] items-start justify-center min-w-px not-italic relative text-[#171b18]">
            {title1 && <p className="font-['inter:Medium',sans-serif] leading-[16px] relative shrink-0 text-[14px] w-full">{title}</p>}
            {text1 && <p className="font-['inter:Regular',sans-serif] leading-[18px] relative shrink-0 text-[12px] w-full">{text}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

function ButtonSaibaMais({ className }: { className?: string }) {
  return (
    <div className={className || "relative"} data-name="button-saiba-mais">
      <div className="content-stretch flex items-start relative size-full">
        <div className="backdrop-blur-[4px] bg-[#171b18] relative rounded-[999px] shrink-0" data-name="button">
          <div className="flex flex-row items-center justify-center size-full">
            <div className="content-stretch flex items-center justify-center py-[10px] relative size-full">
              <div className="content-stretch flex gap-[6px] items-center justify-center px-[12px] relative shrink-0">
                <p className="[word-break:break-word] font-['inter:Medium',sans-serif] leading-[16px] not-italic relative shrink-0 text-[#055c40] text-[14px] text-center whitespace-nowrap">Saiba mais</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ButtonSite({ className }: { className?: string }) {
  return (
    <div className={className || "relative"} data-name="button-Site">
      <div className="content-stretch flex items-start relative size-full">
        <div className="backdrop-blur-[4px] bg-[#171b18] relative rounded-[999px] shrink-0" data-name="button">
          <div className="flex flex-row items-center justify-center size-full">
            <div className="content-stretch flex items-center justify-center py-[10px] relative size-full">
              <div className="content-stretch flex gap-[6px] items-center justify-center px-[12px] relative shrink-0">
                <div className="overflow-clip relative shrink-0 size-[16px]" data-name="link">
                  <svg className="absolute block inset-0 size-full" fill="none" height="32" preserveAspectRatio="none" viewBox="0 0 32 32" width="32">
                    <g id="Vector" />
                  </svg>
                  <div className="absolute inset-[29.17%_8.33%]" data-name="Vector">
                    <svg className="absolute block inset-0 size-full" fill="none" height="6.66667" preserveAspectRatio="none" viewBox="0 0 13.3333 6.66667" width="13.3333">
                      <path d={svgPaths.p3a38bb00} fill="#055C40" id="Vector" />
                    </svg>
                  </div>
                </div>
                <p className="[word-break:break-word] font-['inter:Medium',sans-serif] leading-[16px] not-italic relative shrink-0 text-[#055c40] text-[14px] text-center whitespace-nowrap">Site</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ButtonGruposPresenciais({ className }: { className?: string }) {
  return (
    <div className={className || "relative"} data-name="button-grupos-presenciais">
      <div className="content-stretch flex items-start relative size-full">
        <div className="backdrop-blur-[4px] bg-[#171b18] relative rounded-[999px] shrink-0" data-name="button">
          <div className="flex flex-row items-center justify-center size-full">
            <div className="content-stretch flex items-center justify-center py-[10px] relative size-full">
              <div className="content-stretch flex gap-[6px] items-center justify-center px-[12px] relative shrink-0">
                <div className="overflow-clip relative shrink-0 size-[16px]" data-name="question_answer">
                  <svg className="absolute block inset-0 size-full" fill="none" height="32" preserveAspectRatio="none" viewBox="0 0 32 32" width="32">
                    <g id="Vector" />
                  </svg>
                  <div className="absolute inset-[8.33%]" data-name="Vector">
                    <svg className="absolute block inset-0 size-full" fill="none" height="13.3333" preserveAspectRatio="none" viewBox="0 0 13.3333 13.3333" width="13.3333">
                      <path d={svgPaths.p295c2900} fill="#055C40" id="Vector" />
                    </svg>
                  </div>
                </div>
                <p className="[word-break:break-word] font-['inter:Medium',sans-serif] leading-[16px] not-italic relative shrink-0 text-[#055c40] text-[14px] text-center whitespace-nowrap">Grupos prsenciais</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ButtonGruposOnline({ className }: { className?: string }) {
  return (
    <div className={className || "relative"} data-name="button-grupos-online">
      <div className="content-stretch flex items-start relative size-full">
        <div className="backdrop-blur-[4px] bg-[#171b18] relative rounded-[999px] shrink-0" data-name="button">
          <div className="flex flex-row items-center justify-center size-full">
            <div className="content-stretch flex items-center justify-center py-[10px] relative size-full">
              <div className="content-stretch flex gap-[6px] items-center justify-center px-[12px] relative shrink-0">
                <div className="overflow-clip relative shrink-0 size-[16px]" data-name="question_answer">
                  <svg className="absolute block inset-0 size-full" fill="none" height="32" preserveAspectRatio="none" viewBox="0 0 32 32" width="32">
                    <g id="Vector" />
                  </svg>
                  <div className="absolute inset-[8.33%]" data-name="Vector">
                    <svg className="absolute block inset-0 size-full" fill="none" height="13.3333" preserveAspectRatio="none" viewBox="0 0 13.3333 13.3333" width="13.3333">
                      <path d={svgPaths.p295c2900} fill="#055C40" id="Vector" />
                    </svg>
                  </div>
                </div>
                <p className="[word-break:break-word] font-['inter:Medium',sans-serif] leading-[16px] not-italic relative shrink-0 text-[#055c40] text-[14px] text-center whitespace-nowrap">Grupos on-line</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ButtonWhatsApp({ className }: { className?: string }) {
  return (
    <div className={className || "relative"} data-name="button-whats-app">
      <div className="content-stretch flex items-start relative size-full">
        <div className="backdrop-blur-[4px] bg-[#171b18] relative rounded-[999px] shrink-0" data-name="button">
          <div className="flex flex-row items-center justify-center size-full">
            <div className="content-stretch flex items-center justify-center py-[10px] relative size-full">
              <div className="content-stretch flex gap-[6px] items-center justify-center px-[12px] relative shrink-0">
                <div className="overflow-clip relative shrink-0 size-[16px]" data-name="zap">
                  <svg className="absolute block inset-0 size-full" fill="none" height="24" preserveAspectRatio="none" viewBox="0 0 24 24" width="24">
                    <g id="Group">
                      <g id="Vector" />
                      <g id="Vector_2" />
                    </g>
                  </svg>
                  <div className="absolute inset-[8.33%]" data-name="Union">
                    <svg className="absolute block inset-0 size-full" fill="none" height="13.3333" preserveAspectRatio="none" viewBox="0 0 13.3333 13.3333" width="13.3333">
                      <g id="Union">
                        <path d={svgPaths.p1303fa00} fill="#055C40" />
                        <path clipRule="evenodd" d={svgPaths.p16ec6100} fill="#055C40" fillRule="evenodd" />
                      </g>
                    </svg>
                  </div>
                </div>
                <p className="[word-break:break-word] font-['inter:Medium',sans-serif] leading-[16px] not-italic relative shrink-0 text-[#055c40] text-[14px] text-center whitespace-nowrap">WhatsApp</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ButtonTelefone({ className }: { className?: string }) {
  return (
    <div className={className || "relative"} data-name="button-telefone">
      <div className="content-stretch flex items-start relative size-full">
        <div className="backdrop-blur-[4px] bg-[#171b18] relative rounded-[999px] shrink-0" data-name="button">
          <div className="flex flex-row items-center justify-center size-full">
            <div className="content-stretch flex items-center justify-center py-[10px] relative size-full">
              <div className="content-stretch flex gap-[6px] items-center justify-center px-[12px] relative shrink-0">
                <div className="overflow-clip relative shrink-0 size-[16px]" data-name="phone">
                  <svg className="absolute block inset-0 size-full" fill="none" height="32" preserveAspectRatio="none" viewBox="0 0 32 32" width="32">
                    <g id="Vector" />
                  </svg>
                  <div className="absolute inset-[12.5%]" data-name="Vector">
                    <svg className="absolute block inset-0 size-full" fill="none" height="12" preserveAspectRatio="none" viewBox="0 0 12 12" width="12">
                      <path d={svgPaths.pa967700} fill="#055C40" id="Vector" />
                    </svg>
                  </div>
                </div>
                <p className="[word-break:break-word] font-['inter:Medium',sans-serif] leading-[16px] not-italic relative shrink-0 text-[#055c40] text-[14px] text-center whitespace-nowrap">Telefone</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ButtonLibras({ className }: { className?: string }) {
  return (
    <div className={className || "relative"} data-name="button-libras">
      <div className="content-stretch flex items-start relative size-full">
        <div className="backdrop-blur-[4px] bg-[#171b18] relative rounded-[999px] shrink-0" data-name="button">
          <div className="flex flex-row items-center justify-center size-full">
            <div className="content-stretch flex items-center justify-center py-[10px] relative size-full">
              <div className="content-stretch flex gap-[6px] items-center justify-center px-[12px] relative shrink-0">
                <div className="overflow-clip relative shrink-0 size-[16px]" data-name="pan_tool">
                  <svg className="absolute block inset-0 size-full" fill="none" height="32" preserveAspectRatio="none" viewBox="0 0 32 32" width="32">
                    <g id="Vector" />
                  </svg>
                  <div className="absolute inset-[0.04%_8.33%_0_5.25%]" data-name="Vector">
                    <svg className="absolute block inset-0 size-full" fill="none" height="15.9933" preserveAspectRatio="none" viewBox="0 0 13.8267 15.9933" width="13.8267">
                      <path d={svgPaths.p1cc39b00} fill="#055C40" id="Vector" />
                    </svg>
                  </div>
                </div>
                <p className="[word-break:break-word] font-['inter:Medium',sans-serif] leading-[16px] not-italic relative shrink-0 text-[#055c40] text-[14px] text-center whitespace-nowrap">Libras</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ButtonTelegram({ className }: { className?: string }) {
  return (
    <div className={className || "relative"} data-name="button-telegram">
      <div className="content-stretch flex items-start relative size-full">
        <div className="backdrop-blur-[4px] bg-[#171b18] relative rounded-[999px] shrink-0" data-name="button">
          <div className="flex flex-row items-center justify-center size-full">
            <div className="content-stretch flex items-center justify-center py-[10px] relative size-full">
              <div className="content-stretch flex gap-[6px] items-center justify-center px-[12px] relative shrink-0">
                <div className="overflow-clip relative shrink-0 size-[16px]" data-name="message_flye">
                  <div className="absolute inset-[8.33%_12.5%_8.33%_4.17%]" data-name="Vector">
                    <svg className="absolute block inset-0 size-full" fill="none" height="13.3333" preserveAspectRatio="none" viewBox="0 0 13.3333 13.3333" width="13.3333">
                      <path d={svgPaths.p375db700} fill="#055C40" id="Vector" />
                    </svg>
                  </div>
                </div>
                <p className="[word-break:break-word] font-['inter:Medium',sans-serif] leading-[16px] not-italic relative shrink-0 text-[#055c40] text-[14px] text-center whitespace-nowrap">Telegram</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ButtonPertoDeMim({ className }: { className?: string }) {
  return (
    <div className={className || "relative"} data-name="button-perto-de-mim">
      <div className="content-stretch flex items-start relative size-full">
        <div className="backdrop-blur-[4px] bg-[#171b18] relative rounded-[999px] shrink-0" data-name="button">
          <div className="flex flex-row items-center justify-center size-full">
            <div className="content-stretch flex items-center justify-center py-[10px] relative size-full">
              <div className="content-stretch flex gap-[6px] items-center justify-center px-[12px] relative shrink-0">
                <div className="overflow-clip relative shrink-0 size-[16px]" data-name="place">
                  <svg className="absolute block inset-0 size-full" fill="none" height="32" preserveAspectRatio="none" viewBox="0 0 32 32" width="32">
                    <g id="Vector" />
                  </svg>
                  <div className="absolute inset-[4.17%_12.5%]" data-name="Vector">
                    <svg className="absolute block inset-0 size-full" fill="none" height="14.6667" preserveAspectRatio="none" viewBox="0 0 12 14.6667" width="12">
                      <path d={svgPaths.p1d6534c0} fill="#055C40" id="Vector" />
                    </svg>
                  </div>
                </div>
                <p className="[word-break:break-word] font-['inter:Medium',sans-serif] leading-[16px] not-italic relative shrink-0 text-[#055c40] text-[14px] text-center whitespace-nowrap">Perto de mim</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ButtonEmail({ className }: { className?: string }) {
  return (
    <div className={className || "relative"} data-name="button-email">
      <div className="content-stretch flex items-start relative size-full">
        <div className="backdrop-blur-[4px] bg-[#171b18] relative rounded-[999px] shrink-0" data-name="button">
          <div className="flex flex-row items-center justify-center size-full">
            <div className="content-stretch flex items-center justify-center py-[10px] relative size-full">
              <div className="content-stretch flex gap-[6px] items-center justify-center px-[12px] relative shrink-0">
                <div className="overflow-clip relative shrink-0 size-[16px]" data-name="email">
                  <svg className="absolute block inset-0 size-full" fill="none" height="32" preserveAspectRatio="none" viewBox="0 0 32 32" width="32">
                    <g id="Vector" />
                  </svg>
                  <div className="absolute inset-[16.67%_8.33%]" data-name="Vector">
                    <svg className="absolute block inset-0 size-full" fill="none" height="10.6667" preserveAspectRatio="none" viewBox="0 0 13.3333 10.6667" width="13.3333">
                      <path d={svgPaths.p25746c00} fill="#055C40" id="Vector" />
                    </svg>
                  </div>
                </div>
                <p className="[word-break:break-word] font-['inter:Medium',sans-serif] leading-[16px] not-italic relative shrink-0 text-[#055c40] text-[14px] text-center whitespace-nowrap">E-mail</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ButtonChat({ className }: { className?: string }) {
  return (
    <div className={className || "relative"} data-name="button-chat">
      <div className="content-stretch flex items-start relative size-full">
        <div className="backdrop-blur-[4px] bg-[#171b18] relative rounded-[999px] shrink-0" data-name="button">
          <div className="flex flex-row items-center justify-center size-full">
            <div className="content-stretch flex items-center justify-center py-[10px] relative size-full">
              <div className="content-stretch flex gap-[6px] items-center justify-center px-[12px] relative shrink-0">
                <div className="overflow-clip relative shrink-0 size-[16px]" data-name="question_answer">
                  <svg className="absolute block inset-0 size-full" fill="none" height="32" preserveAspectRatio="none" viewBox="0 0 32 32" width="32">
                    <g id="Vector" />
                  </svg>
                  <div className="absolute inset-[8.33%]" data-name="Vector">
                    <svg className="absolute block inset-0 size-full" fill="none" height="13.3333" preserveAspectRatio="none" viewBox="0 0 13.3333 13.3333" width="13.3333">
                      <path d={svgPaths.p295c2900} fill="#055C40" id="Vector" />
                    </svg>
                  </div>
                </div>
                <p className="[word-break:break-word] font-['inter:Medium',sans-serif] leading-[16px] not-italic relative shrink-0 text-[#055c40] text-[14px] text-center whitespace-nowrap">Chat</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Avatar({ className }: { className?: string }) {
  return (
    <div className={className || "relative rounded-[4px] size-[92px]"} data-name="Avatar">
      <div className="flex flex-col items-center justify-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col items-center justify-center relative size-full">
          <div className="flex flex-[1_0_0] items-center justify-center min-h-px relative w-full">
            <div className="-scale-y-100 flex-none rotate-180 size-full">
              <div className="relative size-full" data-name="homem-meiaidade-amarelo 2">
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  <img alt="" className="absolute h-full left-[-43.48%] max-w-none top-0 w-[183.2%]" src={imgHomemMeiaidadeAmarelo2} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Subtitle({ className }: { className?: string }) {
  return (
    <div className={className || "relative w-[328px]"} data-name="Subtitle">
      <div className="flex flex-col items-center justify-center size-full">
        <div className="content-stretch flex flex-col items-center justify-center relative size-full">
          <div className="[text-box-edge:cap_alphabetic] [text-box-trim:trim-both] [word-break:break-word] font-['inter:Regular',sans-serif] leading-[0] not-italic relative shrink-0 text-[#171b18] text-[16px] w-full whitespace-pre-wrap">
            <p className="leading-[24px] mb-0">Segurar esse peso por 15 anos, enfrentando ciclos sucessivos de ir e voltar, cansa profundamente o corpo e a mente. Quero que você saiba, antes de qualquer coisa, que essa exaustão é totalmente compreensível e que você não está sozinho nessa conversa; estamos aqui para construir caminhos com você, sem julgamentos e respeitando o seu ritmo.</p>
            <p className="leading-[24px] mb-0">​</p>
            <p className="leading-[24px] mb-0">Esse movimento de retorno frequente traz um desgaste acumulado significativo: o sistema cardiovascular sente a sobrecarga contínua da estimulação, o sono e a nutrição perdem a regularidade, e o psicológico passa por oscilações severas entre momentos de aceleração e períodos de profunda tristeza e fadiga. O fato de você reconhecer esse limite e procurar apoio hoje demonstra uma clareza e uma coragem essenciais para começar a mudar esse cenário.</p>
            <p className="leading-[24px] mb-0">​</p>
            <p className="leading-[24px] mb-0">Durante muito tempo fizeram você acreditar que esse ciclo é uma simples falta de vontade ou falha pessoal, mas a realidade é bem mais ampla. Vivemos sob exigências que drenam a nossa energia, em uma organização social que mercantiliza o alívio, isola as pessoas e oferece pouquíssimo suporte comunitário e estrutural. Você não é responsável pelas pressões e contradições desse sistema, mas preserva a sua capacidade de decisão sobre como se proteger e agir dentro dele.</p>
            <p className="leading-[24px] mb-0">​</p>
            <p className="leading-[24px] mb-0">Na maioria das vezes, a substância surge como uma tentativa de solução imediata: uma anestesia rápida para um cotidiano opressor, uma dor que não cala, uma solidão pesada ou até uma necessidade de sustentar um ritmo exaustivo. Por isso, mais do que focar unicamente na interrupção, vale a pena olhar com cuidado: o que a cocaína tem resolvido ou aliviado temporariamente para você quando a busca acontece? Entender a função desse uso permite desenhar alternativas que não dependem de um tudo-ou-nada.</p>
            <p className="leading-[24px] mb-0">​</p>
            <p className="leading-[24px] mb-0">Se a parada total for a sua escolha, ela é plenamente viável; se o momento pedir primeiro a redução de danos — ampliando intervalos, minimizando riscos físicos e recuperando o controle do seu cotidiano —, esse já é um passo legítimo e transformador.</p>
            <p className="leading-[24px] mb-0">​</p>
            <p className="leading-[24px]">Reencontrar o próprio equilíbrio é também um ato de reconciliação com a sua essência. Ter paciência consigo e acolher a sua caminhada sem a carga da culpa permite lembrar que você não se resume aos momentos de recaída, e que existe um propósito de vida digno esperando para ser redescoberto no seu tempo.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Frame2() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
      <div className="h-[12px] relative shrink-0 w-[86.756px]" data-name="Logo">
        <svg className="absolute block inset-0 size-full" fill="none" height="12" preserveAspectRatio="none" viewBox="0 0 86.7563 12" width="86.7563">
          <g id="Vector">
            <path d={svgPaths.pd780} fill="#171B18" />
            <path d={svgPaths.p9508800} fill="#171B18" />
            <path d={svgPaths.p685a680} fill="#171B18" />
            <path clipRule="evenodd" d={svgPaths.p34f96a80} fill="#171B18" fillRule="evenodd" />
            <path clipRule="evenodd" d={svgPaths.p2ca98600} fill="#171B18" fillRule="evenodd" />
            <path d={svgPaths.p3f035900} fill="#171B18" />
            <path d={svgPaths.p37b6cd00} fill="#171B18" />
          </g>
        </svg>
      </div>
      <div className="overflow-clip relative shrink-0 size-[24px]" data-name="menu">
        <svg className="absolute block inset-0 size-full" fill="none" height="32" preserveAspectRatio="none" viewBox="0 0 32 32" width="32">
          <g id="Vector" />
        </svg>
        <div className="absolute bottom-1/4 left-[12.5%] right-[12.5%] top-1/4" data-name="Vector">
          <svg className="absolute block inset-0 size-full" fill="none" height="12" preserveAspectRatio="none" viewBox="0 0 18 12" width="18">
            <path d={svgPaths.pc6e96c0} fill="#171B18" id="Vector" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function UserMessage() {
  return (
    <div className="content-stretch flex flex-col items-end justify-center pl-[32px] relative shrink-0 w-full" data-name="User message">
      <div className="bg-[#cdefdf] relative rounded-bl-[16px] rounded-br-[16px] rounded-tl-[16px] rounded-tr-[4px] shrink-0 w-full" data-name="User message">
        <div className="flex flex-row items-end overflow-clip rounded-[inherit] size-full">
          <div className="content-stretch flex items-end px-[16px] py-[12px] relative size-full">
            <p className="[word-break:break-word] flex-[1_0_0] font-['inter:Regular',sans-serif] leading-[20px] min-w-px not-italic relative text-[#171b18] text-[14px]">Estou usando cocaína fazem 15 anos, fico indo e voltando e não sei mais o que fazer, help!</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Frame() {
  return (
    <div className="content-stretch flex gap-[6px] items-center justify-center px-[12px] relative shrink-0">
      <p className="[word-break:break-word] font-['inter:Medium',sans-serif] leading-[16px] not-italic relative shrink-0 text-[#055c40] text-[14px] text-center whitespace-nowrap">Profissionais que podem ajudar</p>
      <div className="overflow-clip relative shrink-0 size-[16px]" data-name="double_arrow_down">
        <svg className="absolute block inset-0 size-full" fill="none" height="32" preserveAspectRatio="none" viewBox="0 0 32 32" width="32">
          <g id="Vector" />
        </svg>
        <div className="-translate-y-1/2 absolute aspect-[12/15] left-1/4 right-1/4 top-[calc(50%+0.5px)]" data-name="Vector">
          <svg className="absolute block inset-0 size-full" fill="none" height="10" preserveAspectRatio="none" viewBox="0 0 8 10" width="8">
            <path d={svgPaths.p22dc7700} fill="#055C40" id="Vector" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Frame1() {
  return (
    <div className="content-stretch flex gap-[6px] items-center justify-center px-[12px] relative shrink-0">
      <p className="[word-break:break-word] font-['inter:Medium',sans-serif] leading-[16px] not-italic relative shrink-0 text-[#055c40] text-[14px] text-center whitespace-nowrap">Serviços publicos</p>
      <div className="overflow-clip relative shrink-0 size-[16px]" data-name="double_arrow_down">
        <svg className="absolute block inset-0 size-full" fill="none" height="32" preserveAspectRatio="none" viewBox="0 0 32 32" width="32">
          <g id="Vector" />
        </svg>
        <div className="-translate-y-1/2 absolute aspect-[12/15] left-1/4 right-1/4 top-[calc(50%+0.5px)]" data-name="Vector">
          <svg className="absolute block inset-0 size-full" fill="none" height="10" preserveAspectRatio="none" viewBox="0 0 8 10" width="8">
            <path d={svgPaths.p22dc7700} fill="#055C40" id="Vector" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Frame3() {
  return (
    <div className="content-stretch flex gap-[6px] items-center justify-center px-[12px] relative shrink-0">
      <p className="[word-break:break-word] font-['inter:Medium',sans-serif] leading-[16px] not-italic relative shrink-0 text-[#055c40] text-[14px] text-center whitespace-nowrap">Espaços de apoio e escuta</p>
      <div className="overflow-clip relative shrink-0 size-[16px]" data-name="double_arrow_down">
        <svg className="absolute block inset-0 size-full" fill="none" height="32" preserveAspectRatio="none" viewBox="0 0 32 32" width="32">
          <g id="Vector" />
        </svg>
        <div className="-translate-y-1/2 absolute aspect-[12/15] left-1/4 right-1/4 top-[calc(50%+0.5px)]" data-name="Vector">
          <svg className="absolute block inset-0 size-full" fill="none" height="10" preserveAspectRatio="none" viewBox="0 0 8 10" width="8">
            <path d={svgPaths.p22dc7700} fill="#055C40" id="Vector" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Frame4() {
  return (
    <div className="content-stretch flex gap-[6px] items-center justify-center px-[12px] relative shrink-0">
      <p className="[word-break:break-word] font-['inter:Medium',sans-serif] leading-[16px] not-italic relative shrink-0 text-[#055c40] text-[14px] text-center whitespace-nowrap">Passos reais, para fazer agora</p>
      <div className="overflow-clip relative shrink-0 size-[16px]" data-name="double_arrow_down">
        <svg className="absolute block inset-0 size-full" fill="none" height="32" preserveAspectRatio="none" viewBox="0 0 32 32" width="32">
          <g id="Vector" />
        </svg>
        <div className="-translate-y-1/2 absolute aspect-[12/15] left-1/4 right-1/4 top-[calc(50%+0.5px)]" data-name="Vector">
          <svg className="absolute block inset-0 size-full" fill="none" height="10" preserveAspectRatio="none" viewBox="0 0 8 10" width="8">
            <path d={svgPaths.p22dc7700} fill="#055C40" id="Vector" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Frame5() {
  return (
    <div className="content-stretch flex gap-[6px] items-center justify-center px-[12px] relative shrink-0">
      <p className="[word-break:break-word] font-['inter:Medium',sans-serif] leading-[16px] not-italic relative shrink-0 text-[#055c40] text-[14px] text-center whitespace-nowrap">Para planejar</p>
      <div className="overflow-clip relative shrink-0 size-[16px]" data-name="double_arrow_down">
        <svg className="absolute block inset-0 size-full" fill="none" height="32" preserveAspectRatio="none" viewBox="0 0 32 32" width="32">
          <g id="Vector" />
        </svg>
        <div className="-translate-y-1/2 absolute aspect-[12/15] left-1/4 right-1/4 top-[calc(50%+0.5px)]" data-name="Vector">
          <svg className="absolute block inset-0 size-full" fill="none" height="10" preserveAspectRatio="none" viewBox="0 0 8 10" width="8">
            <path d={svgPaths.p22dc7700} fill="#055C40" id="Vector" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Frame30() {
  return (
    <div className="content-stretch flex flex-col gap-[14px] items-start relative shrink-0 w-full">
      <div className="backdrop-blur-[4px] bg-[#171b18] relative rounded-[999px] shrink-0" data-name="button">
        <div className="flex flex-row items-center justify-center size-full">
          <div className="content-stretch flex items-center justify-center py-[10px] relative size-full">
            <Frame />
          </div>
        </div>
      </div>
      <div className="backdrop-blur-[4px] bg-[#171b18] relative rounded-[999px] shrink-0" data-name="button">
        <div className="flex flex-row items-center justify-center size-full">
          <div className="content-stretch flex items-center justify-center py-[10px] relative size-full">
            <Frame1 />
          </div>
        </div>
      </div>
      <div className="backdrop-blur-[4px] bg-[#171b18] relative rounded-[999px] shrink-0" data-name="button">
        <div className="flex flex-row items-center justify-center size-full">
          <div className="content-stretch flex items-center justify-center py-[10px] relative size-full">
            <Frame3 />
          </div>
        </div>
      </div>
      <div className="backdrop-blur-[4px] bg-[#171b18] relative rounded-[999px] shrink-0" data-name="button">
        <div className="flex flex-row items-center justify-center size-full">
          <div className="content-stretch flex items-center justify-center py-[10px] relative size-full">
            <Frame4 />
          </div>
        </div>
      </div>
      <div className="backdrop-blur-[4px] bg-[#171b18] relative rounded-[999px] shrink-0" data-name="button">
        <div className="flex flex-row items-center justify-center size-full">
          <div className="content-stretch flex items-center justify-center py-[10px] relative size-full">
            <Frame5 />
          </div>
        </div>
      </div>
    </div>
  );
}

function Frame12() {
  return (
    <div className="content-stretch flex flex-col gap-[40px] items-start pb-[24px] pt-[20px] px-[16px] relative shrink-0 w-full">
      <div className="relative shrink-0 w-full" data-name="Messages">
        <div className="content-stretch flex flex-col gap-[24px] items-start relative size-full">
          <UserMessage />
          <Subtitle className="relative shrink-0 w-full" />
        </div>
      </div>
      <div className="relative shrink-0 w-[328px]" data-name="Além disso você pode ver">
        <div className="flex flex-col justify-center size-full">
          <div className="content-stretch flex flex-col gap-[20px] items-start justify-center relative size-full">
            <p className="[text-box-edge:cap_alphabetic] [text-box-trim:trim-both] [word-break:break-word] font-['urbanist:SemiBold',sans-serif] leading-[24px] not-italic relative shrink-0 text-[#171b18] text-[18px] text-center whitespace-nowrap">Além disso, você pode ver</p>
            <Frame30 />
          </div>
        </div>
      </div>
    </div>
  );
}

function Content() {
  return (
    <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[10px] items-start min-w-px not-italic relative text-[#171b18]" data-name="Content">
      <p className="[text-box-edge:cap_alphabetic] [text-box-trim:trim-both] font-['urbanist:SemiBold',sans-serif] leading-[24px] overflow-hidden relative shrink-0 text-[18px] text-ellipsis w-full whitespace-nowrap">Profissionais que podem ajudar</p>
      <p className="font-['inter:Regular',sans-serif] leading-[20px] overflow-hidden relative shrink-0 text-[14px] text-ellipsis w-full">É recomendado falar com psiquiatra e psicólogo. Você pode fazer isso pelo SUS, sem custo. Para atendimento online, você pode falar com um de nossos parceiros.</p>
    </div>
  );
}

function Frame16() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[16px] items-center min-w-px relative">
      <Content />
    </div>
  );
}

function Frame6() {
  return (
    <div className="content-stretch flex gap-[4px] items-center justify-center px-[10px] relative shrink-0">
      <p className="[word-break:break-word] font-['inter:Medium',sans-serif] leading-[16px] not-italic relative shrink-0 text-[12px] text-center text-white whitespace-nowrap">Psicologos</p>
    </div>
  );
}

function Frame7() {
  return (
    <div className="content-stretch flex gap-[4px] items-center justify-center px-[10px] relative shrink-0">
      <p className="[word-break:break-word] font-['inter:Medium',sans-serif] leading-[16px] not-italic relative shrink-0 text-[#055c40] text-[12px] text-center whitespace-nowrap">Psiquiatras</p>
    </div>
  );
}

function Frame26() {
  return (
    <div className="content-stretch flex gap-[6px] h-[28px] items-start relative shrink-0 w-full">
      <div className="relative shrink-0" data-name="button">
        <div className="content-stretch flex items-start relative size-full">
          <div className="bg-[#055c40] relative rounded-[999px] shrink-0" data-name="button">
            <div className="flex flex-row items-center justify-center size-full">
              <div className="content-stretch flex items-center justify-center py-[6px] relative size-full">
                <Frame6 />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="relative shrink-0" data-name="button">
        <div className="content-stretch flex items-start relative size-full">
          <div className="backdrop-blur-[4px] bg-[#171b18] relative rounded-[999px] shrink-0" data-name="button">
            <div className="flex flex-row items-center justify-center size-full">
              <div className="content-stretch flex items-center justify-center py-[6px] relative size-full">
                <Frame7 />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Frame25() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-full">
      <p className="[word-break:break-word] flex-[1_0_0] font-['inter:Medium',sans-serif] leading-[16px] min-w-px not-italic overflow-hidden relative text-[#171b18] text-[14px] text-ellipsis">Amanda Fernande de Bezerra</p>
    </div>
  );
}

function Frame21() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
      <p className="[word-break:break-word] font-['inter:Medium',sans-serif] leading-[16px] not-italic relative shrink-0 text-[#171b18] text-[12px] whitespace-nowrap">Psicologia</p>
    </div>
  );
}

function Frame14() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
      <Frame21 />
    </div>
  );
}

function Frame28() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full">
      <Frame25 />
      <Frame14 />
    </div>
  );
}

function Frame22() {
  return (
    <div className="[word-break:break-word] content-stretch flex flex-col font-['inter:Regular',sans-serif] items-start leading-[14px] not-italic relative shrink-0 text-[#171b18] text-[10px] w-full">
      <p className="relative shrink-0 w-full">CRP: 00/00000</p>
      <p className="overflow-hidden relative shrink-0 text-ellipsis w-full whitespace-nowrap">11 anos de experiência</p>
    </div>
  );
}

function Frame13() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[6px] items-start justify-center min-w-px relative">
      <Frame28 />
      <Frame22 />
    </div>
  );
}

function Frame27() {
  return (
    <div className="content-stretch flex items-center pt-[2px] relative shrink-0">
      <div className="overflow-clip relative shrink-0 size-[16px]" data-name="info">
        <svg className="absolute block inset-0 size-full" fill="none" height="32" preserveAspectRatio="none" viewBox="0 0 32 32" width="32">
          <g id="Vector" />
        </svg>
        <div className="absolute inset-[8.33%]" data-name="Vector">
          <svg className="absolute block inset-0 size-full" fill="none" height="13.3333" preserveAspectRatio="none" viewBox="0 0 13.3333 13.3333" width="13.3333">
            <path d={svgPaths.p32f50700} fill="#171B18" fillOpacity="0.64" id="Vector" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Frame15() {
  return (
    <div className="content-stretch flex gap-[12px] items-center relative shrink-0 w-full">
      <Avatar className="relative rounded-[4px] shrink-0 size-[92px]" />
      <Frame13 />
      <Frame27 />
    </div>
  );
}

function Frame17() {
  return (
    <div className="content-start flex flex-wrap gap-[6px] items-start relative shrink-0">
      <div className="backdrop-blur-[4px] bg-[#171b18] relative rounded-[999px] shrink-0" data-name="badge">
        <div className="flex flex-row items-center size-full">
          <div className="content-stretch flex gap-[4px] items-center px-[8px] py-[4px] relative size-full">
            <p className="[word-break:break-word] font-['inter:Medium',sans-serif] leading-[16px] not-italic overflow-hidden relative shrink-0 text-[#171b18] text-[12px] text-ellipsis whitespace-nowrap">Recaídas</p>
          </div>
        </div>
      </div>
      <div className="backdrop-blur-[4px] bg-[#171b18] relative rounded-[999px] shrink-0" data-name="badge">
        <div className="flex flex-row items-center size-full">
          <div className="content-stretch flex gap-[4px] items-center px-[8px] py-[4px] relative size-full">
            <p className="[word-break:break-word] font-['inter:Medium',sans-serif] leading-[16px] not-italic overflow-hidden relative shrink-0 text-[#171b18] text-[12px] text-ellipsis whitespace-nowrap">Redução de danos</p>
          </div>
        </div>
      </div>
      <div className="backdrop-blur-[4px] bg-[#171b18] relative rounded-[999px] shrink-0" data-name="badge">
        <div className="flex flex-row items-center size-full">
          <div className="content-stretch flex gap-[4px] items-center px-[8px] py-[4px] relative size-full">
            <p className="[word-break:break-word] font-['inter:Medium',sans-serif] leading-[16px] not-italic overflow-hidden relative shrink-0 text-[#171b18] text-[12px] text-ellipsis whitespace-nowrap">Abstinência</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Frame8() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[6px] items-center justify-center min-w-px px-[12px] relative">
      <div className="overflow-clip relative shrink-0 size-[16px]" data-name="what_sapp">
        <div className="absolute inset-[8.33%]" data-name="Union">
          <svg className="absolute block inset-0 size-full" fill="none" height="13.3333" preserveAspectRatio="none" viewBox="0 0 13.3333 13.3333" width="13.3333">
            <g id="Union">
              <path d={svgPaths.p1303fa00} fill="white" />
              <path clipRule="evenodd" d={svgPaths.p16ec6100} fill="white" fillRule="evenodd" />
            </g>
          </svg>
        </div>
      </div>
      <p className="[word-break:break-word] font-['inter:Medium',sans-serif] leading-[16px] not-italic relative shrink-0 text-[14px] text-center text-white whitespace-nowrap">Agendar por WhasApp</p>
    </div>
  );
}

function Frame9() {
  return (
    <div className="content-stretch flex gap-[6px] items-center justify-center px-[12px] relative shrink-0">
      <p className="[word-break:break-word] font-['inter:Medium',sans-serif] leading-[16px] not-italic relative shrink-0 text-[#055c40] text-[14px] text-center whitespace-nowrap">Se preferir, veja os serviços públicos</p>
      <div className="overflow-clip relative shrink-0 size-[16px]" data-name="double_arrow_down">
        <svg className="absolute block inset-0 size-full" fill="none" height="32" preserveAspectRatio="none" viewBox="0 0 32 32" width="32">
          <g id="Vector" />
        </svg>
        <div className="-translate-y-1/2 absolute aspect-[12/15] left-1/4 right-1/4 top-[calc(50%+0.5px)]" data-name="Vector">
          <svg className="absolute block inset-0 size-full" fill="none" height="10" preserveAspectRatio="none" viewBox="0 0 8 10" width="8">
            <path d={svgPaths.p22dc7700} fill="#055C40" id="Vector" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Content1() {
  return (
    <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[10px] items-start min-w-px not-italic relative text-[#171b18]" data-name="Content">
      <p className="[text-box-edge:cap_alphabetic] [text-box-trim:trim-both] font-['urbanist:SemiBold',sans-serif] leading-[24px] overflow-hidden relative shrink-0 text-[18px] text-ellipsis w-full whitespace-nowrap">Serviços públicos</p>
      <p className="font-['inter:Regular',sans-serif] leading-[20px] overflow-hidden relative shrink-0 text-[14px] text-ellipsis w-full">Acolhimento, saúde e assistência pública para cuidar e apoiar pessoas em uso de substâncias e familiares</p>
    </div>
  );
}

function Frame18() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[16px] items-center min-w-px relative">
      <Content1 />
    </div>
  );
}

function Content2() {
  return (
    <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[8px] items-start min-w-px not-italic relative text-[#171b18]" data-name="Content">
      <p className="[text-box-edge:cap_alphabetic] [text-box-trim:trim-both] font-['urbanist:SemiBold',sans-serif] leading-[20px] overflow-hidden relative shrink-0 text-[16px] text-ellipsis w-full whitespace-nowrap">188 • CVV • Centro de Valorização da Vida</p>
      <p className="font-['inter:Regular',sans-serif] leading-[18px] overflow-hidden relative shrink-0 text-[12px] text-ellipsis w-full">Serviço de apoio emocional, escuta e prevenção do suicídio. O atendimento pode ser feito por telefone, chat ou e-mail, de forma gratuita e sigilosa</p>
    </div>
  );
}

function Frame19() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[16px] items-center min-w-px relative">
      <Content2 />
    </div>
  );
}

function Content3() {
  return (
    <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[8px] items-start min-w-px not-italic relative text-[#171b18]" data-name="Content">
      <p className="[text-box-edge:cap_alphabetic] [text-box-trim:trim-both] font-['urbanist:SemiBold',sans-serif] leading-[20px] overflow-hidden relative shrink-0 text-[16px] text-ellipsis w-full whitespace-nowrap">CAPS AD • Centro de Atenção Psicossocial (Álcool e Outras Drogas)</p>
      <p className="font-['inter:Regular',sans-serif] leading-[18px] overflow-hidden relative shrink-0 text-[12px] text-ellipsis w-full">Serviço público do SUS que oferece atendimento especializado com equipe multidisciplinar para acolhimento, cuidado e apoio no uso de substâncias</p>
    </div>
  );
}

function Frame20() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[16px] items-center min-w-px relative">
      <Content3 />
    </div>
  );
}

function Content4() {
  return (
    <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[8px] items-start min-w-px not-italic relative text-[#171b18]" data-name="Content">
      <p className="[text-box-edge:cap_alphabetic] [text-box-trim:trim-both] font-['urbanist:SemiBold',sans-serif] leading-[20px] overflow-hidden relative shrink-0 text-[16px] text-ellipsis w-full whitespace-nowrap">Disque 100 • Disque Direitos Humanos</p>
      <p className="font-['inter:Regular',sans-serif] leading-[18px] overflow-hidden relative shrink-0 text-[12px] text-ellipsis w-full">Canal anônimo de denúncia e proteção aos direitos humanos, acolhendo crianças, idosos, populações vulneráveis e pessoas em situação de violência</p>
    </div>
  );
}

function Frame23() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[16px] items-center min-w-px relative">
      <Content4 />
    </div>
  );
}

function Frame29() {
  return (
    <div className="content-stretch flex flex-col gap-px items-start relative shrink-0 w-full">
      <div className="relative shrink-0 w-full" data-name="Component 2">
        <div className="content-stretch flex flex-col items-start relative size-full">
          <div className="bg-white relative shrink-0 w-full" data-name="card background">
            <div className="content-stretch flex flex-col items-start px-[16px] py-[24px] relative size-full">
              <div className="relative shrink-0 w-full" data-name="Property 1=Default">
                <div className="content-stretch flex flex-col items-start relative size-full">
                  <div className="relative shrink-0 w-full" data-name="card-base">
                    <div className="content-stretch flex flex-col gap-[24px] items-start relative size-full">
                      <div className="relative shrink-0 w-full" data-name="card_header">
                        <div className="flex flex-row items-center size-full">
                          <div className="content-stretch flex gap-[8px] items-center relative size-full">
                            <Frame19 />
                            <div className="overflow-clip relative shrink-0 size-[16px]" data-name="info">
                              <svg className="absolute block inset-0 size-full" fill="none" height="32" preserveAspectRatio="none" viewBox="0 0 32 32" width="32">
                                <g id="Vector" />
                              </svg>
                              <div className="absolute inset-[8.33%]" data-name="Vector">
                                <svg className="absolute block inset-0 size-full" fill="none" height="13.3333" preserveAspectRatio="none" viewBox="0 0 13.3333 13.3333" width="13.3333">
                                  <path d={svgPaths.p32f50700} fill="#171B18" fillOpacity="0.64" id="Vector" />
                                </svg>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="relative shrink-0" data-name="button group">
                        <div className="content-stretch flex gap-[8px] items-start relative size-full">
                          <ButtonTelefone className="relative shrink-0" />
                          <ButtonChat className="relative shrink-0" />
                          <ButtonEmail className="relative shrink-0" />
                          <ButtonPertoDeMim className="relative shrink-0" />
                          <ButtonSite className="relative shrink-0" />
                          <ButtonSaibaMais className="relative shrink-0" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="relative shrink-0 w-full" data-name="Component 3">
        <div className="content-stretch flex flex-col items-start relative size-full">
          <div className="bg-white relative shrink-0 w-full" data-name="card background">
            <div className="content-stretch flex flex-col items-start px-[16px] py-[24px] relative size-full">
              <div className="relative shrink-0 w-full" data-name="Property 1=Default">
                <div className="content-stretch flex flex-col items-start relative size-full">
                  <div className="relative shrink-0 w-full" data-name="_caps-ad">
                    <div className="content-stretch flex flex-col gap-[24px] items-start relative size-full">
                      <div className="relative shrink-0 w-full" data-name="card_header">
                        <div className="flex flex-row items-center size-full">
                          <div className="content-stretch flex gap-[8px] items-center relative size-full">
                            <Frame20 />
                            <div className="overflow-clip relative shrink-0 size-[16px]" data-name="info">
                              <svg className="absolute block inset-0 size-full" fill="none" height="32" preserveAspectRatio="none" viewBox="0 0 32 32" width="32">
                                <g id="Vector" />
                              </svg>
                              <div className="absolute inset-[8.33%]" data-name="Vector">
                                <svg className="absolute block inset-0 size-full" fill="none" height="13.3333" preserveAspectRatio="none" viewBox="0 0 13.3333 13.3333" width="13.3333">
                                  <path d={svgPaths.p32f50700} fill="#171B18" fillOpacity="0.64" id="Vector" />
                                </svg>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="relative shrink-0" data-name="button group">
                        <div className="content-stretch flex gap-[8px] items-start relative size-full">
                          <ButtonTelefone className="relative shrink-0" />
                          <ButtonPertoDeMim className="relative shrink-0" />
                          <ButtonSaibaMais className="relative shrink-0" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="relative shrink-0 w-full" data-name="Component 4">
        <div className="content-stretch flex flex-col items-start relative size-full">
          <div className="bg-white relative shrink-0 w-full" data-name="card background">
            <div className="content-stretch flex flex-col items-start px-[16px] py-[24px] relative size-full">
              <div className="relative shrink-0 w-full" data-name="Property 1=Default">
                <div className="content-stretch flex flex-col items-start relative size-full">
                  <div className="relative shrink-0 w-full" data-name="_direitos-humanos">
                    <div className="content-stretch flex flex-col gap-[24px] items-start relative size-full">
                      <div className="relative shrink-0 w-full" data-name="card_header">
                        <div className="flex flex-row items-center size-full">
                          <div className="content-stretch flex gap-[8px] items-center relative size-full">
                            <Frame23 />
                            <div className="overflow-clip relative shrink-0 size-[16px]" data-name="info">
                              <svg className="absolute block inset-0 size-full" fill="none" height="32" preserveAspectRatio="none" viewBox="0 0 32 32" width="32">
                                <g id="Vector" />
                              </svg>
                              <div className="absolute inset-[8.33%]" data-name="Vector">
                                <svg className="absolute block inset-0 size-full" fill="none" height="13.3333" preserveAspectRatio="none" viewBox="0 0 13.3333 13.3333" width="13.3333">
                                  <path d={svgPaths.p32f50700} fill="#171B18" fillOpacity="0.64" id="Vector" />
                                </svg>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="relative shrink-0" data-name="button group">
                        <div className="content-stretch flex gap-[8px] items-start relative size-full">
                          <ButtonTelefone className="relative shrink-0" />
                          <ButtonWhatsApp className="relative shrink-0" />
                          <ButtonTelegram className="relative shrink-0" />
                          <ButtonLibras className="relative shrink-0" />
                          <ButtonSite className="relative shrink-0" />
                          <ButtonSaibaMais className="relative shrink-0" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Content5() {
  return (
    <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[10px] items-start min-w-px not-italic relative text-[#171b18]" data-name="Content">
      <p className="[text-box-edge:cap_alphabetic] [text-box-trim:trim-both] font-['urbanist:SemiBold',sans-serif] leading-[24px] overflow-hidden relative shrink-0 text-[18px] text-ellipsis w-full whitespace-nowrap">Espaços de apoio e escuta</p>
      <p className="font-['inter:Regular',sans-serif] leading-[20px] overflow-hidden relative shrink-0 text-[14px] text-ellipsis w-full">Redes e instituições que oferecem acolhimento e trocas de experiências para pessoas em uso de substâncias e seus familiares</p>
    </div>
  );
}

function Frame24() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[16px] items-center min-w-px relative">
      <Content5 />
    </div>
  );
}

function Content6() {
  return (
    <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[8px] items-start min-w-px not-italic relative text-[#171b18]" data-name="Content">
      <p className="[text-box-edge:cap_alphabetic] [text-box-trim:trim-both] font-['urbanist:SemiBold',sans-serif] leading-[20px] overflow-hidden relative shrink-0 text-[16px] text-ellipsis w-full whitespace-nowrap">AA • Alcoólicos anônimos</p>
      <p className="font-['inter:Regular',sans-serif] leading-[18px] overflow-hidden relative shrink-0 text-[12px] text-ellipsis w-full">Grupo de apoio e escuta voltada para a recuperação do uso de álcool, oferecendo reuniões presenciais e online para a troca de experiências</p>
    </div>
  );
}

function Frame32() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[16px] items-center min-w-px relative">
      <Content6 />
    </div>
  );
}

function Content7() {
  return (
    <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[8px] items-start min-w-px not-italic relative text-[#171b18]" data-name="Content">
      <p className="[text-box-edge:cap_alphabetic] [text-box-trim:trim-both] font-['urbanist:SemiBold',sans-serif] leading-[20px] overflow-hidden relative shrink-0 text-[16px] text-ellipsis w-full whitespace-nowrap">AA • Alcoólicos anônimos</p>
      <p className="font-['inter:Regular',sans-serif] leading-[18px] overflow-hidden relative shrink-0 text-[12px] text-ellipsis w-full">Grupo de apoio e escuta voltada para a recuperação do uso de álcool, oferecendo reuniões presenciais e online para a troca de experiências</p>
    </div>
  );
}

function Frame34() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[16px] items-center min-w-px relative">
      <Content7 />
    </div>
  );
}

function Frame31() {
  return (
    <div className="content-stretch flex flex-col gap-px items-start relative shrink-0 w-full">
      <div className="relative shrink-0 w-full" data-name="_cards-individuais-instituições">
        <div className="content-stretch flex flex-col items-start relative size-full">
          <div className="bg-white relative shrink-0 w-full" data-name="Alcoolicos anonimos">
            <div className="content-stretch flex flex-col items-start px-[16px] py-[24px] relative size-full">
              <div className="relative shrink-0 w-full" data-name="Property 1=Default">
                <div className="content-stretch flex flex-col items-start relative size-full">
                  <div className="relative shrink-0 w-full" data-name="Alcoolicos anonimos">
                    <div className="content-stretch flex flex-col gap-[24px] items-start relative size-full">
                      <div className="relative shrink-0 w-full" data-name="card_header">
                        <div className="flex flex-row items-center size-full">
                          <div className="content-stretch flex gap-[8px] items-center relative size-full">
                            <Frame32 />
                            <div className="overflow-clip relative shrink-0 size-[16px]" data-name="info">
                              <svg className="absolute block inset-0 size-full" fill="none" height="32" preserveAspectRatio="none" viewBox="0 0 32 32" width="32">
                                <g id="Vector" />
                              </svg>
                              <div className="absolute inset-[8.33%]" data-name="Vector">
                                <svg className="absolute block inset-0 size-full" fill="none" height="13.3333" preserveAspectRatio="none" viewBox="0 0 13.3333 13.3333" width="13.3333">
                                  <path d={svgPaths.p32f50700} fill="#171B18" fillOpacity="0.64" id="Vector" />
                                </svg>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="relative shrink-0" data-name="button group">
                        <div className="content-stretch flex gap-[8px] items-start relative size-full">
                          <ButtonTelefone className="relative shrink-0" />
                          <ButtonWhatsApp className="relative shrink-0" />
                          <ButtonGruposOnline className="relative shrink-0" />
                          <ButtonGruposPresenciais className="relative shrink-0" />
                          <ButtonSite className="relative shrink-0" />
                          <ButtonSaibaMais className="relative shrink-0" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="relative shrink-0 w-full" data-name="_cards-individuais-instituições">
        <div className="content-stretch flex flex-col items-start relative size-full">
          <div className="bg-white relative shrink-0 w-full" data-name="Alcoolicos anonimos">
            <div className="content-stretch flex flex-col items-start px-[16px] py-[24px] relative size-full">
              <div className="relative shrink-0 w-full" data-name="Property 1=Default">
                <div className="content-stretch flex flex-col items-start relative size-full">
                  <div className="relative shrink-0 w-full" data-name="Alcoolicos anonimos">
                    <div className="content-stretch flex flex-col gap-[24px] items-start relative size-full">
                      <div className="relative shrink-0 w-full" data-name="card_header">
                        <div className="flex flex-row items-center size-full">
                          <div className="content-stretch flex gap-[8px] items-center relative size-full">
                            <Frame34 />
                            <div className="overflow-clip relative shrink-0 size-[16px]" data-name="info">
                              <svg className="absolute block inset-0 size-full" fill="none" height="32" preserveAspectRatio="none" viewBox="0 0 32 32" width="32">
                                <g id="Vector" />
                              </svg>
                              <div className="absolute inset-[8.33%]" data-name="Vector">
                                <svg className="absolute block inset-0 size-full" fill="none" height="13.3333" preserveAspectRatio="none" viewBox="0 0 13.3333 13.3333" width="13.3333">
                                  <path d={svgPaths.p32f50700} fill="#171B18" fillOpacity="0.64" id="Vector" />
                                </svg>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="relative shrink-0" data-name="button group">
                        <div className="content-stretch flex gap-[8px] items-start relative size-full">
                          <ButtonTelefone className="relative shrink-0" />
                          <ButtonWhatsApp className="relative shrink-0" />
                          <ButtonGruposOnline className="relative shrink-0" />
                          <ButtonGruposPresenciais className="relative shrink-0" />
                          <ButtonSite className="relative shrink-0" />
                          <ButtonSaibaMais className="relative shrink-0" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Content8() {
  return (
    <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[10px] items-start min-w-px not-italic relative text-[#171b18]" data-name="Content">
      <p className="[text-box-edge:cap_alphabetic] [text-box-trim:trim-both] font-['urbanist:SemiBold',sans-serif] leading-[24px] overflow-hidden relative shrink-0 text-[18px] text-ellipsis w-full whitespace-nowrap">Passos reais, para fazer agora</p>
      <p className="font-['inter:Regular',sans-serif] leading-[20px] overflow-hidden relative shrink-0 text-[14px] text-ellipsis w-full">Escolha um ou dois passos para fazer hoje ou amanhã</p>
    </div>
  );
}

function Frame35() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[16px] items-center min-w-px relative">
      <Content8 />
    </div>
  );
}

function Frame10() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[2px] items-start justify-center min-w-px relative">
      <p className="[word-break:break-word] font-['inter:Regular',sans-serif] leading-[18px] not-italic relative shrink-0 text-[#171b18] text-[12px] w-full">Ligar pra CAPS ou UBS mais perto pra saber como funciona</p>
    </div>
  );
}

function Frame36() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
      <div className="relative rounded-[12px] shrink-0 w-full" data-name="Check-box-group">
        <div aria-hidden className="absolute border-[#171b18] border-[0.5px] border-solid inset-[-0.5px] pointer-events-none rounded-[12.5px]" />
        <div className="flex flex-row items-center size-full">
          <div className="content-stretch flex gap-[8px] items-center px-[10px] py-[12px] relative size-full">
            <CheckBox className="relative shrink-0 size-[24px]" />
            <Frame10 />
          </div>
        </div>
      </div>
      <CheckBoxGroup className="relative rounded-[12px] shrink-0 w-full" text="Fazer a primeira observação do seu padrão de uso" title1={false} />
      <CheckBoxGroup className="relative rounded-[12px] shrink-0 w-full" text="Ligar pra CAPS ou UBS mais perto pra saber como funciona" title1={false} />
      <CheckBoxGroup className="relative rounded-[12px] shrink-0 w-full" text="Ligar pro CVV só pra conversar" title1={false} />
      <CheckBoxGroup className="relative rounded-[12px] shrink-0 w-full" text="Baixar um app de meditação/respiração" title1={false} />
    </div>
  );
}

function Content9() {
  return (
    <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[10px] items-start min-w-px not-italic relative text-[#171b18]" data-name="Content">
      <p className="[text-box-edge:cap_alphabetic] [text-box-trim:trim-both] font-['urbanist:SemiBold',sans-serif] leading-[24px] overflow-hidden relative shrink-0 text-[18px] text-ellipsis w-full whitespace-nowrap">Para planejar</p>
      <p className="font-['inter:Regular',sans-serif] leading-[20px] overflow-hidden relative shrink-0 text-[14px] text-ellipsis w-full">Escolha o que faz sentido para você nas próximas semanas</p>
    </div>
  );
}

function Frame37() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[16px] items-center min-w-px relative">
      <Content9 />
    </div>
  );
}

function Frame11() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[2px] items-start justify-center min-w-px relative">
      <p className="[word-break:break-word] font-['inter:Regular',sans-serif] leading-[18px] not-italic relative shrink-0 text-[#171b18] text-[12px] w-full">{`Identificar o "antes e depois": o que você tá sentindo/pensando antes de usar? E depois que passa o efeito, como fica?`}</p>
    </div>
  );
}

function Frame38() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
      <div className="relative rounded-[12px] shrink-0 w-full" data-name="Check-box-group">
        <div aria-hidden className="absolute border-[#171b18] border-[0.5px] border-solid inset-[-0.5px] pointer-events-none rounded-[12.5px]" />
        <div className="flex flex-row items-center size-full">
          <div className="content-stretch flex gap-[8px] items-center px-[10px] py-[12px] relative size-full">
            <CheckBox className="relative shrink-0 size-[24px]" />
            <Frame11 />
          </div>
        </div>
      </div>
      <CheckBoxGroup className="relative rounded-[12px] shrink-0 w-full" text="Manter contato diário com seu corpo: 5 minutos. Senta, respira fundo 5 vezes (inspira por 4, segura por 4, solta por 4), e pergunta pra si: como tá o meu corpo agora?" title1={false} />
      <CheckBoxGroup className="relative rounded-[12px] shrink-0 w-full" text="Quando bater a vontade: antes de usar, faz algo diferente por 15 minutos. Pode ser caminhada, tomar água gelada, conversar com alguém de confiança, fazer algo com as mãos (desenho, culinária), ouvir música que te move, escrever." title1={false} />
      <CheckBoxGroup className="relative rounded-[12px] shrink-0 w-full" title1={false} />
      <CheckBoxGroup className="relative rounded-[12px] shrink-0 w-full" title1={false} />
    </div>
  );
}

function Frame33() {
  return (
    <div className="content-stretch flex flex-col gap-px items-start relative shrink-0 w-full">
      <div className="relative shrink-0 w-full" data-name="Card profissionais">
        <div className="content-stretch flex flex-col items-start relative size-full">
          <div className="bg-[#f4f6f4] relative shrink-0 w-full" data-name="card bg">
            <div className="content-stretch flex flex-col items-start py-[24px] relative size-full">
              <div className="relative shrink-0 w-full" data-name="Property 1=Default">
                <div className="flex flex-col items-center size-full">
                  <div className="content-stretch flex flex-col gap-[16px] items-center px-[16px] relative size-full">
                    <div className="relative shrink-0 w-full" data-name="card_header">
                      <div className="flex flex-row items-center size-full">
                        <div className="content-stretch flex gap-[8px] items-center relative size-full">
                          <Frame16 />
                        </div>
                      </div>
                    </div>
                    <Frame26 />
                    <div className="bg-white relative rounded-[16px] shrink-0 w-full" data-name="card background">
                      <div aria-hidden className="absolute border-2 border-[#e9ecea] border-solid inset-[-2px] pointer-events-none rounded-[18px]" />
                      <div className="content-stretch flex flex-col items-start p-[16px] relative size-full">
                        <div className="relative shrink-0 w-full" data-name="State=Default">
                          <div className="overflow-clip rounded-[inherit] size-full">
                            <div className="content-stretch flex flex-col gap-[12px] items-start relative size-full">
                              <Frame15 />
                              <Frame17 />
                              <p className="[word-break:break-word] font-['inter:Regular',sans-serif] h-[55px] leading-[18px] min-w-full not-italic overflow-hidden relative shrink-0 text-[#171b18] text-[12px] text-ellipsis w-[min-content]">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat</p>
                              <div className="bg-[#055c40] relative rounded-[12px] shrink-0 w-full" data-name="button">
                                <div className="flex flex-row items-center justify-center size-full">
                                  <div className="content-stretch flex items-center justify-center py-[10px] relative size-full">
                                    <Frame8 />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="backdrop-blur-[4px] h-[36px] relative rounded-[12px] shrink-0 w-full" data-name="button">
                      <div className="flex flex-row items-center justify-center size-full">
                        <div className="content-stretch flex items-center justify-center py-[10px] relative size-full">
                          <Frame9 />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="relative shrink-0 w-full" data-name="cards-serviços publicos">
        <div className="content-stretch flex flex-col items-start relative size-full">
          <div className="relative shrink-0 w-full" data-name="cards-instituições-completo">
            <div className="content-stretch flex flex-col items-start relative size-full">
              <div className="bg-[#f4f6f4] relative shrink-0 w-full" data-name="card bg">
                <div className="content-stretch flex flex-col items-start pb-[12px] pt-[24px] relative size-full">
                  <div className="relative shrink-0 w-full" data-name="Property 1=Default">
                    <div className="content-stretch flex flex-col gap-[10px] items-start relative size-full">
                      <div className="relative shrink-0 w-full" data-name="card_header">
                        <div className="flex flex-row items-center size-full">
                          <div className="content-stretch flex gap-[8px] items-center px-[16px] relative size-full">
                            <Frame18 />
                          </div>
                        </div>
                      </div>
                      <Frame29 />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="relative shrink-0 w-full" data-name="cards-instituições-completo">
        <div className="content-stretch flex flex-col items-start relative size-full">
          <div className="bg-[#f4f6f4] relative shrink-0 w-full" data-name="card bg">
            <div className="content-stretch flex flex-col items-start pb-[12px] pt-[24px] relative size-full">
              <div className="relative shrink-0 w-full" data-name="Property 1=Default">
                <div className="content-stretch flex flex-col gap-[10px] items-start relative size-full">
                  <div className="relative shrink-0 w-full" data-name="card_header">
                    <div className="flex flex-row items-center size-full">
                      <div className="content-stretch flex gap-[8px] items-center px-[16px] relative size-full">
                        <Frame24 />
                      </div>
                    </div>
                  </div>
                  <Frame31 />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="relative shrink-0 w-full" data-name="passos-reais">
        <div className="content-stretch flex flex-col items-start relative size-full">
          <div className="bg-[#f4f6f4] relative shrink-0 w-full" data-name="card background">
            <div className="content-stretch flex flex-col items-start px-[16px] py-[24px] relative size-full">
              <div className="relative shrink-0 w-full" data-name="Property 1=Default">
                <div className="flex flex-col items-center size-full">
                  <div className="content-stretch flex flex-col gap-[10px] items-center px-[16px] relative size-full">
                    <div className="relative shrink-0 w-full" data-name="card_header">
                      <div className="flex flex-row items-center size-full">
                        <div className="content-stretch flex gap-[8px] items-center relative size-full">
                          <Frame35 />
                        </div>
                      </div>
                    </div>
                    <Frame36 />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="relative shrink-0 w-full" data-name="proximos-passos">
        <div className="content-stretch flex flex-col items-start relative size-full">
          <div className="bg-[#f4f6f4] relative shrink-0 w-full" data-name="card background">
            <div className="content-stretch flex flex-col items-start px-[16px] py-[24px] relative size-full">
              <div className="relative shrink-0 w-full" data-name="Property 1=Default">
                <div className="content-stretch flex flex-col gap-[10px] items-start px-[16px] relative size-full">
                  <div className="h-[63px] relative shrink-0 w-full" data-name="card_header">
                    <div className="flex flex-row items-center size-full">
                      <div className="content-stretch flex gap-[8px] items-center relative size-full">
                        <Frame37 />
                      </div>
                    </div>
                  </div>
                  <Frame38 />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MainFrame() {
  return (
    <div className="bg-white content-stretch flex flex-col gap-[16px] items-center relative shrink-0 w-full" data-name="Main Frame">
      <Frame12 />
      <Frame33 />
    </div>
  );
}

export default function ResultadosTemplate() {
  return (
    <div className="bg-white relative shadow-[0px_8px_24px_-8px_rgba(0,0,0,0.05)] size-full" data-name="Resultados template">
      <div className="content-stretch flex flex-col items-start relative size-full">
        <div className="bg-white relative shrink-0 w-full" data-name="Header">
          <div className="content-stretch flex flex-col items-start px-[16px] py-[12px] relative size-full">
            <Frame2 />
          </div>
        </div>
        <MainFrame />
      </div>
    </div>
  );
}