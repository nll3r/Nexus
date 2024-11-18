import React from "react";
import Image from "next/image";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen">
      <section className="hidden w-1/2 items-center justify-center bg-brand p-10 lg:flex xl:w-2/5">
        <div className="flex max-h-[800px] max-w-[430px] flex-col justify-center space-y-12">
          <Image
            src="/assets/icons/logo-full.png"
            alt="logo"
            width={224}
            height={82}
            className="h-auto"
          />

          <div className="space-y-5 text-white">
            <h1 className="h1">A melhor forma de gerires os teus ficheiros</h1>
            <p className="body-1">Apenas um sítio para todos os documentos.</p>
          </div>
          <Image
            src="/ilustracao.png"
            alt="Ficheiros"
            width={196}
            height={196}
            className="Transition-all hover:rotate-2 hover:scale-105"
          />
        </div>
      </section>
      {children}
    </div>
  );
};

export default Layout;
