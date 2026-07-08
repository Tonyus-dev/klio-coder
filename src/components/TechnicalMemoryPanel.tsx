import React from 'react';

export default function TechnicalMemoryPanel() {
  return (
    <div className="p-6 h-full flex items-center justify-center text-[#A89F96]">
      <div className="text-center">
        <h2 className="text-xl font-bold text-[#F7EFE7] mb-2 font-serif">Memória Técnica</h2>
        <p className="text-sm max-w-md">
          Memória técnica futura da Klio: decisões, prompts aprovados, PRs, debug, padrões e preferências técnicas.
        </p>
      </div>
    </div>
  );
}
