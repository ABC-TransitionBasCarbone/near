import { type ReactNode } from "react";

interface AuthentificationLayoutProps {
  children: ReactNode;
}
const AuthentificationLayout: React.FC<AuthentificationLayoutProps> = ({
  children,
}) => (
  <main role="main" className="flex min-h-screen">
    <div className="flex flex-1 flex-col items-center justify-center p-3">
      <div className="flex w-full max-w-[450px] flex-col">{children}</div>
    </div>
    <div className="relative hidden h-screen flex-1 bg-[url(/images/pattern_vert.webp)] lg:flex">
      <div className="flex h-full w-full flex-col items-center justify-center gap-8 p-24">
        <img src="/logos/abc.webp" width={158} height={76} alt="" />
        <img src="/logos/reseau-qet.webp" width={98} height={98} alt="" />
        <img
          src="/logos/cooperative-carbone.webp"
          width={200}
          height={74}
          alt=""
        />
        <img src="/logos/ville-paris.webp" width={102} height={89} alt="" />
        <img src="/logos/net-zero-cities.webp" width={100} height={92} alt="" />
        <img src="/logos/ue.webp" width={232} height={66} alt="" />
      </div>
    </div>
  </main>
);

export default AuthentificationLayout;
