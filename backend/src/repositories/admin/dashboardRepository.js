const db = require('../../config/database');

const dashboardRepository = {
    async getDashboardMetrics() {
        // 1. Overview
        const overviewQuery = `
            SELECT 
                (SELECT COUNT(*) FROM bookings WHERE DATE(created_at) = CURDATE()) AS bookingsToday,
                (SELECT COALESCE(SUM(total_visitors), 0) FROM bookings WHERE visit_date = CURDATE() AND payment_status = 'SUCCESS') AS visitorsToday,
                (SELECT COALESCE(SUM(amount), 0) FROM booking_payments WHERE payment_status = 'SUCCESS' AND DATE(paid_at) = CURDATE()) AS revenueToday,
                (SELECT COUNT(*) FROM booking_payments WHERE payment_status = 'SUCCESS' AND DATE(created_at) = CURDATE()) AS successfulPayments,
                (SELECT COUNT(*) FROM booking_payments WHERE payment_status IN ('PENDING', 'FAILED') AND DATE(created_at) = CURDATE()) AS pendingFailedPayments
        `;
        
        // 2. Upcoming Visits (Next 7 Days)
        const upcomingQuery = `
            WITH RECURSIVE dates AS (
                SELECT CURDATE() as d
                UNION ALL
                SELECT d + INTERVAL 1 DAY FROM dates WHERE d < CURDATE() + INTERVAL 6 DAY
            )
            SELECT 
                d as date,
                COUNT(b.id) as bookings,
                COALESCE(SUM(b.total_visitors), 0) as visitors,
                COALESCE(SUM(b.grand_total), 0) as expectedRevenue
            FROM dates
            LEFT JOIN bookings b ON b.visit_date = d AND b.payment_status = 'SUCCESS'
            GROUP BY d
            ORDER BY d ASC
        `;

        // 3. Booking Statistics
        const statsQuery = `
            SELECT 
                COUNT(*) as total,
                SUM(CASE WHEN booking_status = 'CONFIRMED' THEN 1 ELSE 0 END) as confirmed,
                SUM(CASE WHEN payment_status = 'PENDING' OR booking_status = 'PAYMENT_PENDING' THEN 1 ELSE 0 END) as pending,
                SUM(CASE WHEN booking_status IN ('CANCELLED', 'REFUNDED') THEN 1 ELSE 0 END) as cancelled,
                SUM(CASE WHEN payment_status = 'FAILED' THEN 1 ELSE 0 END) as failed
            FROM bookings
        `;

        // 4. Revenue Summary
        const revenueQuery = `
            SELECT 
                (SELECT COALESCE(SUM(amount), 0) FROM booking_payments WHERE payment_status = 'SUCCESS' AND DATE(paid_at) = CURDATE()) AS revenueToday,
                (SELECT COALESCE(SUM(amount), 0) FROM booking_payments WHERE payment_status = 'SUCCESS' AND YEARWEEK(paid_at, 1) = YEARWEEK(CURDATE(), 1)) AS revenueThisWeek,
                (SELECT COALESCE(SUM(amount), 0) FROM booking_payments WHERE payment_status = 'SUCCESS' AND MONTH(paid_at) = MONTH(CURDATE()) AND YEAR(paid_at) = YEAR(CURDATE())) AS revenueThisMonth
        `;

        const [[overviewResult]] = await db.query(overviewQuery);
        const [upcomingResult] = await db.query(upcomingQuery);
        const [[statsResult]] = await db.query(statsQuery);
        const [[revenueResult]] = await db.query(revenueQuery);

        return {
            overview: {
                bookingsToday: parseInt(overviewResult.bookingsToday) || 0,
                visitorsToday: parseInt(overviewResult.visitorsToday) || 0,
                revenueToday: parseFloat(overviewResult.revenueToday) || 0,
                successfulPayments: parseInt(overviewResult.successfulPayments) || 0,
                pendingFailedPayments: parseInt(overviewResult.pendingFailedPayments) || 0
            },
            upcomingVisits: upcomingResult.map(row => {
                const dateStr = new Date(row.date).toISOString().split('T')[0];
                return {
                    date: dateStr,
                    bookings: parseInt(row.bookings) || 0,
                    visitors: parseInt(row.visitors) || 0,
                    expectedRevenue: parseFloat(row.expectedRevenue) || 0
                };
            }),
            bookingStats: {
                total: parseInt(statsResult.total) || 0,
                confirmed: parseInt(statsResult.confirmed) || 0,
                pending: parseInt(statsResult.pending) || 0,
                cancelled: parseInt(statsResult.cancelled) || 0,
                failed: parseInt(statsResult.failed) || 0
            },
            revenue: {
                today: parseFloat(revenueResult.revenueToday) || 0,
                thisWeek: parseFloat(revenueResult.revenueThisWeek) || 0,
                thisMonth: parseFloat(revenueResult.revenueThisMonth) || 0
            }
        };
    }
};

module.exports = dashboardRepository;
