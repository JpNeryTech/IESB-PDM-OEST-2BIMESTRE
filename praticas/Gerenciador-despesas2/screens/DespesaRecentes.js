import { useMemo } from 'react';

import DespesaSaida from '../components/despesa/DespesaSaida';
import { useExpenses } from '../store/expenses-context';

function DespesaRecentes() {
  const { expenses } = useExpenses();

  const despesasRecentes = useMemo(() => {
    const hoje = new Date();
    hoje.setHours(23, 59, 59, 999);

    const seteDiasAtras = new Date();
    seteDiasAtras.setDate(seteDiasAtras.getDate() - 6);
    seteDiasAtras.setHours(0, 0, 0, 0);

    return expenses.filter((despesa) => {
      const dataDespesa = new Date(despesa.data);

      return (
        !Number.isNaN(dataDespesa.getTime()) &&
        dataDespesa >= seteDiasAtras &&
        dataDespesa <= hoje
      );
    });
  }, [expenses]);

  return (
    <DespesaSaida
      despesas={despesasRecentes}
      periodo="Últimos 7 dias"
    />
  );
}

export default DespesaRecentes;
