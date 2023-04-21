import React from 'react';
import './index.css'
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
  function obterDia(props, index) {
    return props.estrelas[index].starred_at.getDay();
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

  const options = {
    responsive: true,
    plugins: {
      legend: true,
    },
  };
  
  let labels = [];
  const dias= [];
  const contagem = [];

  if(props.agrupamento === 'dia'){
    for (let index = 0; index < props.estrelas.length; index++) {
      const dia = obterDia(props, index) + "/" + obterMes(props, index) + "/" + obterAno(props, index);
      dias.push(dia);
    }

    labels = dias.filter(unique);

    for (let index = 0; index < labels.length; index++) {
      const repeticao = props.estrelas.filter(estrela => labels[index] === estrela.starred_at).length;
      contagem.push(repeticao);
    }
  }

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

  console.log(data);
 
  return <div className='grafico'>
    <Line options={options} data={data} />
  </div>;
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