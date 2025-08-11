
const CG = { base: 'https://api.coingecko.com/api/v3' };
async function getPrice(coinId, dateStr){
  const url = `${CG.base}/coins/${coinId}/history?date=${dateStr}`;
  const r = await fetch(url); if(!r.ok) throw new Error('API');
  const d = await r.json();
  return d?.market_data?.current_price?.usd || null;
}
async function getCurrent(coinId){
  const url = `${CG.base}/simple/price?ids=${coinId}&vs_currencies=usd`;
  const r = await fetch(url); const d = await r.json();
  return d?.[coinId]?.usd || null;
}
async function timeMachineCalc(){
  const coin = document.getElementById('tm-coin').value.trim();
  const amount = parseFloat(document.getElementById('tm-amount').value);
  const date = document.getElementById('tm-date').value;
  if(!coin || !amount || !date) return alert('Bitte Eingaben prüfen.');
  const [y,m,d] = date.split('-');
  const past = await getPrice(coin, `${d}-${m}-${y}`);
  const now = await getCurrent(coin);
  if(!past || !now) return alert('Keine Daten gefunden.');
  const units = amount/past, nowVal = units*now, roi = ((nowVal-amount)/amount)*100;
  document.getElementById('tm-out').innerHTML =
    `Damals: $${past.toFixed(2)} | Heute: $${now.toFixed(2)}<br>Einheiten: ${units.toFixed(6)}<br>Heutiger Wert: $${nowVal.toFixed(2)}<br><b>ROI: ${roi.toFixed(2)} %</b>`;
}
async function realityCheck(){
  const coin = document.getElementById('rc-coin').value.trim();
  const now = await getCurrent(coin); if(!now) return alert('Keine Daten.');
  const dt = new Date(Date.now()-30*24*3600*1000);
  const dd = String(dt.getDate()).padStart(2,'0'), mm = String(dt.getMonth()+1).padStart(2,'0'), yy = dt.getFullYear();
  const past = await getPrice(coin, `${dd}-${mm}-${yy}`);
  let verdict = 'Neutral';
  if(past){
    const ch = (now-past)/past*100;
    verdict = ch>5?'Tendenz Aufwärts':ch<-5?'Tendenz Abwärts':'Seitwärts/Neutral';
    document.getElementById('rc-out').innerHTML = `Aktuell: $${now.toFixed(2)} | vor 30 Tagen: $${past.toFixed(2)}<br>Veränderung: ${ch.toFixed(2)} %<br><b>${verdict}</b>`;
  } else {
    document.getElementById('rc-out').innerHTML = `Aktuell: $${now.toFixed(2)}<br>${verdict}`;
  }
}
