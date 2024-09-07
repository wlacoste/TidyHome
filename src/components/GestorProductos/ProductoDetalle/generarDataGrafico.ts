import { formatDateNormal, getFechaCorta } from '../../../utils/formatDate';

export function stringAFecha(dateString: string): Date {
  const [day, month, year] = dateString.split('/').map(Number);

  return new Date(year, month - 1, day);
}

interface Valor {
  id: number;
  fecha: string;
  value: number;
  label: string;
  fechaDate: Date;
}
interface AccumulatorItem {
  first: Valor;
  last: Valor;
}
export const valoresFiltrados = (valores: Valor[]): Valor[] => {
  return Object.values(
    valores.reduce<Record<string, Valor>>((acc, curr) => {
      acc[curr.fecha] = curr; // Always update with the current value
      return acc;
    }, {}),
  ).sort((a, b) => a.id - b.id);
};

const calcularRango = (
  oldestDate: Date,
  cantidadValores: number,
  numeroPaginacion: number,
) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set to start of day

  // Calculate how many days to subtract from today
  const daysToSubtract = cantidadValores * numeroPaginacion;
  let startDate = new Date(today);
  startDate.setDate(today.getDate() - daysToSubtract);

  // If startDate is older than oldestDate, use oldestDate
  if (startDate < oldestDate) {
    startDate = new Date(oldestDate);
  }

  // Calculate endDate by adding cantidadValores days to startDate
  let endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + cantidadValores);

  // If endDate is in the future, cap it to today
  if (endDate > today) {
    endDate = new Date(today);
  }

  return { endDate, startDate };
};
const isSameDay = (date1: Date, date2: Date) =>
  date1.getFullYear() === date2.getFullYear() &&
  date1.getMonth() === date2.getMonth() &&
  date1.getDate() === date2.getDate();

const filterValoresByDateRange = (
  valores: Valor[],
  startDate: Date,
  endDate: Date,
) => {
  let preFilteredValue: Valor | undefined;
  let postFilteredValue: Valor | undefined;
  const filteredValues: Valor[] = [];

  for (let i = 0; i < valores.length; i++) {
    const valor = valores[i];

    if (valor.fechaDate < startDate) {
      preFilteredValue = valor;
    } else if (valor.fechaDate > endDate) {
      if (!postFilteredValue) {
        postFilteredValue = valor;
      }
      break;
    } else {
      filteredValues.push(valor);
    }
  }

  const startMatch = valores.find(v => isSameDay(v.fechaDate, startDate));
  const endMatch = valores.find(v => isSameDay(v.fechaDate, endDate));

  if (startMatch) {
    preFilteredValue = startMatch;
  }
  if (endMatch) {
    postFilteredValue = endMatch;
  }
  return {
    filteredValues,
    preFilteredValue,
    postFilteredValue,
  };
};

const fillDateGaps = (startDate: Date, endDate: Date, valores: Valor[]) => {
  const result: Valor[] = [];
  let currentDate = new Date(startDate);
  let lastValor: Valor | null = null;
  let valorIndex = 0;

  while (currentDate <= endDate) {
    const currentDateString = formatDateNormal(currentDate);

    if (
      valorIndex < valores.length &&
      isSameDay(valores[valorIndex].fechaDate, currentDate)
    ) {
      // Use existing Valor for this date
      result.push(valores[valorIndex]);
      lastValor = valores[valorIndex];
      valorIndex++;
    } else {
      // Create new Valor based on the last known Valor
      if (lastValor) {
        let val = {
          id: lastValor.id + (1 - 1 / valorIndex), // Generate a new ID
          fecha: currentDateString,
          value: lastValor.value,
          label: lastValor.label,
          fechaDate: new Date(currentDate),
        };
        result.push(val);
        lastValor = val;
      }
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return result;
};

export const rellenar = (
  cantidadValores: number,
  valores: Valor[],
  numeroPaginacion: number,
) => {
  const { startDate, endDate } = calcularRango(
    valores[0].fechaDate,
    cantidadValores,
    numeroPaginacion,
  );
  const valorPorDia = valoresFiltrados(valores);
  const { filteredValues, preFilteredValue, postFilteredValue } =
    filterValoresByDateRange(valorPorDia, startDate, endDate);
  let valorInicial = filteredValues[0];
  if (
    valorInicial.fechaDate > startDate &&
    valorInicial.fechaDate !== preFilteredValue?.fechaDate
  ) {
    if (preFilteredValue) {
      let nuevoValorInicial = {
        id: preFilteredValue.id,
        fecha: preFilteredValue.fecha,
        value: preFilteredValue.value,
        label: preFilteredValue.label,
        fechaDate: startDate,
      };
      filteredValues.unshift(nuevoValorInicial);
    }
  }

  const arrayCompleto = fillDateGaps(startDate, endDate, filteredValues);
  const valoresAGrafico = arrayCompleto.map(item => {
    return {
      value: item.value,
      label: getFechaCorta(item.fechaDate),
      fechaDate: item.fechaDate,
    };
  });

  return valoresAGrafico;
};
