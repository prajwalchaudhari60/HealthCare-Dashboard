const API_URL = "https://fedskillstest.coalitiontechnologies.workers.dev";
let bpChartInstance = null;

document.addEventListener("DOMContentLoaded", fetchPatientData);

function fetchPatientData() {
  const authKey = btoa("coalition:skills-test");

  fetch(API_URL, {
    headers: {
      Authorization: `Basic ${authKey}`,
    },
  })
    .then(res => res.json())
    .then(data => {
      const patient = data.find(p => p.name === "Jessica Taylor");
      if (!patient) return;

      fillPatientInfo(patient);
      fillVitals(patient);
      drawBPChart(patient);
    })
    .catch(err => console.error("API Error:", err));
}

function fillPatientInfo(patient) {
  document.getElementById("patientName").innerText = patient.name;
  document.getElementById("dob").innerText = patient.date_of_birth;
  document.getElementById("gender").innerText = patient.gender;
  document.getElementById("phone").innerText = patient.phone_number;
  document.getElementById("insurance").innerText = patient.insurance_type;
}

function fillVitals(patient) {
  const latest = patient.diagnosis_history[0];

  document.getElementById("systolicValue").innerText =
    latest.blood_pressure.systolic.value;

  document.getElementById("diastolicValue").innerText =
    latest.blood_pressure.diastolic.value;

  document.getElementById("respRate").innerText =
    latest.respiratory_rate.value;

  document.getElementById("tempValue").innerText =
    latest.temperature.value + " °F";

  document.getElementById("heartRate").innerText =
    latest.heart_rate.value + " BPM";
}

function drawBPChart(patient) {
  const history = patient.diagnosis_history.slice().reverse();

  const labels = history.map(h => h.month);
  const systolic = history.map(h => h.blood_pressure.systolic.value);
  const diastolic = history.map(h => h.blood_pressure.diastolic.value);

  const ctx = document.getElementById("bpChart").getContext("2d");

  if (bpChartInstance) bpChartInstance.destroy();

  bpChartInstance = new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: "Systolic",
          data: systolic,
          borderColor: "#ec4899",
          tension: 0.4,
          pointRadius: 5,
        },
        {
          label: "Diastolic",
          data: diastolic,
          borderColor: "#8b5cf6",
          tension: 0.4,
          pointRadius: 5,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
      },
      scales: {
        y: {
          min: 60,
          max: 180,
          ticks: { stepSize: 20 },
        },
      },
    },
  });
}


/* Sidebar scrolling & activation behavior */
function scrollActivePatientIntoView() {
  const active = document.querySelector('.patient-list li.active');
  if (active) active.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function setupPatientListInteraction() {
  const list = document.querySelector('.patient-list');
  if (!list) return;

  // Click-to-activate + scroll
  list.addEventListener('click', (e) => {
    const li = e.target.closest('li');
    if (!li) return;
    list.querySelectorAll('li').forEach((item) => item.classList.remove('active'));
    li.classList.add('active');
    li.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });

  // Initial scroll to active item on load
  const active = list.querySelector('li.active');
  if (active) {
    // use a small delay to ensure layout/render has stabilized
    setTimeout(() => active.scrollIntoView({ behavior: 'smooth', block: 'center' }), 80);
  }
}

// Initialize interactions after DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  setupPatientListInteraction();
});
