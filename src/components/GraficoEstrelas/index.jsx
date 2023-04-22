import React from 'react';
import './index.css';
import PropTypes from 'prop-types';
import { Line } from 'react-chartjs-2';
import Chart from 'chart.js/auto';

/**
 * Componente que representa o gráfico de estrelas.
 * Descrição completa está no README.md.
 *
 * PS: O código abaixo é apenas um esqueleto para vocês implementarem.
 *     Vocês podem (e devem) alterar tudo que quiserem, menos a interface
 *     Além disso, usem dos componentes que forem necessários, para issio importem o pacote junto aos "imports".
 */
export function GraficoEstrelas(props) {
  //obtém a semana do ano de uma data
  function obterNumeroSemana(props, index) {
    const data = props.estrelas[index].starred_at;

    const firstDayOfYear = new Date(data.getFullYear(), 0, 1);
    const pastDaysOfYear = (data - firstDayOfYear) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  }

  function obterDia(props, index) {
    return props.estrelas[index].starred_at.getDate();
  }

  function obterAno(props, index) {
    return props.estrelas[index].starred_at.getFullYear();
  }

  function obterMes(props, index) {
    return props.estrelas[index].starred_at.getMonth() + 1;
  }

  function unique(value, index, self) {
    return self.indexOf(value) === index;
  }

  //obtém a semana do ano de uma data
  function obterNumeroSemana(props, index) {
    const data = props.estrelas[index].starred_at;

    const firstDayOfYear = new Date(data.getFullYear(), 0, 1);
    const pastDaysOfYear = (data - firstDayOfYear) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  }

  const options = {
    responsive: true,
    plugins: {
      legend: true,
    },
  };

  function obterDados() {
    let labels = [];
    const dias = [];
    const meses = [];
    const contagem = [];

    if (props.agrupamento === 'dia') {
      for (let index = 0; index < props.estrelas.length; index++) {
        const dia =
          obterDia(props, index) + '/' + obterMes(props, index) + '/' + obterAno(props, index);
        dias.push(dia);
      }
      labels = dias.filter(unique);

      for (let index = 0; index < labels.length; index++) {
        const repeticao = props.estrelas.filter(
          (estrela) => labels[index] === estrela.starred_at
        ).length;
        contagem.push(repeticao);
        let cont = 0;
        for (let index2 = 0; index2 < dias.length; index2++) {
          if (labels[index] === dias[index2]) {
            cont++;
          }
        }
        contagem.push(cont);
      }
    } else if (props.agrupamento === 'semana') {
      for (let index = 0; index < props.estrelas.length; index++) {
        const semana = obterNumeroSemana(props, index) + '/' + obterAno(props, index);
        dias.push(semana);
      }

      labels = dias.filter(unique);

      for (let index = 0; index < labels.length; index++) {
        let cont = 0;
        for (let index2 = 0; index2 < dias.length; index2++) {
          if (labels[index] === dias[index2]) {
            cont++;
          }
        }
        contagem.push(cont);
      }
    } else if (props.agrupamento === 'mes') {
      for (let index = 0; index < props.estrelas.length; index++) {
        meses.push(obterMes(props, index));
      }

      labels = meses.filter(unique);
      labels.sort(function (a, b) {
        return a - b;
      });

      for (let index = 0; index < labels.length; index++) {
        let contador = 0;
        props.estrelas.forEach((estrela) => {
          if (estrela.starred_at.getMonth() == labels[index]) {
            contador++;
          }
        });
        contagem.push(contador);
      }
    } else if (props.agrupamento === 'ano') {
      let anos = [];
      for (let index = 0; index < props.estrelas.length; index++) {
        anos.push(obterAno(props, index));
      }

      labels = anos.filter(unique);
      labels.sort(function (a, b) {
        return a - b;
      });

      for (let index = 0; index < labels.length; index++) {
        let contador = 0;
        props.estrelas.forEach((estrela) => {
          if (estrela.starred_at.getFullYear() == labels[index]) {
            contador++;
          }
        });
        contagem.push(contador);
      }
    }

    return { labels: labels, contagem: contagem };
  }

  const dados = obterDados();
  const labels = dados.labels;
  const contagem = dados.contagem;

  const data = {
    labels,
    datasets: [
      {
        label: 'Dataset 1',
        data: contagem,
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
    ],
  };

  return (
    <div className="grafico">
      <Line options={options} data={data} />
    </div>
  );
}

// Definição dos tipos das propriedades recebidas.
GraficoEstrelas.propTypes = {
  estrelas: PropTypes.arrayOf(
    PropTypes.shape({
      user: PropTypes.string.isRequired,
      starred_at: PropTypes.instanceOf(Date).isRequired,
    })
  ).isRequired,
  agrupamento: PropTypes.oneOf(['dia', 'semana', 'mes', 'ano']),
  escala: PropTypes.oneOf(['linear', 'log']),
};

// Definição dos valores padrão das propriedades.
GraficoEstrelas.defaultProps = {
  agrupamento: 'dia',
  escala: 'linear',
};
