import DespesaSaida from '../components/despesa/DespesaSaida';
import { useExpenses } from '../store/expenses-context';

function TodasDespesas() {
  const { expenses } = useExpenses();

  return (
    <DespesaSaida
      despesas={expenses}
      periodo="Total"
    />
  );
}

export default TodasDespesas;
