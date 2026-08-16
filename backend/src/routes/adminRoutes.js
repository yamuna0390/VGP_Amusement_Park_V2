const express = require('express');
const router = express.Router();
const adminMiddleware = require('../middleware/adminMiddleware');
const adminBookingController = require('../controllers/adminBookingController');
const adminDashboardController = require('../controllers/adminDashboardController');
const adminTicketController = require('../controllers/adminTicketController');

// Apply admin authentication middleware to all admin routes
router.use(adminMiddleware);

// Admin Dashboard
router.get('/dashboard', adminDashboardController.getDashboard);

// Admin Rides Management
const adminRideController = require('../controllers/adminRideController');
router.get('/rides', adminRideController.getAdminRides);
router.get('/rides/:id', adminRideController.getAdminRideById);
router.post('/rides', adminRideController.createAdminRide);
router.put('/rides/:id', adminRideController.updateAdminRide);
router.patch('/rides/:id/status', adminRideController.updateAdminRideStatus);

// Admin Offers Management
const adminOfferController = require('../controllers/adminOfferController');
router.get('/offers', adminOfferController.getAdminOffers);
router.get('/offers/:id', adminOfferController.getAdminOfferById);
router.post('/offers', adminOfferController.createAdminOffer);
router.put('/offers/:id', adminOfferController.updateAdminOffer);
router.patch('/offers/:id/status', adminOfferController.updateAdminOfferStatus);

// Admin Ticket Management
router.get('/ticket-types', adminTicketController.getTickets);
router.get('/ticket-types/:id', adminTicketController.getTicketById);
router.post('/ticket-types', adminTicketController.createTicket);
router.put('/ticket-types/:id', adminTicketController.updateTicket);
router.patch('/ticket-types/:id/status', adminTicketController.updateTicketStatus);

// Admin Food & Add-ons Management
const adminAddonController = require('../controllers/adminAddonController');
router.get('/food-items', adminAddonController.getAddons);
router.get('/food-items/:id', adminAddonController.getAddonById);
router.post('/food-items', adminAddonController.createAddon);
router.put('/food-items/:id', adminAddonController.updateAddon);
router.patch('/food-items/:id/status', adminAddonController.updateAddonStatus);

// Admin Booking Management
router.get('/bookings', adminBookingController.getAdminBookings);
router.get('/bookings/:id', adminBookingController.getAdminBookingDetails);
router.get('/bookings/:id/ticket-pdf', adminBookingController.getAdminTicketPdf);

// Admin Notifications
const adminNotificationController = require('../controllers/adminNotificationController');
router.get('/notifications', adminNotificationController.getNotifications);
router.get('/notifications/unread-count', adminNotificationController.getUnreadCount);
router.patch('/notifications/:id/read', adminNotificationController.markAsRead);

module.exports = router;
