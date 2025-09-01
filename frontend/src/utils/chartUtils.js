// Chart.js configuration and utilities for creating interactive charts

export const defaultChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        padding: 20,
        usePointStyle: true,
        font: {
          family: 'Inter, sans-serif',
          size: 12
        }
      }
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      titleFont: {
        family: 'Inter, sans-serif',
        size: 14,
        weight: 'bold'
      },
      bodyFont: {
        family: 'Inter, sans-serif',
        size: 12
      },
      cornerRadius: 8,
      padding: 12
    }
  },
  animation: {
    duration: 1500,
    easing: 'easeInOutQuart'
  }
};

export const colorPalettes = {
  primary: [
    'rgba(59, 130, 246, 0.8)',   // Blue
    'rgba(239, 68, 68, 0.8)',    // Red
    'rgba(16, 185, 129, 0.8)',   // Green
    'rgba(245, 158, 11, 0.8)',   // Orange
    'rgba(139, 92, 246, 0.8)',   // Purple
    'rgba(236, 72, 153, 0.8)',   // Pink
    'rgba(6, 182, 212, 0.8)',    // Cyan
    'rgba(34, 197, 94, 0.8)',    // Emerald
    'rgba(251, 113, 133, 0.8)',  // Rose
    'rgba(168, 85, 247, 0.8)'    // Violet
  ],
  borders: [
    'rgba(59, 130, 246, 1)',
    'rgba(239, 68, 68, 1)',
    'rgba(16, 185, 129, 1)',
    'rgba(245, 158, 11, 1)',
    'rgba(139, 92, 246, 1)',
    'rgba(236, 72, 153, 1)',
    'rgba(6, 182, 212, 1)',
    'rgba(34, 197, 94, 1)',
    'rgba(251, 113, 133, 1)',
    'rgba(168, 85, 247, 1)'
  ]
};

export const createPieChart = (labels, data, title) => {
  return {
    type: 'pie',
    data: {
      labels,
      datasets: [{
        data,
        backgroundColor: colorPalettes.primary.slice(0, labels.length),
        borderColor: colorPalettes.borders.slice(0, labels.length),
        borderWidth: 2
      }]
    },
    options: {
      ...defaultChartOptions,
      plugins: {
        ...defaultChartOptions.plugins,
        title: {
          display: true,
          text: title,
          font: {
            family: 'Inter, sans-serif',
            size: 18,
            weight: 'bold'
          },
          color: '#1f2937'
        }
      }
    }
  };
};

export const createBarChart = (labels, data, title) => {
  return {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'Count',
        data,
        backgroundColor: colorPalettes.primary.slice(0, labels.length),
        borderColor: colorPalettes.borders.slice(0, labels.length),
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false
      }]
    },
    options: {
      ...defaultChartOptions,
      plugins: {
        ...defaultChartOptions.plugins,
        title: {
          display: true,
          text: title,
          font: {
            family: 'Inter, sans-serif',
            size: 18,
            weight: 'bold'
          },
          color: '#1f2937'
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            precision: 0,
            font: {
              family: 'Inter, sans-serif'
            }
          },
          grid: {
            color: 'rgba(0,0,0,0.1)'
          }
        },
        x: {
          ticks: {
            font: {
              family: 'Inter, sans-serif'
            }
          },
          grid: {
            display: false
          }
        }
      }
    }
  };
};

export const createDoughnutChart = (labels, data, title) => {
  return {
    type: 'doughnut',
    data: {
      labels,
      datasets: [{
        data,
        backgroundColor: colorPalettes.primary.slice(0, labels.length),
        borderColor: colorPalettes.borders.slice(0, labels.length),
        borderWidth: 3
      }]
    },
    options: {
      ...defaultChartOptions,
      cutout: '60%',
      plugins: {
        ...defaultChartOptions.plugins,
        title: {
          display: true,
          text: title,
          font: {
            family: 'Inter, sans-serif',
            size: 18,
            weight: 'bold'
          },
          color: '#1f2937'
        }
      }
    }
  };
};

export const createLineChart = (labels, data, title) => {
  return {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: 'Trend',
        data,
        borderColor: 'rgba(59, 130, 246, 1)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointRadius: 5,
        pointHoverRadius: 8,
        pointBackgroundColor: 'rgba(59, 130, 246, 1)',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2
      }]
    },
    options: {
      ...defaultChartOptions,
      plugins: {
        ...defaultChartOptions.plugins,
        title: {
          display: true,
          text: title,
          font: {
            family: 'Inter, sans-serif',
            size: 18,
            weight: 'bold'
          },
          color: '#1f2937'
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            font: {
              family: 'Inter, sans-serif'
            }
          },
          grid: {
            color: 'rgba(0,0,0,0.1)'
          }
        },
        x: {
          ticks: {
            font: {
              family: 'Inter, sans-serif'
            }
          },
          grid: {
            display: false
          }
        }
      }
    }
  };
};