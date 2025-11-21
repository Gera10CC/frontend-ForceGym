const Pricing = () => {
  const tarifas = [
    { name: "MENSUALIDAD", price: "₡17,000" },
    { name: "ESTUDIANTE", price: "₡14,500", note: "(Instituciones Públicas)" },
    { name: "QUINCENA", price: "₡11,000" },
    { name: "SEMANA", price: "₡7,000" },
    { name: "SESIÓN", price: "₡2,500" },
    { name: "LIMITADA", price: "₡15,000", note: "(8am-10am / 2pm-4pm)" },
  ];

  return (
    <section id="tarifas" className="py-16 md:py-24 bg-black">
      <div className="container mx-auto px-4">
        {/* Encabezado minimalista */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-2">
            TARIFAS <span className="text-yellow-500">FORCE GYM</span>
          </h2>
          <div className="w-20 h-1 bg-yellow-500 mx-auto"></div>
        </div>

        {/* Tabla de precios elegante */}
        <div className="max-w-3xl mx-auto overflow-hidden rounded-lg border border-white">
          <table className="w-full">
            <thead>
              <tr className="bg-black text-yellow-500">
                <th className="py-4 px-6 text-left font-bold uppercase text-sm">PLAN</th>
                <th className="py-4 px-6 text-right font-bold uppercase text-sm">PRECIO</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white">
              {tarifas.map((tarifa, index) => (
                <tr key={index} className="hover:bg-white-900/50 transition-colors">
                  <td className="py-4 px-6 text-white">
                    <div className="font-medium">{tarifa.name}</div>
                    {tarifa.note && <div className="text-sm text-white-400 mt-1">{tarifa.note}</div>}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <span className="text-yellow-500 font-bold text-lg">{tarifa.price}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Notas informativas */}
        <div className="mt-8 text-center text-white text-sm max-w-3xl mx-auto">
          <p className="mb-2">* Todos los planes incluyen acceso a instalaciones, rutina personalizada y medición inicial.</p>
          <p>** Precios vigentes al {new Date().toLocaleDateString('es-CR')}. Sujetos a cambio sin previo aviso.</p>
        </div>
      </div>
    </section>
  );
};

export default Pricing;