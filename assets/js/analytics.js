// Analytics Dashboard Configuration
const config = {
    websiteId: 'YOUR-WEBSITE-ID',
    apiEndpoint: 'https://analytics.your-domain.com/api',
    refreshInterval: 30000 // 30 seconds
};

// Initialize charts
let pageviewsChart, topPagesChart;

// Initialize the dashboard
async function initDashboard() {
    await setupCharts();
    await updateMetrics();
    setInterval(updateMetrics, config.refreshInterval);
}

// Set up Chart.js instances
function setupCharts() {
    // Page Views Over Time Chart
    const pageviewsCtx = document.getElementById('pageviews-chart').getContext('2d');
    pageviewsChart = new Chart(pageviewsCtx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Page Views',
                data: [],
                borderColor: '#4CAF50',
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });

    // Top Pages Chart
    const topPagesCtx = document.getElementById('top-pages-chart').getContext('2d');
    topPagesChart = new Chart(topPagesCtx, {
        type: 'bar',
        data: {
            labels: [],
            datasets: [{
                label: 'Views',
                data: [],
                backgroundColor: '#2196F3'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

// Update all metrics and charts
async function updateMetrics() {
    try {
        const metrics = await fetchMetrics();
        updateMetricDisplay('realtime-visitors', metrics.realtime);
        updateMetricDisplay('page-views', metrics.pageviews);
        updateMetricDisplay('unique-visitors', metrics.unique);
        updateMetricDisplay('avg-time', formatDuration(metrics.avgTime));
        
        updateCharts(metrics);
    } catch (error) {
        console.error('Error updating metrics:', error);
    }
}

// Fetch metrics from Umami API
async function fetchMetrics() {
    const response = await fetch(`${config.apiEndpoint}/websites/${config.websiteId}/metrics`, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('analytics_token')}`
        }
    });
    
    if (!response.ok) {
        throw new Error('Failed to fetch metrics');
    }
    
    return await response.json();
}

// Update individual metric display
function updateMetricDisplay(elementId, value) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = value;
    }
}

// Format duration in seconds to human-readable format
function formatDuration(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}m ${remainingSeconds}s`;
}

// Update charts with new data
function updateCharts(metrics) {
    // Update Page Views chart
    pageviewsChart.data.labels = metrics.pageviewsData.labels;
    pageviewsChart.data.datasets[0].data = metrics.pageviewsData.values;
    pageviewsChart.update();

    // Update Top Pages chart
    topPagesChart.data.labels = metrics.topPagesData.labels;
    topPagesChart.data.datasets[0].data = metrics.topPagesData.values;
    topPagesChart.update();
}

// Initialize the dashboard when the page loads
document.addEventListener('DOMContentLoaded', initDashboard); 