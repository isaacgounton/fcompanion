
// Function to fetch data from the Adzuna API
async function fetchAdzunaData() {
    const response = await fetch('https://api.adzuna.com/v1/api/jobs/gb/search/1?app_id=5095b6aa&app_key=b73e32a7d83cf08fd5f7c744a3709da3');
    const data = await response.json();
    return data.results;
}

// Function to process the data and extract the top in-demand skills
function processSkillsData(jobs) {
    const skillsCount = {};

    jobs.forEach(job => {
        const skills = job.category.label.split(','); // Assuming skills are in the category label

        skills.forEach(skill => {
            skill = skill.trim();
            if (skillsCount[skill]) {
                skillsCount[skill]++;
            } else {
                skillsCount[skill] = 1;
            }
        });
    });

    // Convert the skillsCount object to an array and sort it by count
    const sortedSkills = Object.entries(skillsCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10); // Get the top 10 skills

    return sortedSkills;
}

// Function to render the chart
async function renderSkillsChart() {
    const jobsData = await fetchAdzunaData();
    const skillsData = processSkillsData(jobsData);

    const ctx = document.getElementById('skillsChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar', // You can change this to 'line', 'pie', etc.
        data: {
            labels: skillsData.map(skill => skill[0]),
            datasets: [{
                label: 'Top in-demand Skills',
                data: skillsData.map(skill => skill[1]),
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Call the function to render the chart when the page loads
window.onload = renderSkillsChart;
