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

  function obterLabels(agrupamento) {
    const titulos = [];
    for (let index = 0; index < props.estrelas.length; index++) {
      titulos.push(agrupamento(props, index));
    }

    return {
      labels: titulos.filter(unique).sort(function (a, b) {
        return a - b;
      }),
      dadosAgrupamento: titulos,
    };
  }

  function obterContagemPorAgrupamento(labels, dadosAgrupamento) {
    let contagemAgrupamento = [];
    let contador = 0;
    let acumulador = 0;

    for (let index = 0; index < labels.length; index++) {
      contador = dadosAgrupamento.filter(dado => dado === labels[index]).length;

      if (props.cumulativa){
        acumulador+=contador;
        contador = acumulador;
      }

      if(props.escala == 'log'){
        contador = Math.log10(contador);
      }  

      contagemAgrupamento.push(contador);
    }
    return contagemAgrupamento;
  }

  function obterDados() {
    let labels = [];
    let contagem = [];
    let resultado;

    if (props.agrupamento === 'dia') {
      resultado= obterLabels((props, index) => obterDia(props, index) + '/' + obterMes(props, index) + '/' + obterAno(props, index));
    }

    else if (props.agrupamento === 'semana') {
      resultado= obterLabels((props, index) => obterNumeroSemana(props, index) + '/' + obterAno(props, index));
    }

    else if (props.agrupamento === 'mes') {
      resultado= obterLabels((props, index) => obterMes(props, index) + '/' + obterAno(props, index));
    } 

    else if (props.agrupamento === 'ano') {
      resultado= obterLabels((props, index) => obterAno(props, index));
    }

    labels = resultado.labels;
    
    contagem = obterContagemPorAgrupamento(labels, resultado.dadosAgrupamento);
    
    return { labels: labels, contagem: contagem};
  }

  const dados = obterDados();
  const labels = dados.labels;
  const contagem = dados.contagem;

  const options = {
    responsive: true,
    plugins: {
      legend: true,
    },
  };

  const data = {
    labels,
    datasets: [
      {
        label: 'Stargazers',
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
  cumulativa: PropTypes.bool
};

// Definição dos valores padrão das propriedades.
GraficoEstrelas.defaultProps = {
  agrupamento: 'dia',
  escala: 'linear',
  cumulativa: false
};
