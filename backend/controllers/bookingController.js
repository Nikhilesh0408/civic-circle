const { createClient } = require('@supabase/supabase-js');
const nodemailer = require('nodemailer');
require('dotenv').config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// Email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Send email function
const sendEmail = async (to, subject, html) => {
  try {
    await transporter.sendMail({
      from: `"Civic Circle" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    console.log(`✅ Email sent to ${to}`);
  } catch (error) {
    console.error('❌ Email error:', error);
  }
};

// CREATE BOOKING
const createBooking = async (req, res) => {
  try {
    const { client_id, client_name, client_email, advisor_id, advisor_name, advisor_email, booking_date, booking_time, message } = req.body;

    // Save booking to database
    const { data, error } = await supabase
      .from('bookings')
      .insert([{
        client_id, client_name, client_email,
        advisor_id, advisor_name, advisor_email,
        booking_date, booking_time, message,
        status: 'pending'
      }])
      .select();

    if (error) throw error;

    // Email to client
    await sendEmail(
      client_email,
      '✅ Booking Confirmed — Civic Circle',
      `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0f172a; color: white; padding: 30px; border-radius: 15px;">
        <h1 style="color: #facc15;">⚖️ Civic Circle</h1>
        <h2 style="color: #facc15;">Booking Confirmed!</h2>
        <p>Dear <strong>${client_name}</strong>,</p>
        <p>Your consultation has been booked successfully!</p>
        <div style="background: #1e293b; padding: 20px; border-radius: 10px; margin: 20px 0;">
          <p><strong style="color: #facc15;">Legal Advisor:</strong> ${advisor_name}</p>
          <p><strong style="color: #facc15;">Date:</strong> ${booking_date}</p>
          <p><strong style="color: #facc15;">Time:</strong> ${booking_time}</p>
          <p><strong style="color: #facc15;">Status:</strong> Pending Confirmation</p>
        </div>
        <p>You will receive a reminder email one day before your consultation.</p>
        <p style="color: #94a3b8;">For any queries, visit <a href="http://localhost:3000" style="color: #facc15;">Civic Circle</a></p>
      </div>
      `
    );

    // Email to advisor
    await sendEmail(
      advisor_email,
      '📅 New Consultation Booking — Civic Circle',
      `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0f172a; color: white; padding: 30px; border-radius: 15px;">
        <h1 style="color: #facc15;">⚖️ Civic Circle</h1>
        <h2 style="color: #facc15;">New Booking Request!</h2>
        <p>Dear <strong>${advisor_name}</strong>,</p>
        <p>You have received a new consultation booking request!</p>
        <div style="background: #1e293b; padding: 20px; border-radius: 10px; margin: 20px 0;">
          <p><strong style="color: #facc15;">Client:</strong> ${client_name}</p>
          <p><strong style="color: #facc15;">Email:</strong> ${client_email}</p>
          <p><strong style="color: #facc15;">Date:</strong> ${booking_date}</p>
          <p><strong style="color: #facc15;">Time:</strong> ${booking_time}</p>
          ${message ? `<p><strong style="color: #facc15;">Message:</strong> ${message}</p>` : ''}
        </div>
        <p>Please login to Civic Circle to confirm or reject this booking.</p>
        <p style="color: #94a3b8;">Visit <a href="http://localhost:3000" style="color: #facc15;">Civic Circle</a></p>
      </div>
      `
    );

    res.status(201).json({ message: 'Booking created successfully!', booking: data[0] });
  } catch (error) {
    console.error('Booking error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// GET CLIENT BOOKINGS
const getClientBookings = async (req, res) => {
  try {
    const { clientId } = req.params;
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('client_id', clientId)
      .order('booking_date', { ascending: true });

    if (error) throw error;
    res.status(200).json({ bookings: data });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// GET ADVISOR BOOKINGS
const getAdvisorBookings = async (req, res) => {
  try {
    const { advisorId } = req.params;
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('advisor_id', advisorId)
      .order('booking_date', { ascending: true });

    if (error) throw error;
    res.status(200).json({ bookings: data });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// UPDATE BOOKING STATUS
const updateBookingStatus = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { status } = req.body;

    const { data, error } = await supabase
      .from('bookings')
      .update({ status })
      .eq('id', bookingId)
      .select();

    if (error) throw error;

    // Send status update email to client
    if (data[0]) {
      const statusText = status === 'confirmed' ? '✅ Confirmed' : '❌ Rejected';
      await sendEmail(
        data[0].client_email,
        `Booking ${statusText} — Civic Circle`,
        `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0f172a; color: white; padding: 30px; border-radius: 15px;">
          <h1 style="color: #facc15;">⚖️ Civic Circle</h1>
          <h2 style="color: ${status === 'confirmed' ? '#22c55e' : '#ef4444'};">Booking ${statusText}!</h2>
          <p>Dear <strong>${data[0].client_name}</strong>,</p>
          <p>Your consultation booking with <strong>${data[0].advisor_name}</strong> has been <strong>${status}</strong>.</p>
          <div style="background: #1e293b; padding: 20px; border-radius: 10px; margin: 20px 0;">
            <p><strong style="color: #facc15;">Date:</strong> ${data[0].booking_date}</p>
            <p><strong style="color: #facc15;">Time:</strong> ${data[0].booking_time}</p>
          </div>
          ${status === 'confirmed' ? '<p>Please be available at the scheduled time. You will receive a reminder one day before.</p>' : '<p>Please try booking another time slot or contact another advisor.</p>'}
          <p style="color: #94a3b8;">Visit <a href="http://localhost:3000" style="color: #facc15;">Civic Circle</a></p>
        </div>
        `
      );
    }

    res.status(200).json({ message: `Booking ${status}!`, booking: data[0] });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { createBooking, getClientBookings, getAdvisorBookings, updateBookingStatus };