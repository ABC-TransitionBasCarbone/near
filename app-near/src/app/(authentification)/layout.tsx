/* eslint-disable @next/next/no-img-element */

import Link from 'next/link';
import { ReactNode } from 'react';

interface AuthentificationLayoutProps{
  children: ReactNode
}
const AuthentificationLayout: React.FC<AuthentificationLayoutProps> = ({ children }) => (
  <div className="flex min-h-screen">
    <div className=" flex flex-col flex-1 p-3 justify-center items-center">
      <div className="flex flex-col max-w-[450px] w-full">
        {children}
      </div>
    </div>
    <div className="hidden relative lg:flex flex-1 bg-brownLight bg-cover h-screen">
      <div className="w-full h-full flex flex-col justify-center items-center p-24 gap-8">
        <img src="/logos/abc.webp" width={158} height={76} alt="" />
        <img src="/logos/reseau-qet.webp" width={98} height={98} alt="" />
        <img src="/logos/cooperative-carbone.webp" width={200} height={74} alt="" />
        <img src="/logos/ville-paris.webp" width={102} height={89} alt="" />
        <img src="/logos/net-zero-cities.webp" width={100} height={92} alt="" />
        <img src="/logos/ue.webp" width={232} height={66} alt="" />
      </div>
    </div>
  </div>
);

export default AuthentificationLayout;
