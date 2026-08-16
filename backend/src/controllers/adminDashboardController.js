const dashboardRepository = require('../repositories/admin/dashboardRepository');

async function getDashboard(req, res, next) {
    try {
        const data = await dashboardRepository.getDashboardMetrics();
        return res.status(200).json({
            success: true,
            data
        });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getDashboard
};
