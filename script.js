/* ── TOGGLE ── */
function toggleSwitch(id, stateId) {
  const t = document.getElementById(id);
  const on = t.classList.toggle('on');
  document.getElementById(stateId).textContent = on ? 'ON' : 'OFF';
}

/* ── RIPPLE ── */
function ripple(btn) {
  const r = document.createElement('span');
  r.className = 'ripple';
  const size = Math.max(btn.clientWidth, btn.clientHeight);
  r.style.cssText = `width:${size}px;height:${size}px;left:${btn.clientWidth/2-size/2}px;top:${btn.clientHeight/2-size/2}px`;
  btn.appendChild(r);
  setTimeout(() => r.remove(), 500);
}

/* ── TOAST ── */
function showToast(msg, color) {
  const t = document.getElementById('toast');
  document.getElementById('toast-msg').textContent = msg;
  t.style.color = color || '#00FFB2';
  t.style.borderColor = (color || '#00FFB2').replace(')',',0.25)').replace('rgb','rgba') || 'rgba(0,255,178,.25)';
  t.style.opacity = '1'; t.style.transform = 'translateX(-50%) translateY(0)';
  setTimeout(() => { t.style.opacity='0'; t.style.transform='translateX(-50%) translateY(20px)'; }, 2400);
}

/* ── SLIDER ── */
function updateSlider(el, valId) {
  document.getElementById(valId).textContent = el.value;
  const pct = ((el.value - el.min) / (el.max - el.min)) * 100;
  el.style.backgroundSize = pct + '% 100%';
}
document.querySelectorAll('.iris-slider').forEach(s => {
  const pct = ((s.value - s.min) / (s.max - s.min)) * 100;
  s.style.backgroundSize = pct + '% 100%';
});

/* ── NUMERIC STEP ── */
function numStep(id, delta) {
  const el = document.getElementById(id);
  const v = parseFloat(el.value) + delta;
  const mn = parseFloat(el.min||'-Infinity'), mx = parseFloat(el.max||'Infinity');
  el.value = Math.min(mx, Math.max(mn, v));
}

/* ── VALIDATE IP ── */
function validateIP(el) {
  const valid = /^((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$/.test(el.value);
  el.className = 'iris-input ' + (valid ? 'ok' : 'err');
  document.getElementById('ip-hint').textContent = valid ? '✓ Valid IP address' : '✗ Invalid IP address';
  document.getElementById('ip-hint').className = 'inp-hint ' + (valid ? 'ok' : 'err');
}

/* ── LIVE THERMOMETER ── */
let liveTemp = 55;
setInterval(() => {
  liveTemp += (Math.random() - 0.45) * 3;
  liveTemp = Math.max(20, Math.min(95, liveTemp));
  const pct = ((liveTemp - 0) / 100) * 100;
  document.getElementById('live-thermo').style.height = pct + '%';
  document.getElementById('live-temp-val').textContent = liveTemp.toFixed(1) + '°C';
  const hue = liveTemp > 70 ? '#FF5F57' : liveTemp > 50 ? '#FF9F40' : '#00C6FF';
  document.getElementById('live-thermo').style.background = `linear-gradient(to top,${hue},rgba(255,255,255,.3))`;
  document.getElementById('live-bulb').style.background = hue;
  document.getElementById('live-temp-val').style.color = hue;
}, 1200);

/* ── LIVE DISPLAY TEMP ── */
let dispTemp = 38.4;
setInterval(() => {
  dispTemp += (Math.random() - 0.5) * 0.4;
  dispTemp = Math.max(35, Math.min(42, dispTemp));
  document.getElementById('disp-temp').textContent = dispTemp.toFixed(1);
}, 1800);

/* ── CHARTS ── */
const chartOpts = (color1, color2) => ({
  responsive: true,
  animation: { duration: 600 },
  plugins: { legend: { display: false } },
  scales: {
    x: { grid: { color: 'rgba(0,180,255,0.07)', lineWidth: 0.5 }, ticks: { color: 'rgba(180,200,255,0.4)', font: { size: 10, family: 'DM Sans' } } },
    y: { grid: { color: 'rgba(0,180,255,0.07)', lineWidth: 0.5 }, ticks: { color: 'rgba(180,200,255,0.4)', font: { size: 10, family: 'DM Sans' } } }
  }
});

const labels12h = ['00','02','04','06','08','10','12','14','16','18','20','22'];
const tempData  = [42,44,41,48,52,58,61,55,63,60,57,54];
const energyData = [12,18,14,22,28,35,31,27,24,19,16,13];
const throughData = [800,1200,1100,900,1400,1800,2100,1950,2400,2200,1900,1600];

// Line chart
new Chart(document.getElementById('chart-line'), {
  type: 'line',
  data: {
    labels: labels12h,
    datasets: [{
      data: tempData, tension: 0.4, fill: true, pointRadius: 3,
      borderColor: '#00C6FF', borderWidth: 2, pointBackgroundColor: '#00C6FF',
      backgroundColor: ctx => {
        const g = ctx.chart.ctx.createLinearGradient(0,0,0,140);
        g.addColorStop(0,'rgba(0,198,255,0.18)'); g.addColorStop(1,'rgba(0,198,255,0)');
        return g;
      }
    }]
  },
  options: chartOpts()
});

// Bar chart
new Chart(document.getElementById('chart-bar'), {
  type: 'bar',
  data: {
    labels: labels12h,
    datasets: [{
      data: energyData, borderRadius: 4, borderSkipped: false,
      backgroundColor: ctx => {
        const g = ctx.chart.ctx.createLinearGradient(0,0,0,140);
        g.addColorStop(0,'rgba(0,114,255,0.85)'); g.addColorStop(1,'rgba(0,198,255,0.5)');
        return g;
      }
    }]
  },
  options: chartOpts()
});

// Doughnut
new Chart(document.getElementById('chart-donut'), {
  type: 'doughnut',
  data: {
    labels: ['Online','Warning','Offline'],
    datasets: [{
      data: [218,17,13],
      backgroundColor: ['rgba(0,255,178,0.8)','rgba(255,184,0,0.8)','rgba(255,95,87,0.8)'],
      borderColor: ['#010C29'],
      borderWidth: 2, hoverOffset: 6
    }]
  },
  options: {
    responsive: true, cutout: '70%',
    plugins: {
      legend: { position: 'bottom', labels: { color: 'rgba(180,200,255,0.5)', font: { size: 10, family: 'DM Sans' }, boxWidth: 10, padding: 10 } }
    }
  }
});

// Area chart
new Chart(document.getElementById('chart-area'), {
  type: 'line',
  data: {
    labels: ['00','02','04','06','08','10','12','14','16','18','20','22','24'],
    datasets: [{
      data: [800,1200,1100,900,1400,1800,2100,1950,2400,2200,1900,1600,2000],
      tension: 0.5, fill: true, pointRadius: 2,
      borderColor: '#0072FF', borderWidth: 2, pointBackgroundColor: '#00C6FF',
      backgroundColor: ctx => {
        const g = ctx.chart.ctx.createLinearGradient(0,0,0,120);
        g.addColorStop(0,'rgba(0,114,255,0.25)'); g.addColorStop(1,'rgba(0,114,255,0)');
        return g;
      }
    }]
  },
  options: chartOpts()
});

// Scatter
const scatterData = Array.from({length:20}, () => ({ x: Math.random()*10+1, y: Math.random()*8+2 }));
new Chart(document.getElementById('chart-scatter'), {
  type: 'scatter',
  data: { datasets: [{ data: scatterData, backgroundColor: 'rgba(0,198,255,0.65)', pointRadius: 5, pointHoverRadius: 7 }] },
  options: { ...chartOpts(), plugins: { legend: { display: false } } }
});

/* ── LIVE LINE CHART UPDATE ── */
setInterval(() => {
  const chart = Chart.getChart('chart-line');
  if (chart) {
    chart.data.datasets[0].data.push(Math.floor(40 + Math.random() * 25));
    chart.data.datasets[0].data.shift();
    chart.update('none');
  }
}, 2000);

new Chart(document.getElementById('gauge-1','gauge-2'), {
  type: 'doughnut',
  data: {
    datasets: [{
      data: [90,10],
      backgroundColor: ['rgba(255, 0, 43, 0.8)','rgb(0, 11, 40)'],
      borderColor: ['#010C29'],
      borderWidth: 2
    }]
  },
  options: {
        responsive: true,
        maintainAspectRatio: false,
        circumference: 180,
        rotation: -90,
        cutout: '70%'
    }
 });
new Chart(document.getElementById('gauge-2'), {
  type: 'doughnut',
  data: {
    datasets: [{
      data: [50,50],
      backgroundColor: ['rgba(229, 255, 0, 0.8)','rgb(0, 11, 40)'],
      borderColor: ['#010C29'],
      borderWidth: 2
    }]
  },
  options: {
        responsive: true,
        maintainAspectRatio: false,
        circumference: 180,
        rotation: -90,
        cutout: '70%'
    }
 });
 new Chart(document.getElementById('gauge-3'), {
  type: 'doughnut',
  data: {
    datasets: [{
      data: [95,5],
      backgroundColor: ['rgba(0, 255, 98, 0.8)','rgb(0, 11, 40)'],
      borderColor: ['#010C29'],
      borderWidth: 2
    }]
  },
  options: {
        responsive: true,
        maintainAspectRatio: false,
        circumference: 180,
        rotation: -90,
        cutout: '70%'
    }
 });
new Chart(document.getElementById('gauge-4'), {
  type: 'doughnut',
  data: {
    datasets: [{
      data: [75,25],
      backgroundColor: ['rgba(0, 162, 255, 0.8)','rgb(0, 11, 40)'],
      borderColor: ['#010C29'],
      borderWidth: 2
    }]
  },
  options: {
        responsive: true,
        maintainAspectRatio: false,
        circumference: 180,
        rotation: -90,
        cutout: '70%'
    }
 });
 
let map;
        let marker;

        const locations = {
            microchip: { lat: 12.87868, lng: 80.21466 }, 
            isro: { lat: 8.28252, lng: 77.56798 },      
            drdo: { lat: 13.12370, lng: 80.09834 }  
        };

        function initMap() {
            map = new google.maps.Map(document.getElementById("map"), {
                center: locations.microchip,
                zoom: 12
            });

            marker = new google.maps.Marker({
                position: locations.microchip,
                map: map
            });
        }

        function loadLocation(place) {
            const loc = locations[place];

            map.setCenter(loc);
            map.setZoom(14);

            marker.setPosition(loc);
        }